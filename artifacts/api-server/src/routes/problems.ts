import { Router, type IRouter } from "express";
import { ListProblemsQueryParams, GetProblemParams } from "@workspace/api-zod";
import { getProblems, getProblemById, getProblemStats } from "../lib/problems";

const router: IRouter = Router();

router.get("/problems/stats", async (_req, res): Promise<void> => {
  const stats = getProblemStats();
  res.json(stats);
});

router.get("/problems", async (req, res): Promise<void> => {
  const parsed = ListProblemsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const problems = getProblems(parsed.data.category, parsed.data.difficulty);
  res.json(problems);
});

router.get("/problems/:id", async (req, res): Promise<void> => {
  const params = GetProblemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const problem = getProblemById(params.data.id);
  if (!problem) {
    res.status(404).json({ error: "Problem not found" });
    return;
  }

  res.json(problem);
});

export default router;
