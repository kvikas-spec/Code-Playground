import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, snippetsTable } from "@workspace/db";
import { CreateSnippetBody, GetSnippetParams, DeleteSnippetParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/snippets", async (_req, res): Promise<void> => {
  const snippets = await db
    .select()
    .from(snippetsTable)
    .orderBy(snippetsTable.createdAt);
  res.json(snippets);
});

router.post("/snippets", async (req, res): Promise<void> => {
  const parsed = CreateSnippetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [snippet] = await db.insert(snippetsTable).values(parsed.data).returning();
  res.status(201).json(snippet);
});

router.get("/snippets/:id", async (req, res): Promise<void> => {
  const params = GetSnippetParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [snippet] = await db
    .select()
    .from(snippetsTable)
    .where(eq(snippetsTable.id, params.data.id));

  if (!snippet) {
    res.status(404).json({ error: "Snippet not found" });
    return;
  }

  res.json(snippet);
});

router.delete("/snippets/:id", async (req, res): Promise<void> => {
  const params = DeleteSnippetParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(snippetsTable)
    .where(eq(snippetsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Snippet not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
