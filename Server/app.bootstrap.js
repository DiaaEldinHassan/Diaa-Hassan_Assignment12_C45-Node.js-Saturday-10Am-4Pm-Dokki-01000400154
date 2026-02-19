import express from "express";
import "./Config/env.watcher.js";
import cors from "cors";
import { serverPort } from "./Config/config.service.js";
import { connectDB } from "./Src/DB/index.js";
import {
  auth,
  authorization,
  users,
  messages,
  errorMiddleware,
} from "./Src/index.js";
export async function bootstrap() {
  const app = express();
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  await connectDB();
  app.use(express.json());
  app.use("/auth", auth);
  app.use("/users", users);
  app.use("/messages", messages);
  app.use(errorMiddleware);
  app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort} 🚀🚀`);
  });
}
