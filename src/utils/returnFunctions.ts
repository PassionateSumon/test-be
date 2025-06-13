import type { ResponseToolkit } from "@hapi/hapi";
import { statusCodes } from "src/config/constants";

export const success = (
  data: any,
  message: string = "Success",
  statusCode: number = statusCodes.SUCCESS
) => {
  return (res: ResponseToolkit) => {
    return res
      .response({
        data,
        message,
        statusCode,
      })
      .code(statusCode);
  };
};

export const error = (
  data: any,
  message: string = "Error",
  statusCode: number = statusCodes.BAD_REQUEST
) => {
  return (res: ResponseToolkit) => {
    return res
      .response({
        data,
        message,
        statusCode,
      })
      .code(statusCode);
  };
};
