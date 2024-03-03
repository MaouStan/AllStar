import express, { Request, Response } from 'express';
import { USER_TABLE, conn, queryAsync } from '../config/dbconnect';
import { OkPacket, QueryError } from 'mysql2';
import { comparePassword, hashPassword } from '../utils/bcrypt';

export const userRouter = express.Router();

// GET /api/user/:id
userRouter.get('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;

  // Query user by id
  let sql = `SELECT * FROM allstarUsers WHERE userId = ?`;
  conn.query(sql, [userId], (err, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    let user: USER_TABLE = result[0] as unknown as USER_TABLE;
    // Remove password
    delete (user as Partial<USER_TABLE>).password;
    res.status(200).json({ status: 'ok', data: user });
  });
});

// PUT /api/user/:id
userRouter.put('/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user: USER_TABLE & { oldPassword?: string } = req.body;
  // Get Old Data User by id
  let sql = `SELECT * FROM allstarUsers WHERE userId = ?`;
  const oldUserData: USER_TABLE = (await queryAsync(sql, [userId]) as USER_TABLE[])[0];
  if (!oldUserData) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  // check if user want to update password
  if (user!.password) {
    // check if user input old password
    if (!user.oldPassword) {
      return res.status(400).json({ status: 'error', message: 'Old password is required' });
    }
    // check if user input password is same with old password
    const isPasswordMatch = await comparePassword(user.oldPassword, oldUserData.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ status: 'error', message: 'Old password is wrong' });
    }

    // Hash new password
    user.password = await hashPassword(user.password);
  }

  // Merge new data with old data
  const { oldPassword, ...newUserData } = { ...oldUserData, ...user };

  // Update User
  sql = `UPDATE allstarUsers SET ? WHERE userId = ?`;
  await queryAsync(sql, [newUserData, userId])
  res.status(200).json({ status: 'ok', message: 'User updated successfully.' });
});

// GET /api/user/:userId/stats
userRouter.get('/:userId/stats', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sql = `CALL allstarGetAllImageScores(?)`;

  conn.query(sql, [userId], (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      if (err?.sqlState === '45000') {
        return res
          .status(200)
          .json({ status: 'ok', data: [] });
      }

      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    res.status(200).json({ status: 'ok', data: result[0] });
  });
});