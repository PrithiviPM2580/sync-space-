import { type SignOptions, sign } from "jsonwebtoken";
import { Env } from "@/config/env.config";

export const signJwtToken = (userId: string) => {
	return sign({ sub: userId }, Env.JWT_SECRET, {
		expiresIn: Env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
	});
};
