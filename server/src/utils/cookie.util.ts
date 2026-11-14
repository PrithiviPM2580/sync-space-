import { type CookieOptions, type Response } from "express";
import { Env } from "@/config/env.config";

const isproduction = Env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isproduction,
  sameSite: isproduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const setJwtAuthCookie = (res: Response, token: string) => {
  res.cookie("access_token", token, cookieOptions);
};

export const clearJwtAuthCookie = (res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isproduction,
    sameSite: isproduction ? "none" : "lax",
    path: "/",
  });
};
