import express, { Request, Response } from 'express';
import { VoteRequest } from '../model/vote_req';
import { conn, queryAsync } from '../config/dbconnect';
import Elo from '@studimax/elo';

export const voteRouter = express.Router();

type responseType = {
  score: number
};

// Elo Rating
voteRouter.post('/', async (req: Request, res: Response) => {
  const data: VoteRequest & { browserId: string | null } = req.body;
  try {
    // can't userId and browserId both null
    if (!data.userId && !data.browserId) {
      return res.status(400).json({ status: 'error', message: 'Invalid input' });
    }

    // Get current score from db
    let sql = `SELECT score FROM allstarImages WHERE id = ?`;
    const winnerOldScore = await queryAsync(sql, [data.winnerId]) as responseType[];
    const loserOldScore = await queryAsync(sql, [data.loserId]) as responseType[];
    if (!(winnerOldScore.length > 0 || loserOldScore.length > 0)) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Image not found' });
    }

    // Elo Rating Calculate
    const elo = new Elo({ kFactor: 32 });
    // Ra = winnerNewScore, Rb = loserNewScore
    let { Ea, Eb } = elo.calculatePerformance(winnerOldScore[0].score, loserOldScore[0].score);
    let { Ra: newWinnerScore, Rb: newLoserScore } = elo.calculateRating(winnerOldScore[0].score, loserOldScore[0].score, 1); // 1 = win

    // Insert Vote Event
    sql = `INSERT INTO allstarVoting (userId, browserId, imageId, score) VALUES (?, ?, ?, ?)`;
    conn.query(sql, [data.userId, data.browserId, data.winnerId, newWinnerScore]);
    conn.query(sql, [data.userId, null, data.loserId, newLoserScore]);

    // Update the score
    sql = `UPDATE allstarImages SET score = ? WHERE id = ?`;
    conn.query(sql, [newWinnerScore, data.winnerId]);
    conn.query(sql, [newLoserScore, data.loserId]);
    res.status(200).json({
      status: 'ok', message: 'Vote success', data: {
        winner: {
          oldScore: winnerOldScore[0].score,
          newScore: newWinnerScore,
          expected: Ea,
        },
        loser: {
          oldScore: loserOldScore[0].score,
          newScore: newLoserScore,
          expected: Eb,
        },
      }
    });
  }
  catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
