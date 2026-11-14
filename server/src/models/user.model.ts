import { type HydratedDocument, type Model, model, Schema } from "mongoose";
import { hashValue } from "@/utils/bcrypt.util";

export interface IUser {
	name: string;
	email: string;
	password?: string;
	googleId?: string | null;
	avatarUrl?: string | null;
	emailVerified?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			select: false,
			trim: true,
		},
		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},
		avatarUrl: {
			type: String,
			trim: true,
			default: null,
		},
		emailVerified: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function hashPassword() {
	if (!this.isModified("password") || !this.password) return;
	this.password = await hashValue(this.password);
});

userSchema.set("toJSON", {
	transform: (doc, ret) => {
		const { password, __v, ...rest } = ret;
		return rest;
	},
});

export const User: Model<IUser> = model<IUser>("User", userSchema);
