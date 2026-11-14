import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Env } from "@/config/env.config";
import * as authService from "@/services/auth.service";
import { clearJwtAuthCookie, setJwtAuthCookie } from "@/utils/cookie.util";
import { logger } from "@/utils/logger.util";
import { loginSchema, registerSchema } from "@/validators/auth.validator";

export const register = async (req: Request, res: Response) => {
	const input = registerSchema.parse(req.body);

	const { user, token } = await authService.register(input);

	setJwtAuthCookie(res, token);
	logger.info(`User registered: ${user.email}`);
	return res.status(status.CREATED).json({ success: true, data: { user } });
};

export const login = async (req: Request, res: Response) => {
	const input = loginSchema.parse(req.body);

	const { user, token } = await authService.login(input);

	setJwtAuthCookie(res, token);
	logger.info(`User logged in: ${user.email}`);
	return res.status(status.OK).json({ success: true, data: { user } });
};

export const logout = async (req: Request, res: Response) => {
	clearJwtAuthCookie(res);
	logger.info(`User logged out`);
	return res
		.status(status.OK)
		.json({ success: true, message: "Logged out successfully" });
};
