import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import admin from "firebase-admin";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT, falling back to default.", e);
      admin.initializeApp();
    }
  } else {
    // In Google Cloud Run, it will use the service account automatically.
    admin.initializeApp();
  }
}

const db = admin.firestore();

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

async function startServer() {
  const app = express();
  const PORT = 3000;

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
          const plan = priceId === process.env.VITE_STRIPE_YEARLY_PRICE_ID ? 'yearly' : 'monthly';

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
          const plan = priceId === process.env.VITE_STRIPE_YEARLY_PRICE_ID ? 'yearly' : 'monthly';

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

  app.post("/api/create-checkout-session", async (req, res) => {
    const { userId, email, priceId } = req.body;

    if (!userId || !email || !priceId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/billing`,
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
      const session = await getStripe().billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${req.headers.origin}/billing`,
      });
      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Check detailed subscription status (Trial/Paid)
  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userDoc = await db.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        return res.json({ status: "no_account", access: "blocked", trialDaysLeft: 0 });
      }

      const userData = userDoc.data();
      if (!userData) return res.status(500).json({ error: "Empty user data" });

      const now = new Date();

      // Priority 1: Check active Stripe subscription
      if (userData.stripeSubscriptionId && userData.subscriptionStatus === "active") {
        return res.json({
          ...userData,
          status: userData.subscriptionStatus,
          access: "full",
          label: "Subscribed",
        });
      }

      // Priority 2: Check trial period (7 days from trialStart)
      const trialStart = userData.trialStart ? (userData.trialStart.toDate ? userData.trialStart.toDate() : new Date(userData.trialStart)) : null;
      if (trialStart) {
        const trialEndsAt = new Date(trialStart);
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);
        
        const diffMs = trialEndsAt.getTime() - now.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (daysLeft > 0) {
          return res.json({
            ...userData,
            status: "trial",
            access: "full",
            trialDaysLeft: daysLeft,
            trialEndDate: trialEndsAt.toISOString(),
          });
        }
      }

      // Trial expired, no active subscription
      res.json({
        ...userData,
        status: "trial_expired",
        access: "blocked",
        trialDaysLeft: 0,
        redirectTo: "/billing",
      });
    } catch (error: any) {
      console.error("Status check error:", error);
      res.status(500).json({ error: error.message });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
