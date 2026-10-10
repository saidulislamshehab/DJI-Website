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
    error: any = "Internal Server Error",
    statusCode = 500,
    message?: string
  ): Response {
    const errorString =
      typeof error === "string"
        ? error
        : error?.message || (typeof error === "object" ? JSON.stringify(error) : "Internal Server Error");

    const payload: IApiResponse = {
      success: false,
      message: message || errorString,
      error: errorString,
    };
    return res.status(statusCode).json(payload);
  }
}
