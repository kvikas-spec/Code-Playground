import { Router, type IRouter } from "express";
import { listPackages, installPackage, removePackage } from "../lib/pkg-manager";

const router: IRouter = Router();

router.get("/packages", async (_req, res): Promise<void> => {
  const packages = listPackages();
  res.json(packages);
});

router.post("/packages", async (req, res): Promise<void> => {
  const { name } = req.body ?? {};
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "Package name is required" });
    return;
  }

  try {
    const pkg = installPackage(name.trim());
    res.status(201).json(pkg);
  } catch (err: unknown) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

router.delete("/packages/:name", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
  if (!raw) {
    res.status(400).json({ error: "Package name is required" });
    return;
  }

  try {
    removePackage(raw);
    res.sendStatus(204);
  } catch (err: unknown) {
    res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
