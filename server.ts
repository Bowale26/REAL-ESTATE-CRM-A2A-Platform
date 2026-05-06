import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import Stripe from "stripe";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe Lazily
let stripeClient: Stripe | null = null;
function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is missing");
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// Initialize Firebase Admin Lazily
let db: admin.firestore.Firestore | null = null;
function getFirestore() {
  if (!db) {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    db = admin.firestore();
  }
  return db;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use raw parser for Stripe webhooks
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const stripe = getStripe();
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
      } else {
        event = req.body;
      }
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const firestore = getFirestore();

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by stripe customer ID
        const usersSnapshot = await firestore.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
        
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: subscription.status,
            priceId: subscription.items.data[0].price.id,
            trialEnd: subscription.trial_end,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const usersSnapshot = await firestore.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: "canceled",
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
        break;
      }
      case "customer.subscription.trial_will_end": {
        // Send reminder (Mocking here, but in real app would trigger email)
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Sending 3-day trial reminder for subscription: ${subscription.id}`);
        break;
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // Existing Google OAuth Routes
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

  // Stripe Checkout Session Endpoint
  app.post("/api/create-checkout-session", async (req, res) => {
    const { priceId, userId, userEmail, trialEnabled } = req.body;
    const stripe = getStripe();

    try {
      // Find or Create Stripe Customer
      let customerId: string;
      const firestore = getFirestore();
      const userRef = firestore.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists && userDoc.data()?.stripeCustomerId) {
        customerId = userDoc.data()?.stripeCustomerId;
      } else {
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: { userId }
        });
        customerId = customer.id;
        await userRef.set({ stripeCustomerId: customerId }, { merge: true });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        subscription_data: trialEnabled ? {
          trial_period_days: 7,
        } : undefined,
        success_url: `${req.headers.origin}/settings?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/settings`,
        metadata: { userId }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating stripe session:", error);
      res.status(500).json({ error: error.message });
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
