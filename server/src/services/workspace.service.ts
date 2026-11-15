import * as WorkspaceRepository from "@/repositories/workspace.repository";
import { AppError } from "@/utils/app-error.util";
import { slugify } from "@/utils/index.util";
import type {
	CreateWorkspaceInput,
	UpdateWorkspaceInput,
} from "@/validators/workspace.validator";

export const listMyWorkspaces = async (userId: string) => {
	return WorkspaceRepository.findWorkspaceByUserId(userId);
};

export const createWorkspace = async (
	input: CreateWorkspaceInput,
	ownerId: string,
) => {
	const slug = input.slug || slugify(input.name);

	const isSlugAlreadyExists = await WorkspaceRepository.isSlugExists(slug);

	if (isSlugAlreadyExists) {
		throw AppError.conflict("Workspace slug already exists");
	}

	return WorkspaceRepository.create(input, ownerId, slug);
};

export const checkSlug = async (slug: string) => {
	return WorkspaceRepository.checkSlugAvailability(slug);
};

export const getWorkspace = async (workspaceId: string, userId: string) => {
	const workspace = await WorkspaceRepository.findById(workspaceId);

	if (!workspace) {
		throw AppError.notFound("Workspace not found");
	}

	const membership = await WorkspaceRepository.findByMembership(
		workspaceId,
		userId,
	);

	if (!membership) {
		throw AppError.forbidden("You are not a member of this workspace");
	}

	return {
		id: workspace._id.toString(),
		name: workspace.name,
		slug: workspace.slug,
		iconType: workspace.iconType,
		iconValue: workspace.iconValue,
		iconColor: workspace.iconColor,
		ownerId: workspace.ownerId.toString(),
		createdAt: workspace.createdAt,
		role: membership?.role ?? null,
	};
};

export const updateWorkspace = async (
	workspaceId: string,
	input: UpdateWorkspaceInput,
	actorId: string,
) => {
	const workspace = await WorkspaceRepository.findById(workspaceId);

	if (!workspace) {
		throw AppError.notFound("Workspace not found");
	}

	if (!input.slug !== undefined && input.slug !== undefined) {
		const isSlugAlreadyExists = await WorkspaceRepository.isSlugExists(
			input.slug,
		);
		if (isSlugAlreadyExists) {
			throw AppError.conflict("Workspace slug already exists");
		}
	}

	if (input.name !== undefined) workspace.name = input.name;
	if (input.slug !== undefined) workspace.slug = input.slug;
	if (input.iconType !== undefined) workspace.iconType = input.iconType;
	if (input.iconValue !== undefined) workspace.iconValue = input.iconValue;
	if (input.iconColor !== undefined) workspace.iconColor = input.iconColor;

	await workspace.save();

	await WorkspaceRepository.createAudit({
		workspaceId,
		actorId,
		action: "workspace.updated",
		targetType: "workspace",
		targetId: workspaceId,
	});

	return {
		id: workspace._id.toString(),
		name: workspace.name,
		slug: workspace.slug,
		iconType: workspace.iconType,
		iconValue: workspace.iconValue,
		iconColor: workspace.iconColor,
	};
};
