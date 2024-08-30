import { Request, Response, NextFunction } from "express";
import { checkPermission } from "./abilities";

export type IUser = {
  permissions: Array<{ action: string; subject: string }>;
};

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const currentUser: IUser = {
  permissions: [
    { action: "read", subject: "posts" },
    { action: "create", subject: "posts" },
    { action: "update", subject: "posts" },
  ],
};

export function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  // Access the user object from the request
  req.user = currentUser;

  if (checkPermission(req.method, req.path, req.user as IUser)) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "You don't have permission to perform this action" });
  }
}
