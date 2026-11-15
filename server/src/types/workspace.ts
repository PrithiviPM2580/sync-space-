import type { WorkspaceDocument } from "@/models/workspace.model";

export type PopulateWorkspace = Pick<
	WorkspaceDocument,
	| "_id"
	| "name"
	| "slug"
	| "iconType"
	| "iconValue"
	| "iconColor"
	| "ownerId"
	| "createdAt"
>;

export interface AuditWorkspace {
	workspaceId: string;
	actorId: string;
	action: string;
	targetType: string;
	targetId: string;
}
