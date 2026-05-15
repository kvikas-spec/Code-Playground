import { Router, type IRouter } from "express";
import { RunCodeBody } from "@workspace/api-zod";
import { runJavaScript } from "../lib/runner";

const router: IRouter = Router();

router.post("/code/run", async (req, res): Promise<void> => {
  const parsed = RunCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = runJavaScript(parsed.data.code);
  res.json(result);
});

export default router;
