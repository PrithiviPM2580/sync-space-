import { Router } from "express";
import * as workspaceController from "@/controllers/workspace.controller";
import { protect } from "@/middlewares/auth.middleware";
import {
	requireRole,
	requireWorkspace,
} from "@/middlewares/workspace.middleware";

const workspaceRouter = Router();

workspaceRouter.use(protect);

workspaceRouter.get("/", workspaceController.listMyWorkspaces);
workspaceRouter.post("/", workspaceController.createWorkspace);
workspaceRouter.get("/slug-avaiable", workspaceController.checkSlug);
workspaceRouter.get(
	"/:workspaceId",
	requireWorkspace,
	workspaceController.getWorkspace,
);
workspaceRouter.patch(
	"/:workspaceId",
	requireWorkspace,
	requireRole("workspace:update"),
	workspaceController.updateWorkspace,
);

export default workspaceRouter;
