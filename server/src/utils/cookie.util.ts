import { type CookieOptions, type Response, response } from "express";
import { Env } from "@/config/env.config";

const isproduction = Env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: isproduction,
	sameSite: isproduction ? "none" : "lax",
	path: "/",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const setJwtAuthCookie = (res: Response, token: string) => {
	response.cookie("access_token", token, cookieOptions);
};

export const clearJwtAuthCookie = (res: Response) => {
	response.clearCookie("access_token", {
		httpOnly: true,
		secure: isproduction,
		sameSite: isproduction ? "none" : "lax",
		path: "/",
		maxAge: 0,
	});
};
