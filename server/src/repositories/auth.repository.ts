import { User, type UserDocument } from "@/models/user.model";
import type { RegisterInput } from "@/validators/auth.validator";

export const toAuthUser = (user: UserDocument) => ({
	id: user._id.toString(),
	name: user.name,
	email: user.email,
	avatarUrl: user.avatarUrl ?? null,
	createdAt: user.createdAt,
});

export const getUserByEmail = async (email: string) => {
	return User.findOne({ email }).select("+password");
};

export const getUserById = async (id: string) => {
	return User.findById(id);
};

export const createUser = async (input: RegisterInput) => {
	return User.create(input);
};
