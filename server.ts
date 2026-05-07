import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import Stripe from "stripe";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization for Stripe
let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// Lazy initialization for Firebase Admin
let db: admin.firestore.Firestore | null = null;
const getDb = () => {
  if (!db && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      
      const parsedKey = typeof serviceAccount === "string" && serviceAccount.startsWith("{")
        ? JSON.parse(serviceAccount) 
        : serviceAccount;

      if (admin.apps.length === 0) {
        const config: admin.AppOptions = {
          databaseURL: "https://ais-us-west2-bb0457d9fa664a64b.firebaseio.com"
        };

        if (typeof parsedKey === "object") {
          config.credential = admin.credential.cert(parsedKey);
        }

        admin.initializeApp(config);
        console.log("Firebase Admin Initialized Successfully");
      }
      db = admin.firestore();
    } catch (error: any) {
      console.error("CRITICAL: Firebase Init Failed:", error.message);
      // Fallback: try to initialize without credentials if possible (e.g. running on GCP)
      try {
        if (admin.apps.length === 0) {
          admin.initializeApp({
            databaseURL: "https://ais-us-west2-bb0457d9fa664a64b.firebaseio.com"
          });
          db = admin.firestore();
        }
      } catch (innerError: any) {
        console.error("Firebase Admin Fallback Initialization Failed:", innerError.message);
      }
    }
  }
  return db;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google OAuth Config
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.APP_URL || "http://localhost:3000"}/auth/callback`
  );

  // Authentication Routes
  app.get("/api/auth/url", (req, res) => {
    const scopes = [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent"
    });

    res.json({ url });
  });

  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      // In a real app, you'd store tokens in a session/DB
      // For this demo, we'll just send success back to the opener
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '*');
              window.close();
            </script>
            <p>Authentication successful. Synchronizing with Google Workspace...</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error exchanging code for tokens", error);
      res.status(500).send("Authentication failed");
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Lead Nurturing Mock API
  app.post("/api/leads/nurture", (req, res) => {
    const { leadEmail } = req.body;
    res.json({ 
      success: true, 
      plan: `AI sequence triggered for ${leadEmail}. 3-step follow-up scheduled.`,
      nextStep: "Drafting personalized market update for Rosedale properties."
    });
  });

  // Stripe Checkout Session Endpoint
  app.post("/api/create-session", async (req, res) => {
    const { priceId, userId, isTrial } = req.body;
    const stripeClient = getStripe();
    const firestore = getDb();

    // Safety check: If Firebase didn't init, don't let Stripe proceed
    if (!admin.apps.length) {
      return res.status(500).json({ error: "Database Connection Down. Firebase Admin initialization failed." });
    }

    if (!stripeClient) {
      return res.status(403).json({ error: "Stripe secret key not configured in environment variables." });
    }

    try {
      const baseUrl = process.env.FRONTEND_URL || process.env.APP_URL || "http://localhost:3000";
      
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        subscription_data: isTrial ? { trial_period_days: 7 } : {},
        success_url: `${baseUrl}/dashboard?success=true`,
        cancel_url: `${baseUrl}/pricing`,
        metadata: { userId: userId }
      });

      // SAFETY WRAPPER: Try to write to Firestore but don't crash if it fails
      if (firestore && userId) {
        try {
          await firestore.collection("subscriptions").doc(userId).set({
            priceId,
            trialStarted: isTrial ? admin.firestore.FieldValue.serverTimestamp() : null,
            status: "pending_payment",
            lastSessionId: session.id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (dbError: any) {
          console.error("Firestore write failed, but session created:", dbError.message);
        }
      }

      // Return both ID and URL to support multiple frontend redirect methods
      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Session Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
