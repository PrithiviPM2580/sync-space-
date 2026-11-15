import { Router } from "express";
import authRouter from "./auth.route";
import workspaceRouter from "./workspace.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/workspaces", workspaceRouter);

export default router;
