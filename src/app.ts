import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";
import middlewares from "./middleware";

const app = express();

// Registering middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(middlewares.limiter);

// TODO: Use a secret key for signing cookie
app.use(cookieParser()); 

// Registring routes
app.use("/", routes.appointmentRouter);

// Route error handling middleware
app.use(middlewares.routeErrorHandlingMiddleware);

export default app;
