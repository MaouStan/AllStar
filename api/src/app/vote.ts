import express, { Request, Response } from "express";
import { MysqlError, OkPacket } from "mysql";
import { conn, executeQuery } from "../config/dbconnect";
import { VoteRequest } from "vote_post_req";

export const router = express.Router();

// vote
router.post("/", async (req: Request, res: Response) => {
  const vote: VoteRequest = req.body;
  try {
    const insertVoteQuery =
      "INSERT INTO allstarVoting (userId, imageId, score) VALUES (?,?,?)";
    const updateScoreQuery = "UPDATE allstarImages SET score = ? WHERE id = ?";

    await executeQuery(insertVoteQuery, [
      vote.userId,
      vote.winnerId,
      vote.winnerScore
    ]);
    await executeQuery(insertVoteQuery, [
      vote.userId,
      vote.loserId,
      vote.loserScore,
    ]);
    await executeQuery(updateScoreQuery, [vote.winnerScore, vote.winnerId]);
    await executeQuery(updateScoreQuery, [vote.loserScore, vote.loserId]);

    return res.status(200).json({ message: "Vote success", affectedRows: 4 });
  } catch (err) {
    return res.status(500).json({ message: `Error ${err}`, affectedRows: -1 });
  }
});
