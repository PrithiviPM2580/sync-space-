import type { NextFunction, Request, Response } from "express";
import { Membership } from "@/models/membership.model";
import { AppError } from "@/utils/app-error.util";
import { can, type Permission } from "@/utils/organization-permission";

export const requireWorkspace = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const workspaceId = req.params.workspaceId as string;
		const userId = req.user?.id;

		if (!userId) return next(AppError.unauthorized("User not authenticated"));

		const membership = await Membership.findOne({ workspaceId, userId });

		if (!membership)
			return next(AppError.forbidden("User is not a member of this workspace"));

		req.workspaceId = workspaceId;
		req.workspaceRole = membership.role;

		next();
	} catch (error) {
		next(error);
	}
};

export const requireRole =
	(permission: Permission) =>
	(req: Request, res: Response, next: NextFunction) => {
		const role = req.workspaceRole;

		if (!role || !can(role, permission)) {
			return next(
				AppError.forbidden("User does not have the required permission"),
			);
		}

		next();
	};
