import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { router as upload } from "./app/upload";
import { router as user } from "./app/user";
import { router as image } from "./app/image";
import { router as vote } from "./app/vote";
import cors from "cors";
import { checkApiKey } from "./middleware/api_key_middleware";

export const app = express();

// Enable CORS
app.use(
  cors({
    origin: "https://anime-allstar.web.app",
    // origin: "*",
  })
);

// Apply the middleware globally to all routes
app.use(checkApiKey);

app.use(bodyParser.text(), bodyParser.json());

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

// Database
app.use("/user", user);
app.use("/image", image);
app.use("/vote", vote);

// Upload
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
