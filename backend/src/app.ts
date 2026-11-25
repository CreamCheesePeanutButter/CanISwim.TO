import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";

//Import routes
import poolRoutes from "./routes/poolRoutes";
import beachRoutes from "./routes/beachRoutes";

const app = express();

// 1. Security & Observability Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(pinoHttp());
app.use(express.json({ limit: "10kb" })); // Prevent payload bloat attacks

// 2. Health Check Endpoint (Used by AWS, Docker, Kubernetes)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// 3. API Routes
// app.use('/api/v1/users', userRoutes);
app.use("/pools", poolRoutes);
app.use("/beaches", beachRoutes);

// 4. Centralized Error-Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  req.log.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
});

export default app;
