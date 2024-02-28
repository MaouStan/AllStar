import express, { Request, Response } from "express";
import { MysqlError, OkPacket } from "mysql";
import { conn } from "../config/dbconnect";
import { ImageRequest } from "image_post_req";

export const router = express.Router();

// Get Images
router.get("/", (_req: Request, res: Response) => {
  conn.query(
    "SELECT * FROM allstarImages",
    (err: MysqlError | null, results: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.status(200).json(results);
    }
  );
});

// Post Image
router.post("/", (_req: Request, res: Response) => {
  const image: ImageRequest = _req.body;
  conn.query(
    "CALL allStarInsertImageWithLimit(?, ?, ?, ?, ?)",
    [
      image.userId,
      image.imageURL,
      image.name,
      image.series_name,
      image.description,
    ],
    (err: MysqlError | null, results: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const message = results[0][0].Message;

      return res.status(200).json({ message: message });
    }
  );
});
