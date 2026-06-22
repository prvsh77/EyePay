import { pgTable, serial, text, timestamp, decimal, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  balance: decimal("balance", { precision: 18, scale: 2 }).default("0.00").notNull(),
  currency: text("currency").default("USD").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recipients = pgTable("recipients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  walletAddress: text("wallet_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // 'deposit', 'withdrawal', 'send', 'receive'
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  status: text("status").default("completed").notNull(), // 'pending', 'completed', 'failed'
  description: text("description"),
  recipientId: integer("recipient_id").references(() => recipients.id, { onDelete: "set null" }),
  riskScore: integer("risk_score").default(0).notNull(),
  destinationCountry: text("destination_country").default("US").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fraudAlerts = pgTable("fraud_alerts", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id, { onDelete: "cascade" }).notNull(),
  riskScore: integer("risk_score").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'approved', 'rejected'
  reasons: text("reasons").notNull(), // JSON string representing reasons
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.userId],
  }),
  recipients: many(recipients),
  copilotConversations: many(copilotConversations),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const recipientsRelations = relations(recipients, ({ one, many }) => ({
  user: one(users, {
    fields: [recipients.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
  recipient: one(recipients, {
    fields: [transactions.recipientId],
    references: [recipients.id],
  }),
  fraudAlert: one(fraudAlerts, {
    fields: [transactions.id],
    references: [fraudAlerts.transactionId],
  }),
}));

export const fraudAlertsRelations = relations(fraudAlerts, ({ one }) => ({
  transaction: one(transactions, {
    fields: [fraudAlerts.transactionId],
    references: [transactions.id],
  }),
}));

export const copilotConversations = pgTable("copilot_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(), // 'user', 'assistant'
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const copilotConversationsRelations = relations(copilotConversations, ({ one }) => ({
  user: one(users, {
    fields: [copilotConversations.userId],
    references: [users.id],
  }),
}));