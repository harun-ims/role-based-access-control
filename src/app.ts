import express from "express";
import dotEnv from "dotenv";
import { BadGatewayException, UnauthorizedException } from "@harun-ims/common";
dotEnv.config();

import { router } from "./routes";

import { globalErrorHandler } from "./error-handler";

export const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  try {
    throw new UnauthorizedException("dshfsd");

    res.send("Hello, world!");
  } catch (error) {
    next(error);
  }
});

app.use(router);
app.use(globalErrorHandler);
