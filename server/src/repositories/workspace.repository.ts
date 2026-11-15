import mongoose from "mongoose";
import { AuditEvent } from "@/models/audit-event.model";
import { Membership } from "@/models/membership.model";
import { Team } from "@/models/team.model";
import { TeamMembership } from "@/models/team-membership.model";
import { Workspace } from "@/models/workspace.model";
import type { AuditWorkspace, PopulateWorkspace } from "@/types/workspace";
import { AppError } from "@/utils/app-error.util";
import type { CreateWorkspaceInput } from "@/validators/workspace.validator";

export const checkSlugAvailability = async (slug: string) => {
	const existing = await Workspace.exists({ slug });
	return { slug, available: !existing };
};

export const isSlugExists = async (slug: string) => {
	const existing = await Workspace.exists({ slug });
	return !!existing;
};

export const findWorkspaceByUserId = async (userId: string) => {
	const memberships = await Membership.find({ userId })
		.sort({ joinedAt: -1 })
		.populate<{
			workspaceId: PopulateWorkspace;
		}>(
			"workspaceId",
			"name slug iconType iconValue iconColor archivedAt createdAt updatedAt",
		);

	return memberships.map((memebership) => {
		const workspace = memebership.workspaceId;

		return {
			id: workspace._id.toString(),
			name: workspace.name,
			slug: workspace.slug,
			iconType: workspace.iconType,
			iconValue: workspace.iconValue,
			iconColor: workspace.iconColor,
			ownerId: workspace.ownerId.toString(),
			createdAt: workspace.createdAt,
			role: memebership.role,
		};
	});
};

export const create = async (
	input: CreateWorkspaceInput,
	ownerId: string,
	slug: string,
) => {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const [workspace] = await Workspace.create(
			[
				{
					name: input.name,
					slug,
					iconType: input.iconType ?? "initials",
					iconValue: input.iconValue ?? "",
					iconColor: input.iconColor ?? "yellow",
					ownerId,
				},
			],
			{ session },
		);

		if (!workspace) {
			throw AppError.internal("Failed to create workspace");
		}

		await Membership.create(
			[
				{
					userId: ownerId,
					workspaceId: workspace._id,
					role: "owner",
				},
			],
			{ session },
		);

		const [generalTeam] = await Team.create(
			[
				{
					workspaceId: workspace._id,
					name: "General",
					slug,
				},
			],
			{ session },
		);

		if (!generalTeam) {
			throw AppError.internal("Failed to create general team");
		}

		await TeamMembership.create(
			[
				{
					userId: ownerId,
					teamId: generalTeam._id,
					workspaceId: workspace._id,
				},
			],
			{ session },
		);

		await AuditEvent.create(
			[
				{
					workspaceId: workspace._id,
					actorId: ownerId,
					action: "workspace.created",
					targetType: "workspace",
					targetId: workspace._id.toString(),
				},
			],
			{ session },
		);

		await session.commitTransaction();
		return workspace;
	} catch (error) {
		await session.abortTransaction();
		if (error instanceof mongoose.Error.ValidationError) {
			throw AppError.conflict("Validation error while creating workspace");
		}
		throw error;
	} finally {
		await session.endSession();
	}
};

export const findById = async (workspaceId: string) => {
	return Workspace.findById(workspaceId);
};

export const findByMembership = async (workspaceId: string, userId: string) => {
	return Membership.findOne({ workspaceId, userId });
};

export const createAudit = (input: AuditWorkspace) => {
	return AuditEvent.create(input);
};
