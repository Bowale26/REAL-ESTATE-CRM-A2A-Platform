# Security Specification — Real Estate CRM A2A

## Data Invariants
- A user can only access their own profile and private billing data.
- Properties can be created by any authenticated user, but only modified by the owner.
- Products and Prices are read-only for users (managed by Stripe extension).
- Subscriptions are managed by the Stripe extension and are read-only for users.
- Video Projects are private to the owner.

## The "Dirty Dozen" Payloads (Denial Tests)
1. Update another user's profile `role` to `admin`.
2. Create a property with a fake `ownerId`.
3. Delete a product managed by Stripe.
4. Modify a subscription's `status` field.
5. List all `customers` in the system.
6. Access another user's `subscriptions` sub-collection.
7. Inject a 1MB string into a property `address`.
8. Create a video project without a valid `propertyId`.
9. Set a `winner` field on a property (non-existent field).
10. Update `createdAt` timestamp on an existing project.
11. Read a private list of all leads.
12. Creating a subscription directly (must be done by Stripe extension).

## Test Runner (firestore.rules.test.ts)
Verification of these payloads will be handled via the Judge Agent logic during merge and standard security rule validation.
