import express, { Request, Response } from "express";
import { MysqlError, OkPacket } from "mysql";
import { conn } from "../config/dbconnect";
import { ImageRequest } from "image_post_req";

export const router = express.Router();

// Get Images
router.get("/random", (_req: Request, res: Response) => {
  conn.query(
    `SELECT allstarImages.*, allstarUsers.username, allstarUsers.image as userImage 
     FROM allstarImages 
     JOIN allstarUsers ON allstarImages.userId = allstarUsers.userId 
     ORDER BY RAND() LIMIT 2`,
    (err: MysqlError | null, results: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.status(200).json(results);
    }
  );
});

// Get Images for User
router.get("/user/:userId", (_req: Request, res: Response) => {
  const userId = _req.params.userId;
  conn.query(
    "SELECT * FROM allstarImages WHERE userId = ?",
    [userId],
    (err: MysqlError | null, results: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.status(200).json(results);
    }
  );
});

// Get ImageStat for User
router.get("/user/:userId/stats", (_req: Request, res: Response) => {
  const userId = _req.params.userId;
  conn.query(
    "CALL allstarGetAllImageScores(?);",
    [userId],
    (err: MysqlError | null, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.status(200).json(results[0]);
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
        return res.status(500).json({ affectedRows: -1, message: err.message });
      }

      const message = results[0][0].Message;

      return res.status(200).json({
        message: message,
        affectedRows: results[0][0].affectedRows,
      });
    }
  );
});
