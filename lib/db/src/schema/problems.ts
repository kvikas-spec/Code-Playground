import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const problemsTable = pgTable("problems", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  description: text("description").notNull(),
  starterCode: text("starter_code").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const testCasesTable = pgTable("test_cases", {
  id: serial("id").primaryKey(),
  problemId: text("problem_id").notNull().references(() => problemsTable.id, { onDelete: "cascade" }),
  input: text("input").notNull(),
  expected: text("expected").notNull(),
  sortOrder: serial("sort_order"),
});

export const insertProblemSchema = createInsertSchema(problemsTable).omit({ createdAt: true });
export const insertTestCaseSchema = createInsertSchema(testCasesTable).omit({ id: true, sortOrder: true });

export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problemsTable.$inferSelect;
export type TestCase = typeof testCasesTable.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
