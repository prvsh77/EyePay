import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import recipientsRouter from "./recipients";
import walletsRouter from "./wallets";
import transactionsRouter from "./transactions";
import fraudRouter from "./fraud";
import analyticsRouter from "./analytics";
import insightsRouter from "./insights";
import copilotRouter from "./copilot";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/recipients", recipientsRouter);
router.use("/wallets", walletsRouter);
router.use("/transactions", transactionsRouter);
router.use("/analytics", analyticsRouter);
router.use("/insights", insightsRouter);
router.use("/copilot", copilotRouter);
router.use("/admin", fraudRouter);

export default router;
