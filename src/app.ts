import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import { env } from "./config/env";
import routes from "./routes/index";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  return res.json({
    success: true,
    message: "API is running",
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use(env.PREFIX, routes);

export default app;
