import axios from "axios";
import { asyncWrapper, RouteError } from "../utils";
import { ROLE } from "../constants";

// To satisfy ts compiler
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        _role: ROLE;
      };
    }
  }
}

const verifyUser = async (token: string) => {
  const response = await axios.get<{
    _id: string;
    _role: ROLE;
  }>(`/api/v1/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const authenticationMiddleWare = asyncWrapper(async (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw RouteError.Unauthorized("You are't authenticated");

  const token = authHeader.replace("Bearer ", "");

  if (!token) throw RouteError.Unauthorized("You are't authenticated");

  const payload = await verifyUser(token);

  if (!payload) throw RouteError.Unauthorized("Invalid token");

  req.user = payload;
  next();
});

const roleAuthenticationMiddleware = (roles: ROLE[]) => {
  return asyncWrapper(async (req, _, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw RouteError.Unauthorized("You are't authenticated");

    const token = authHeader.replace("Bearer ", "");

    if (!token) throw RouteError.Unauthorized("You are't authenticated");

    const payload = await verifyUser(token);

    if (!payload) throw RouteError.Unauthorized("Invalid token");

    if (!roles.includes(payload._role))
      throw RouteError.Unauthorized("You don't have the required permissions.");

    req.user = payload;

    next();
  });
};

export default { authenticationMiddleWare, roleAuthenticationMiddleware };
