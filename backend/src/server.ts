import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});

// Graceful shutdown for zero-downtime deployments
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing HTTP server gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
