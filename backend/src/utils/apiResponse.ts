import { Response } from "express";
import { IApiResponse } from "../types";

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200,
    meta?: Partial<IApiResponse<T>>
  ): Response {
    const payload: IApiResponse<T> = {
      success: true,
      message,
      data,
      ...meta,
    };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    error = "Internal Server Error",
    statusCode = 500,
    message = "Operation failed"
  ): Response {
    const payload: IApiResponse = {
      success: false,
      message,
      error,
    };
    return res.status(statusCode).json(payload);
  }
}
