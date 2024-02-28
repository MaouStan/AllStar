import express, { Request, Response } from "express";
import { MysqlError, OkPacket } from "mysql";
import { conn } from "../config/dbconnect";
import { UserRequest } from "user_post_req";

export const router = express.Router();

// get user
router.get("/", (req: Request, res: Response) => {
  let sql = "SELECT * FROM allstarUsers";

  if (req.query.id) {
    // if has id return get by id
    sql += ` WHERE userId = ${req.query.id}`;
  } else if (req.query.username) {
    // if has name return get find with username
    sql += ` WHERE username = '${req.query.username}'`;
  }

  // execute
  conn.query(sql, (err: MysqlError, result: OkPacket) => {
    if (err) return res.status(500).send(`Error: ${err}`);
    return res.status(200).json(result);
  });
});

// create user
router.post("/", (req: Request, res: Response) => {
  let user: UserRequest = req.body;

  // check has username already
  let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
  conn.query(sql, [user.username], (err: MysqlError, result) => {
    if (err) return res.status(500).json({ message: `Error ${err}` });
    if (result.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
  });

  sql = `INSERT INTO allstarUsers (username, password, image) VALUES (?,?,?)`;

  console.log(user);

  // execute
  conn.query(
    sql,
    [user.username, user.password, user.imageURL],
    (err: MysqlError, result: OkPacket) => {
      if (err) return res.status(500).json({ message: `Error ${err}` });
      return res.status(200).json({
        message: "User created",
        id: result.insertId,
      });
    }
  );
});