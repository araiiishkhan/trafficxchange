import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  clientId: text("client_id").notNull().unique(),
  points: integer("points").notNull().default(0),
  hits: integer("hits").notNull().default(0),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  clientId: text("client_id").notNull(),
  note: text("note"),
  proxy: text("proxy").notNull().default("System"),
  proxyConfig: text("proxy_config"),
  points: integer("points").notNull().default(0),
  hits: integer("hits").notNull().default(0),
  active: boolean("active").notNull().default(true),
  status: text("status").notNull().default("Ready"),
});

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  url: text("url").notNull(),
  minVisitTime: integer("min_visit_time").notNull().default(20),
  hits: integer("hits").notNull().default(0),
  todayHits: integer("today_hits").notNull().default(0),
  pointsUsed: integer("points_used").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  clientId: true,
  note: true,
  proxy: true,
  proxyConfig: true,
});

export const insertUrlSchema = createInsertSchema(urls).pick({
  userId: true,
  url: true,
  minVisitTime: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type Url = typeof urls.$inferSelect;
