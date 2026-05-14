/**
 * Travixis Travel Care – Database Schema
 * ----------------------------------------
 * Stack : Drizzle ORM + Turso (libSQL / SQLite dialect)
 * IDs   : TEXT (UUID v4)
 * Dates : TEXT stored as ISO-8601 (SQLite has no native TIMESTAMP)
 *
 * Business rules encoded:
 *  - Coverage is annual but capped at 60 days per trip
 *  - Medical emergencies require distance > 100 km from home address
 *  - Medication claims are reimbursed at 30 % (user pays first)
 *  - Baggage indemnity: up to USD 1 200 total OR USD 40 per kg
 */

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Reusable timestamp columns – every table carries these. */
const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
};

// ---------------------------------------------------------------------------
// 1. USERS
// ---------------------------------------------------------------------------

/**
 * Registered customers / policy holders.
 *
 * `homeAddress*` columns represent the user's permanent residence.
 * This is the reference point used to validate the 100 km rule for
 * medical emergency claims (distance must be > 100 km from home).
 *
 * Lat/lon are stored for server-side distance calculations without
 * relying on the client to supply coordinates.
 */
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(), // UUID v4
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone"),
    dateOfBirth: text("date_of_birth"), // ISO-8601 date (YYYY-MM-DD)
    nationalId: text("national_id"), // DNI / Passport / etc.

    // ── Permanent home address (required for coverage validation) ──────────
    homeStreet: text("home_street").notNull(),
    homeCity: text("home_city").notNull(),
    homeState: text("home_state").notNull(),
    homeCountry: text("home_country").notNull().default("AR"),
    homePostalCode: text("home_postal_code"),
    /** Decimal degrees – used to compute distance from home for claims. */
    homeLat: real("home_lat"),
    homeLon: real("home_lon"),

    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_national_id_idx").on(t.nationalId),
  ],
);

// ---------------------------------------------------------------------------
// 2. PLANS (product catalogue)
// ---------------------------------------------------------------------------

/**
 * Insurance plan definitions (e.g. "Basic", "Premium", "Elite").
 * Prices and limits are defined here; actual purchased policies
 * reference a plan via `planId`.
 */
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),

  /** Annual premium in USD */
  annualPriceUsd: real("annual_price_usd").notNull(),

  // ── Coverage limits ────────────────────────────────────────────────────
  /** Maximum days covered per individual trip (business rule: 60). */
  maxDaysPerTrip: integer("max_days_per_trip").notNull().default(60),
  /** Maximum medical coverage per event, in USD. */
  medicalCoverageUsd: real("medical_coverage_usd").notNull(),
  /** Baggage indemnity cap per event, in USD (business rule: 1 200). */
  baggageCoverageUsd: real("baggage_coverage_usd").notNull().default(1200),
  /** Baggage reimbursement per kg when weighing the lost luggage, in USD (business rule: 40). */
  baggagePerKgUsd: real("baggage_per_kg_usd").notNull().default(40),
  /** Medication reimbursement percentage (business rule: 30 %). Stored as 0–100. */
  medicationReimbursePct: real("medication_reimburse_pct")
    .notNull()
    .default(30),

  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

  ...timestamps,
});

// ---------------------------------------------------------------------------
// 3. POLICIES
// ---------------------------------------------------------------------------

/**
 * An individual policy purchased by a user for a specific plan.
 *
 * Coverage validity is annual (startDate → endDate, always 365 days apart).
 * Within that window each trip is further limited to `plans.maxDaysPerTrip`.
 *
 * INDEX STRATEGY for vigency queries:
 *   - (userId, status, startDate, endDate) → fast lookup of active policies
 *     for a given user on a given date.
 */
export const policies = sqliteTable(
  "policies",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    planId: text("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),

    policyNumber: text("policy_number").notNull(), // human-readable ref (e.g. TRX-2025-00042)

    /** ISO-8601 date — annual coverage window start. */
    startDate: text("start_date").notNull(),
    /** ISO-8601 date — annual coverage window end (startDate + 365 days). */
    endDate: text("end_date").notNull(),

    status: text("status", {
      enum: ["active", "expired", "cancelled", "suspended"],
    })
      .notNull()
      .default("active"),

    /** Amount actually paid by the user (may differ from plan price after discounts). */
    paidAmountUsd: real("paid_amount_usd"),

    ...timestamps,
  },
  (t) => [
    uniqueIndex("policies_number_idx").on(t.policyNumber),
    // ── Vigency index: most common query pattern ──────────────────────────
    // "find active policies for user X that are valid today"
    // WHERE user_id = ? AND status = 'active'
    //   AND start_date <= date('now') AND end_date >= date('now')
    index("policies_vigency_idx").on(t.userId, t.status, t.startDate, t.endDate),
    index("policies_user_idx").on(t.userId),
    index("policies_plan_idx").on(t.planId),
  ],
);

// ---------------------------------------------------------------------------
// 4. TRIPS
// ---------------------------------------------------------------------------

/**
 * A trip record associated with a policy.
 * Used to enforce the 60-day-per-trip business rule.
 *
 * A claim must always be linked to an active trip.
 */
export const trips = sqliteTable(
  "trips",
  {
    id: text("id").primaryKey(),
    policyId: text("policy_id")
      .notNull()
      .references(() => policies.id, { onDelete: "restrict" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    /** Destination description (city, country). */
    destination: text("destination").notNull(),
    destinationCountry: text("destination_country"),
    destinationLat: real("destination_lat"),
    destinationLon: real("destination_lon"),

    /** ISO-8601 datetime — trip departure. */
    departureDate: text("departure_date").notNull(),
    /** ISO-8601 datetime — trip return (nullable while travelling). */
    returnDate: text("return_date"),

    /**
     * Duration in days, computed and stored for fast queries.
     * Must be ≤ plans.maxDaysPerTrip (60) — enforced at application layer.
     */
    durationDays: integer("duration_days"),

    status: text("status", {
      enum: ["planned", "active", "completed", "cancelled"],
    })
      .notNull()
      .default("planned"),

    ...timestamps,
  },
  (t) => [
    // Fast lookup of active trips for a user / policy
    index("trips_policy_status_idx").on(t.policyId, t.status),
    index("trips_user_status_idx").on(t.userId, t.status),
    index("trips_departure_idx").on(t.departureDate),
  ],
);

// ---------------------------------------------------------------------------
// 5. CLAIMS (base table)
// ---------------------------------------------------------------------------

/**
 * Master claims table — every claim has a row here.
 * The claim type determines which sub-table contains the extra details.
 *
 * Possible types:
 *  - "medical_emergency" → medicalClaims
 *  - "medication"        → medicationClaims
 *  - "baggage"           → baggageClaims
 *
 * INDEX STRATEGY:
 *  - (policyId, status)  → find all open claims for a policy
 *  - (tripId, type)      → find claims of a specific type for a trip
 *  - (userId, createdAt) → chronological claim history for a user
 */
export const claims = sqliteTable(
  "claims",
  {
    id: text("id").primaryKey(),
    policyId: text("policy_id")
      .notNull()
      .references(() => policies.id, { onDelete: "restrict" }),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "restrict" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    claimNumber: text("claim_number").notNull(), // human-readable (e.g. CLM-2025-00117)

    type: text("type", {
      enum: ["medical_emergency", "medication", "baggage"],
    }).notNull(),

    status: text("status", {
      enum: [
        "draft",          // user started but not submitted
        "submitted",      // awaiting review
        "under_review",   // agent is processing
        "approved",       // claim approved, payment pending
        "paid",           // reimbursement issued
        "rejected",       // denied
        "cancelled",      // withdrawn by user
      ],
    })
      .notNull()
      .default("draft"),

    /** Free-text description provided by the user. */
    description: text("description"),

    /** ISO-8601 datetime when the incident actually occurred. */
    incidentDate: text("incident_date").notNull(),

    /** Total amount claimed by the user (in USD). */
    claimedAmountUsd: real("claimed_amount_usd"),
    /** Amount approved by the adjuster (in USD). */
    approvedAmountUsd: real("approved_amount_usd"),
    /** ISO-8601 datetime when payment was issued. */
    paidAt: text("paid_at"),

    /** Agent notes (internal). */
    agentNotes: text("agent_notes"),
    /** ISO-8601 datetime of resolution. */
    resolvedAt: text("resolved_at"),

    ...timestamps,
  },
  (t) => [
    uniqueIndex("claims_number_idx").on(t.claimNumber),
    index("claims_policy_status_idx").on(t.policyId, t.status),
    index("claims_trip_type_idx").on(t.tripId, t.type),
    index("claims_user_created_idx").on(t.userId, t.createdAt),
    index("claims_status_idx").on(t.status),
  ],
);

// ---------------------------------------------------------------------------
// 6. MEDICAL EMERGENCY CLAIMS
// ---------------------------------------------------------------------------

/**
 * Extra details for medical emergency claims.
 *
 * Business rules:
 *  - Incident must occur > 100 km from the user's home address.
 *  - No initial copay (coverage applies from the first dollar).
 *  - Distance is computed server-side (Haversine) and stored here.
 */
export const medicalClaims = sqliteTable("medical_claims", {
  id: text("id").primaryKey(), // same as claims.id (1-to-1)
  claimId: text("claim_id")
    .notNull()
    .unique()
    .references(() => claims.id, { onDelete: "cascade" }),

  /** Hospital / clinic name. */
  providerName: text("provider_name"),
  providerAddress: text("provider_address"),
  providerCountry: text("provider_country"),
  providerLat: real("provider_lat"),
  providerLon: real("provider_lon"),

  /**
   * Distance in km between incident location and user's home address.
   * Business rule: must be > 100 km.
   * Computed and stored by the server at claim submission time.
   */
  distanceFromHomeKm: real("distance_from_home_km"),

  /** Confirms the 100 km rule was validated at submission (server-side flag). */
  distanceRuleValidated: integer("distance_rule_validated", {
    mode: "boolean",
  })
    .notNull()
    .default(false),

  /** Type of medical event (e.g. "accident", "illness", "dental_emergency"). */
  medicalEventType: text("medical_event_type", {
    enum: ["accident", "illness", "dental_emergency", "other"],
  }),

  diagnosis: text("diagnosis"),
  treatmentSummary: text("treatment_summary"),

  /** No copay applies — this column documents that explicitly. */
  copayAmountUsd: real("copay_amount_usd").notNull().default(0),

  /** Was the user hospitalised? */
  hospitalized: integer("hospitalized", { mode: "boolean" }).default(false),
  hospitalizationDays: integer("hospitalization_days"),

  ...timestamps,
});

// ---------------------------------------------------------------------------
// 7. MEDICATION CLAIMS
// ---------------------------------------------------------------------------

/**
 * Extra details for medication reimbursement claims.
 *
 * Business rules:
 *  - User pays the full cost upfront.
 *  - Reimbursement is 30 % of the approved amount (plans.medicationReimbursePct).
 *  - `reimbursedAmountUsd` = approvedAmountUsd × 0.30, computed at approval.
 */
export const medicationClaims = sqliteTable("medication_claims", {
  id: text("id").primaryKey(),
  claimId: text("claim_id")
    .notNull()
    .unique()
    .references(() => claims.id, { onDelete: "cascade" }),

  /** Pharmacy / dispensary name. */
  pharmacyName: text("pharmacy_name"),
  pharmacyCountry: text("pharmacy_country"),

  /** List of medications as free text or JSON string. */
  medicationList: text("medication_list"),

  /** Total amount the user paid at the pharmacy (in USD). */
  userPaidAmountUsd: real("user_paid_amount_usd").notNull(),

  /**
   * Reimbursement percentage applied (mirrors plans.medicationReimbursePct).
   * Stored here so historical claims remain accurate even if the plan changes.
   */
  reimbursementPct: real("reimbursement_pct").notNull().default(30),

  /**
   * Final reimbursement amount = userPaidAmountUsd × (reimbursementPct / 100).
   * Computed and stored at claim approval.
   */
  reimbursedAmountUsd: real("reimbursed_amount_usd"),

  /** Prescription required? */
  prescriptionRequired: integer("prescription_required", {
    mode: "boolean",
  }).default(true),

  ...timestamps,
});

// ---------------------------------------------------------------------------
// 8. BAGGAGE CLAIMS
// ---------------------------------------------------------------------------

/**
 * Extra details for baggage loss / damage claims.
 *
 * Business rules:
 *  - Maximum indemnity: USD 1 200 per event (plans.baggageCoverageUsd).
 *  - Alternative calculation: USD 40 × declared weight in kg (plans.baggagePerKgUsd).
 *  - Approved amount = min(claimedAmountUsd, max(weightBasedAmountUsd, 1200)).
 *  - "Total loss" flag changes the calculation path.
 */
export const baggageClaims = sqliteTable("baggage_claims", {
  id: text("id").primaryKey(),
  claimId: text("claim_id")
    .notNull()
    .unique()
    .references(() => claims.id, { onDelete: "cascade" }),

  /** Airline / transport company responsible. */
  carrierName: text("carrier_name"),
  /** Airline Property Irregularity Report number. */
  pirNumber: text("pir_number"),

  baggageType: text("baggage_type", {
    enum: ["checked", "carry_on", "sports_equipment", "other"],
  }),

  /** True = total loss (item not found). False = partial loss or damage. */
  totalLoss: integer("total_loss", { mode: "boolean" }).notNull().default(true),

  /** Weight of lost/damaged baggage in kg (used for per-kg calculation). */
  weightKg: real("weight_kg"),

  /**
   * Indemnity based on weight: weightKg × plans.baggagePerKgUsd (≤ 40 USD/kg).
   * Computed server-side at submission.
   */
  weightBasedAmountUsd: real("weight_based_amount_usd"),

  /**
   * Cap applied from the plan (mirrors plans.baggageCoverageUsd = 1 200).
   * Stored for audit purposes.
   */
  coverageCapUsd: real("coverage_cap_usd").notNull().default(1200),

  /** Was the claim reported to the carrier? */
  reportedToCarrier: integer("reported_to_carrier", {
    mode: "boolean",
  }).default(false),
  reportedToCarrierAt: text("reported_to_carrier_at"),

  ...timestamps,
});

// ---------------------------------------------------------------------------
// 9. CLAIM DOCUMENTS (evidence files)
// ---------------------------------------------------------------------------

/**
 * Files attached to a claim (invoices, prescriptions, police reports, etc.).
 * Stored as references to an object store (e.g. Cloudflare R2 / S3).
 */
export const claimDocuments = sqliteTable(
  "claim_documents",
  {
    id: text("id").primaryKey(),
    claimId: text("claim_id")
      .notNull()
      .references(() => claims.id, { onDelete: "cascade" }),

    documentType: text("document_type", {
      enum: [
        "invoice",
        "prescription",
        "medical_report",
        "pir_report",
        "police_report",
        "photo",
        "other",
      ],
    }).notNull(),

    /** Object storage key (path inside the bucket). */
    storageKey: text("storage_key").notNull(),
    /** Public or pre-signed URL (may be temporary). */
    url: text("url"),
    fileName: text("file_name"),
    mimeType: text("mime_type"),
    fileSizeBytes: integer("file_size_bytes"),

    uploadedBy: text("uploaded_by").references(() => users.id, {
      onDelete: "set null",
    }),

    ...timestamps,
  },
  (t) => [
    index("claim_documents_claim_idx").on(t.claimId),
    index("claim_documents_type_idx").on(t.claimId, t.documentType),
  ],
);

// ---------------------------------------------------------------------------
// 10. CLAIM STATUS HISTORY (audit log)
// ---------------------------------------------------------------------------

/**
 * Append-only log of every status transition for a claim.
 * Used for SLA tracking, dispute resolution, and transparency reports.
 */
export const claimStatusHistory = sqliteTable(
  "claim_status_history",
  {
    id: text("id").primaryKey(),
    claimId: text("claim_id")
      .notNull()
      .references(() => claims.id, { onDelete: "cascade" }),

    fromStatus: text("from_status"),
    toStatus: text("to_status").notNull(),
    /** Who triggered the transition (user ID or system identifier). */
    changedBy: text("changed_by"),
    reason: text("reason"),

    ...timestamps,
  },
  (t) => [index("claim_history_claim_idx").on(t.claimId, t.createdAt)],
);

// ===========================================================================
// RELATIONS
// ===========================================================================

export const usersRelations = relations(users, ({ many }) => ({
  policies: many(policies),
  trips: many(trips),
  claims: many(claims),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  policies: many(policies),
}));

export const policiesRelations = relations(policies, ({ one, many }) => ({
  user: one(users, { fields: [policies.userId], references: [users.id] }),
  plan: one(plans, { fields: [policies.planId], references: [plans.id] }),
  trips: many(trips),
  claims: many(claims),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  policy: one(policies, { fields: [trips.policyId], references: [policies.id] }),
  user: one(users, { fields: [trips.userId], references: [users.id] }),
  claims: many(claims),
}));

export const claimsRelations = relations(claims, ({ one, many }) => ({
  policy: one(policies, { fields: [claims.policyId], references: [policies.id] }),
  trip: one(trips, { fields: [claims.tripId], references: [trips.id] }),
  user: one(users, { fields: [claims.userId], references: [users.id] }),
  medicalDetail: one(medicalClaims, {
    fields: [claims.id],
    references: [medicalClaims.claimId],
  }),
  medicationDetail: one(medicationClaims, {
    fields: [claims.id],
    references: [medicationClaims.claimId],
  }),
  baggageDetail: one(baggageClaims, {
    fields: [claims.id],
    references: [baggageClaims.claimId],
  }),
  documents: many(claimDocuments),
  statusHistory: many(claimStatusHistory),
}));

export const medicalClaimsRelations = relations(medicalClaims, ({ one }) => ({
  claim: one(claims, {
    fields: [medicalClaims.claimId],
    references: [claims.id],
  }),
}));

export const medicationClaimsRelations = relations(
  medicationClaims,
  ({ one }) => ({
    claim: one(claims, {
      fields: [medicationClaims.claimId],
      references: [claims.id],
    }),
  }),
);

export const baggageClaimsRelations = relations(baggageClaims, ({ one }) => ({
  claim: one(claims, {
    fields: [baggageClaims.claimId],
    references: [claims.id],
  }),
}));

export const claimDocumentsRelations = relations(claimDocuments, ({ one }) => ({
  claim: one(claims, {
    fields: [claimDocuments.claimId],
    references: [claims.id],
  }),
  uploader: one(users, {
    fields: [claimDocuments.uploadedBy],
    references: [users.id],
  }),
}));

export const claimStatusHistoryRelations = relations(
  claimStatusHistory,
  ({ one }) => ({
    claim: one(claims, {
      fields: [claimStatusHistory.claimId],
      references: [claims.id],
    }),
  }),
);

// ---------------------------------------------------------------------------
// 11. AI CHATBOT & SITE SETTINGS
// ---------------------------------------------------------------------------

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey(),
  
  // Home Content Settings
  homeTitle1: text("home_title_1").notNull().default("VIAJAR CON"),
  homeTitle2: text("home_title_2").notNull().default("RESPALDO REAL"),
  homeSubtitle: text("home_subtitle").notNull().default("Tu asistencia, estés donde estés.\nEmergencias, médicos y equipaje — cubierto en todo momento."),

  // AI Settings
  aiEnabled: integer("ai_enabled", { mode: "boolean" }).notNull().default(true),
  aiTone: text("ai_tone"),
  aiInstructions: text("ai_instructions"),
  aiKnowledge: text("ai_knowledge"),
  aiInitialGreeting: text("ai_initial_greeting"),
  aiCallToAction: text("ai_call_to_action"),
  whatsappNumber: text("whatsapp_number").notNull().default("5491150532300"),
  aiAvatarUrl: text("ai_avatar_url"),
  
  // Popup Settings
  popupEnabled: integer("popup_enabled", { mode: "boolean" }).notNull().default(false),
  popupImageUrl: text("popup_image_url"),
  popupTitle: text("popup_title"),
  popupDescription: text("popup_description"),
  popupCtaText: text("popup_cta_text"),
  popupCtaLink: text("popup_cta_link"),
  
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const chatSessions = sqliteTable("chat_sessions", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  lastActive: integer("last_active", { mode: "timestamp" }).notNull(),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").references(() => chatSessions.id, { onDelete: "cascade" }).notNull(),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const chatSessionsRelations = relations(chatSessions, ({ many }) => ({
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));
