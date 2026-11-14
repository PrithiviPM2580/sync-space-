import { AuthUser, WorkspaceRole } from "./index";

declare global {
  namespace Express {
    interface User extends AuthUser {}
    interface Request {
      workspaceId?: string;
      workspaceRole?: WorkspaceRole;
    }
  }
}

export {};
