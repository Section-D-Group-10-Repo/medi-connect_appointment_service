import axios from "axios";
import { ENV } from "../config";
import { SERVICE_NAME } from "../constants";
import { handleTC, RouteError } from "../utils";
import { ServiceInfo, User } from "../types";

export const verifyUser = async (token: string) => {
  const serviceInfo = await axios.get<{
    success: boolean;
    message: string;
    result: ServiceInfo;
  }>(`${ENV.DISCOVER_SERVER_URL}/${SERVICE_NAME.AUTH_SERVICE}`);

  if (!serviceInfo.data.success)
    throw RouteError.InternalServerError(serviceInfo.data.message);

  const { result } = serviceInfo.data;

  const [data, error] = await handleTC.handleAsync(
    axios.get<{
      success: boolean;
      message: string;
      result: User;
    }>(`${result.address}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  if (error || !data || !data.data.success)
    throw RouteError.InternalServerError(data?.data.message || error!.message);

  return data.data;
};

export const getUserInfo = async (userId: string) => {
  const serviceInfo = await axios.get<{
    success: boolean;
    message: string;
    result: ServiceInfo;
  }>(`${ENV.DISCOVER_SERVER_URL}/${SERVICE_NAME.AUTH_SERVICE}`);

  if (!serviceInfo.data.success)
    throw RouteError.InternalServerError(serviceInfo.data.message);

  const { result } = serviceInfo.data;

  console.log({result, userId})

  const [data, error] = await handleTC.handleAsync(
    axios.get<{
      success: boolean;
      message: string;
      result: User;
    }>(`${result.address}/users/${userId}`)
  );

  if (error || !data || !data.data.success)
    throw RouteError.InternalServerError(data?.data.message || error!.message);

  return data.data;
};
