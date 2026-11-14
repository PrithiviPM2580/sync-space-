import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Env } from "@/config/env.config";
import * as authService from "@/services/auth.service";
import { clearJwtAuthCookie, setJwtAuthCookie } from "@/utils/cookie.util";
import { logger } from "@/utils/logger.util";
import { loginSchema, registerSchema } from "@/validators/auth.validator";
import passport from "passport";
import { signJwtToken } from "@/utils/jwt.util";
import { ErrorCodes } from "@/utils/app-error.util";
import type { AuthUser } from "@/types";

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

export const currentUser = async (request: Request, response: Response) => {
  response
    .status(status.OK)
    .json({ success: true, data: { user: request.user } });
};

export const googleAuth = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!Env.GOOGLE_CLIENT_ID || !Env.GOOGLE_CLIENT_SECRET) {
    response.status(status.SERVICE_UNAVAILABLE).json({
      success: false,
      errorCode: ErrorCodes.ERR_INTERNAL,
      message: "Google OAuth is not configured",
    });
    return;
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(
    request,
    response,
    next,
  );
};

export const googleCallback = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "google",
    { session: false },
    (error: unknown, user: AuthUser | false | undefined) => {
      if (error || !user) {
        return response.redirect(`${Env.APP_URL}/sign-in?error=google`);
      }

      const { id } = user as { id: string };
      setJwtAuthCookie(response, signJwtToken(id));
      response.redirect(`${Env.APP_URL}/dashboard`);
    },
  )(request, response, next);
};
