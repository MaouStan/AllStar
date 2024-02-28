import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { router as upload } from "./app/upload";
import { router as user } from "./app/user";
import cors from "cors";

export const app = express();

// Enable CORS
app.use(
  cors({
    // origin: "https://anime-allstar.web.app",
    origin: "*",
  })
);

app.use(bodyParser.text(), bodyParser.json());

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

// Database
app.use("/user", user);

// Upload
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
