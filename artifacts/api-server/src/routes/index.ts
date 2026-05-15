import { Router, type IRouter } from "express";
import healthRouter from "./health";
import codeRouter from "./code";
import problemsRouter from "./problems";
import snippetsRouter from "./snippets";

const router: IRouter = Router();

router.use(healthRouter);
router.use(codeRouter);
router.use(problemsRouter);
router.use(snippetsRouter);

export default router;
