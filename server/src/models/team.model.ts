import {
	type HydratedDocument,
	type Model,
	model,
	Schema,
	type Types,
} from "mongoose";

export interface ITeam {
	workspaceId: Types.ObjectId;
	name: string;
	slug: string;
	archivedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export type TeamDocument = HydratedDocument<ITeam>;

const teamSchema = new Schema<ITeam>(
	{
		workspaceId: {
			type: Schema.Types.ObjectId,
			ref: "Workspace",
			required: true,
		},
		name: { type: String, required: true, trim: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		archivedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

teamSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
teamSchema.index({ workspaceId: 1 });

export const Team = model<ITeam>("Team", teamSchema);
