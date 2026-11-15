import type { Request, Response } from "express";
import status from "http-status";
import * as WorkspaceService from "@/services/workspace.service";
import {
	createWorkspaceSchema,
	slugQuerySchema,
	updateWorkspaceSchema,
} from "@/validators/workspace.validator";

export const listMyWorkspaces = async (req: Request, res: Response) => {
	const workspaces = await WorkspaceService.listMyWorkspaces(req.user!.id);

	return res.status(status.OK).json({ success: true, data: { workspaces } });
};

export const createWorkspace = async (req: Request, res: Response) => {
	const input = createWorkspaceSchema.parse(req.body);

	const workspace = await WorkspaceService.createWorkspace(input, req.user!.id);

	return res
		.status(status.CREATED)
		.json({ success: true, data: { workspace } });
};

export const checkSlug = async (req: Request, res: Response) => {
	const { slug } = slugQuerySchema.parse(req.query);

	const result = await WorkspaceService.checkSlug(slug);

	return res.status(status.OK).json({ success: true, data: { result } });
};

export const getWorkspace = async (req: Request, res: Response) => {
	const workspace = await WorkspaceService.getWorkspace(
		req.workspaceId!,
		req.user!.id,
	);

	return res.status(status.OK).json({ success: true, data: { workspace } });
};

export const updateWorkspace = async (req: Request, res: Response) => {
	const input = updateWorkspaceSchema.parse(req.body);

	const workspace = await WorkspaceService.updateWorkspace(
		req.workspaceId!,
		input,
		req.user!.id,
	);

	return res.status(status.OK).json({ success: true, data: { workspace } });
};
