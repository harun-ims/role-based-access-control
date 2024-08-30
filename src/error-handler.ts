import { Request, Response, NextFunction } from "express";

interface ErrorWithStatus extends Error {
  httpStatusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const sendErrorDev = (
  err: ErrorWithStatus,
  req: Request,
  res: Response
): void => {
  console.error(err.message);

  res.status(err.httpStatusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (
  err: ErrorWithStatus,
  req: Request,
  res: Response
): void => {
  if (err.isOperational) {
    res.status(err.httpStatusCode || 500).json({
      status: err.status || "error",
      message: err.message,
    });
  } else {
    // Log unknown errors
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.httpStatusCode = err.httpStatusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err, message: err.message, name: err.name };

    sendErrorProd(error, req, res);
  }
};

export { globalErrorHandler };
