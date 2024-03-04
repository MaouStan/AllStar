import express, { Request, Response } from 'express';
import { generateJWT, verifyToken } from '../utils/jwt';
import { UserNewRequest } from '../model/user_new_req';
import { USER_TABLE, queryAsync } from '../config/dbconnect';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import { OkPacket } from 'mysql2';
export const authRouter = express.Router();

// POST NEW USER SIGN UP
authRouter.post('/register', async (req: Request, res: Response) => {
  const user: UserNewRequest = req.body;
  
  // Check user complete input type
  if (user.image && user.username && user.password) {
    // Check username is unique
    let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
    const result = await queryAsync(sql, [user.username]) as USER_TABLE[];
    if (result.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Username already exists' });
    }

    // Hash Password
    user.password = await hashPassword(user.password);

    // Insert new user
    sql = `INSERT INTO allstarUsers (username, password, image) VALUES (?, ?, ?)`;
    const resultInsert = await queryAsync(sql, [user.username, user.password, user.image]) as OkPacket;
    if (resultInsert.affectedRows === 0) {
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }

    // Generate JWT token
    const token = generateJWT({
      userId: resultInsert.insertId,
      username: user.username,
      image: user.image
    });

    return res.status(200).json({ status: 'ok', message: 'User created', token: token });
  }

  return res.status(400).json({ status: 'error', message: 'Invalid input' });
});

// POST USER LOGIN
authRouter.post('/login', async (req: Request, res: Response) => {
  const user: UserNewRequest = req.body;
  if (user.username && user.password) {
    let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
    const result = await queryAsync(sql, [user.username]) as USER_TABLE[];
    if (result.length > 0) {
      const userDB = result[0];
      const isPasswordMatch = await comparePassword(user.password, userDB.password);
      if (isPasswordMatch) {
        const token = generateJWT({
          userId: userDB.userId,
          username: userDB.username,
          image: userDB.image,
          type: userDB.type
        });
        return res.status(200).json({ status: 'ok', message: 'Login success', token: token });
      }
    }
  }
  return res.status(400).json({ status: 'error', message: 'Invalid input' });
});

// POST TO VERIFY TOKEN
authRouter.post('/verify', async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      const result: any = verifyToken(token);
      if (result.valid) {
        return res.status(200).json({ status: 'ok', message: 'Token is valid', data: result.decoded });
      }
    }
  }
  return res.status(400).json({ status: 'error', message: 'Invalid token' });
});