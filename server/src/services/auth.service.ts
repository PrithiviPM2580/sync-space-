import {
	createUser,
	getUserByEmail,
	toAuthUser,
} from "@/repositories/auth.repository";
import { AppError } from "@/utils/app-error.util";
import { compareValue } from "@/utils/bcrypt.util";
import { signJwtToken } from "@/utils/jwt.util";
import type { LoginInput, RegisterInput } from "@/validators/auth.validator";

export const register = async (input: RegisterInput) => {
	const existinguser = await getUserByEmail(input.email);

	if (existinguser) {
		throw AppError.conflict("User already exists");
	}

	const user = await createUser(input);

	return {
		user: toAuthUser(user),
		token: signJwtToken(user._id.toString()),
	};
};

export const login = async (input: LoginInput) => {
	const user = await getUserByEmail(input.email);

	if (!user) {
		throw AppError.unauthorized("Invalid email or password");
	}
	if (!user.password) {
		throw AppError.unauthorized("Invalid email or password");
	}

	const isPasswordValid = await compareValue(input.password, user.password);
	if (!isPasswordValid) {
		throw AppError.unauthorized("Invalid email or password");
	}

	return {
		user: toAuthUser(user),
		token: signJwtToken(user._id.toString()),
	};
};
