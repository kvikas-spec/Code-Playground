import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, problemsTable, testCasesTable } from "@workspace/db";
import { ListProblemsQueryParams, GetProblemParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/problems/stats", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      difficulty: problemsTable.difficulty,
      category: problemsTable.category,
    })
    .from(problemsTable);

  const byDifficulty: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const row of rows) {
    byDifficulty[row.difficulty] = (byDifficulty[row.difficulty] ?? 0) + 1;
    byCategory[row.category] = (byCategory[row.category] ?? 0) + 1;
  }

  res.json({ total: rows.length, byDifficulty, byCategory });
});

router.get("/problems", async (req, res): Promise<void> => {
  const parsed = ListProblemsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let query = db
    .select({
      id: problemsTable.id,
      title: problemsTable.title,
      difficulty: problemsTable.difficulty,
      category: problemsTable.category,
      tags: problemsTable.tags,
    })
    .from(problemsTable)
    .$dynamic();

  const conditions = [];
  if (parsed.data.category) {
    conditions.push(sql`lower(${problemsTable.category}) = lower(${parsed.data.category})`);
  }
  if (parsed.data.difficulty) {
    conditions.push(sql`lower(${problemsTable.difficulty}) = lower(${parsed.data.difficulty})`);
  }

  if (conditions.length > 0) {
    const { and } = await import("drizzle-orm");
    query = query.where(and(...conditions)) as typeof query;
  }

  const problems = await query.orderBy(
    sql`case ${problemsTable.difficulty} when 'Easy' then 1 when 'Medium' then 2 when 'Hard' then 3 else 4 end`,
    problemsTable.title
  );

  res.json(problems);
});

router.get("/problems/:id", async (req, res): Promise<void> => {
  const params = GetProblemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [problem] = await db
    .select()
    .from(problemsTable)
    .where(eq(problemsTable.id, params.data.id));

  if (!problem) {
    res.status(404).json({ error: "Problem not found" });
    return;
  }

  const testCases = await db
    .select({ input: testCasesTable.input, expected: testCasesTable.expected })
    .from(testCasesTable)
    .where(eq(testCasesTable.problemId, problem.id))
    .orderBy(testCasesTable.id);

  res.json({ ...problem, testCases });
});

export default router;
