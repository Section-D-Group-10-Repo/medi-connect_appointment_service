import { asyncWrapper, handleTC, RouteError } from "../utils";
import { Role, User } from "../types";
import { verifyUser } from "../services/auth";

// To satisfy ts compiler
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const authenticationMiddleWare = asyncWrapper(async (req, _, next) => {
  const token = req.cookies.token;

  if (!token) throw RouteError.Unauthorized("You are't authenticated");

  const data = await verifyUser(token);

  if (!data.success) throw RouteError.Unauthorized("Invalid token");

  req.user = data.result;
  next();
});

const roleAuthenticationMiddleware = (roles: Role[]) => {
  return asyncWrapper(async (req, _, next) => {
    const token = req.cookies.token;

    if (!token) throw RouteError.Unauthorized("You are't authenticated");

    const data = await verifyUser(token);

    if (!data.success) throw RouteError.Unauthorized("Invalid token");

    if (!roles.includes(data.result.role))
      throw RouteError.Unauthorized("You don't have the required permissions.");

    req.user = data.result;

    next();
  });
};

export default { authenticationMiddleWare, roleAuthenticationMiddleware };
