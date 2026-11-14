import { Router } from "express";
import * as authController from "@/controllers/auth.controller";
import { protect } from "@/middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/current-user", protect, authController.currentUser);
authRouter.get("/google", authController.googleAuth);
authRouter.get("/google/callback", authController.googleCallback);

export default authRouter;
