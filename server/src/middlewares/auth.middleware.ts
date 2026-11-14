import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { AuthUser } from "@/types";
import { AppError } from "@/utils/app-error.util";

export const protect = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		"jwt",
		{ session: false },
		(error: unknown, user: AuthUser | false | undefined, _info: unknown) => {
			if (error) return next(error);
			if (!user) return next(AppError.unauthorized("Unauthorized"));
			req.user = user;
			next();
		},
	)(req, res, next);
};
