import { Router, type IRouter } from "express";
import healthRouter from "./health";
import codeRouter from "./code";
import problemsRouter from "./problems";
import snippetsRouter from "./snippets";
import packagesRouter from "./packages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(codeRouter);
router.use(problemsRouter);
router.use(snippetsRouter);
router.use(packagesRouter);

export default router;
