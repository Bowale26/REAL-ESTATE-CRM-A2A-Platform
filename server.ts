import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
import firebaseConfig from "./firebase-applet-config.json";

let adminApp: admin.app.App;

console.log("Initializing Firebase Admin for project:", firebaseConfig.projectId);
console.log("Using custom databaseId:", firebaseConfig.firestoreDatabaseId);

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
    try {
      console.log("Using FIREBASE_SERVICE_ACCOUNT from environment.");
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
        projectId: firebaseConfig.projectId
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT, falling back to ADC.", e);
      adminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
      });
    }
  } else {
    console.log("No service account found, using ADC with projectId:", firebaseConfig.projectId);
    try {
      adminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
      });
    } catch (e) {
      console.warn("applicationDefault() failed, falling back to minimal config.", e);
      adminApp = admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  }
} else {
  adminApp = admin.app();
}

console.log("Final Admin Configuration - Project:", adminApp.options.projectId);
console.log("Final Admin Configuration - Credential Type:", adminApp.options.credential ? "Present" : "Missing");

let db: any;
async function initializeFirestore() {
  const databaseId = firebaseConfig.firestoreDatabaseId;
  const projectId = firebaseConfig.projectId;
  
  console.log(`Initializing Cloud Firestore - Project: ${projectId}, DB: ${databaseId || "(default)"}`);
  
  try {
    // Explicitly pass project and database IDs to avoid environment ambiguity
    const firestoreSettings: any = {
      projectId: projectId,
    };
    if (databaseId) {
      firestoreSettings.databaseId = databaseId;
    }

    // Try creating the client directly via standard Firebase Admin
    db = getFirestore(adminApp, databaseId);
    
    // Test the connection immediately (async but don't block startServer indefinitely)
    db.collection("_health_check_").doc("ping").get()
      .then(() => console.log(`✅ Firestore connected successfully to: ${databaseId || "(default)"}`))
      .catch((err: any) => {
        console.warn(`⚠️ Firestore test failed for DB: ${databaseId}. Error: ${err.message}`);
        if (databaseId) {
          console.log("Attempting fallback to default database instance...");
          db = getFirestore(adminApp);
        }
      });
  } catch (err: any) {
    console.error("❌ CRITICAL Firestore Initialization Error:", err.message);
    db = getFirestore(adminApp); // Last ditch effort
  }
}

// Call initialization
initializeFirestore();

console.log("Firestore initialization scheduled.");

// Initialize Stripe Lazily
let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
    }
    stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return stripe;
}

// Unified helper to get user data with failover
async function getUserDoc(userId: string) {
  if (!db) throw new Error("Database not initialized");
  
  try {
    return await db.collection("users").doc(userId).get();
  } catch (err: any) {
    console.error(`❌ Firestore get failed for user ${userId}: ${err.message}`);
    
    // If it's a permission/connectivity issue, try falling back to default DB once
    if (err.code === 7 || err.message.includes("permission") || err.message.includes("database")) {
      console.log("🔄 Attempting failover to default Firestore database...");
      try {
        const fallbackDb = getFirestore(adminApp);
        return await fallbackDb.collection("users").doc(userId).get();
      } catch (fallbackErr: any) {
        console.error("❌ Failover also failed:", fallbackErr.message);
        throw fallbackErr;
      }
    }
    throw err;
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Stripe Webhook needs raw body
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is missing");
      return res.status(400).send("Webhook config error");
    }

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (userId && subscriptionId) {
          const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;
          const yearlyPriceId = process.env.PRICE_YEARLY || process.env.VITE_STRIPE_YEARLY_PRICE_ID;
          const plan = priceId === yearlyPriceId ? 'yearly' : 'monthly';

          await db.collection("users").doc(userId).set({
            subscriptionStatus: "active",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            plan: plan,
            currentPeriodEnd: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          console.log(`✅ Subscription created for user ${userId} (${plan})`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userSnapshot = await db.collection("users")
          .where("stripeSubscriptionId", "==", subscription.id)
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userId = userSnapshot.docs[0].id;
          const priceId = subscription.items.data[0].price.id;
          const yearlyPriceId = process.env.PRICE_YEARLY || process.env.VITE_STRIPE_YEARLY_PRICE_ID;
          const plan = priceId === yearlyPriceId ? 'yearly' : 'monthly';

          await db.collection("users").doc(userId).update({
            subscriptionStatus: subscription.status,
            plan: plan,
            currentPeriodEnd: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`🔄 Subscription updated for user ${userId}: ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userSnapshot = await db.collection("users")
          .where("stripeSubscriptionId", "==", subscription.id)
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userId = userSnapshot.docs[0].id;
          await db.collection("users").doc(userId).update({
            subscriptionStatus: "canceled",
            plan: "none",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`❌ Subscription canceled for user ${userId}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`⚠️ Payment failed for invoice ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Regular JSON parser for other routes
  app.use(express.json());
  app.use(cors());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/config", (req, res) => {
    res.json({
      priceMonthly: process.env.PRICE_MONTHLY || process.env.VITE_STRIPE_MONTHLY_PRICE_ID,
      priceYearly: process.env.PRICE_YEARLY || process.env.VITE_STRIPE_YEARLY_PRICE_ID,
      stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY
    });
  });

  app.post("/api/init-user", async (req, res) => {
    const { userId, email, displayName } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    try {
      if (!db) {
        throw new Error("Firestore not initialized");
      }

      // Use the helper with failover
      const userRef = db.collection("users").doc(userId);
      let docSnapshot;
      try {
        docSnapshot = await userRef.get();
      } catch (e: any) {
        console.log("Initial fetch failed, trying fallback init...");
        const fallbackDb = getFirestore(adminApp);
        docSnapshot = await fallbackDb.collection("users").doc(userId).get();
        db = fallbackDb; // Switch if successful
      }

      if (!docSnapshot.exists) {
        const now = new Date();
        const trialStart = now.getTime(); // Match user's requested 'trialStart' label

        await userRef.set({
          email: email || "",
          displayName: displayName || "",
          trialStart: trialStart, 
          trialStartDate: now.toISOString(),
          subscriptionStatus: "trialing",
          status: "trialing", // User request uses 'status'
          plan: "none",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`🆕 Created CRM profile for user ${userId} with 7-Day Trial`);
        return res.json({ created: true });
      }
      res.json({ created: false, message: "User already exists" });
    } catch (error: any) {
      console.error("❌ Error initializing user in CRM:", error.message);
      
      // Fallback logic for permission errors
      if (error.code === 7 || error.message.includes("permission")) {
         console.error("PERMISSION_DENIED detected. This is a deployment environment issue.");
      }

      res.status(500).json({ 
        error: error.message, 
        code: error.code,
        details: "Firestore access error. Check IAM roles."
      });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { userId, email, priceId } = req.body;

    if (!userId || !email || !priceId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const origin = process.env.FRONTEND_URL || req.headers.origin;
      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/billing`,
        customer_email: email,
        client_reference_id: userId,
        subscription_data: {
          trial_period_days: 7,
          metadata: { userId },
        },
        metadata: { userId },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-portal-session", async (req, res) => {
    const { stripeCustomerId } = req.body;
    if (!stripeCustomerId) {
      return res.status(400).json({ error: "Missing stripeCustomerId" });
    }

    try {
      const origin = process.env.FRONTEND_URL || req.headers.origin;
      const session = await getStripe().billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${origin}/billing`,
      });
      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Check detailed subscription status (7-Day Trial enforcement)
  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userDoc = await getUserDoc(userId);

      if (!userDoc.exists) {
        return res.json({ status: "no_account", access: "blocked", redirect: true, url: "/billing" });
      }

      const userData = userDoc.data();
      if (!userData) return res.status(500).json({ error: "Empty user data" });

      // Enforce 7-Day Trial (Match user's requested logic)
      const now = Date.now();
      const trialStart = userData.trialStart || (userData.trialStartDate ? new Date(userData.trialStartDate).getTime() : 0);
      const trialDuration = 7 * 24 * 60 * 60 * 1000;
      const trialExpired = trialStart && (now - trialStart) > trialDuration;
      
      const isActive = userData.subscriptionStatus === "active" || userData.status === "active";

      if (trialExpired && !isActive) {
        return res.json({
          ...userData,
          status: "trial_expired",
          access: "blocked",
          redirect: true,
          url: "/billing",
          trialDaysLeft: 0
        });
      }

      // Valid Trial or Active Subscription
      const daysLeft = trialStart ? Math.ceil((trialStart + trialDuration - now) / (1000 * 60 * 60 * 24)) : 0;

      return res.json({
        ...userData,
        status: isActive ? "active" : "trial",
        access: "full",
        redirect: false,
        trialDaysLeft: isActive ? 0 : Math.max(0, daysLeft),
      });

    } catch (error: any) {
      console.error("Database connection failed:", error.message);
      // Fallback: If DB check fails, protect by showing pricing/billing
      res.json({ redirect: true, url: "/billing", error: error.message });
    }
  });

  // Check trial/subscription status (Legacy endpoint preserved for compatibility)
  app.get("/api/user-status/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const doc = await db.collection("users").doc(userId).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(doc.data());
    } catch (error: any) {
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

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
