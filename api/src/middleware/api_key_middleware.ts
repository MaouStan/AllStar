import { Request, Response, NextFunction } from "express";
import { MysqlError, OkPacket } from "mysql";
import { conn } from "../config/dbconnect";

// Define a type for the middleware function
type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// checkApiKey in db
const checkApiKeyInDB = (apikey: string): boolean => {
  conn.query(
    "SELECT 1 FROM allstarSettings where key = apikey and value = ?;",
    [apikey],
    (err: MysqlError, results: OkPacket) => {
      if (err) {
        return false;
      }
      if (results.affectedRows === 0) {
        return false;
      }
      return true;
    }
  );
  return true;
};

// Middleware function to check API key
export const checkApiKey: MiddlewareFunction = (req, res, next) => {
  const apiKey: string = req.query.apikey as string; // Cast the value to string
  if (!apiKey || !checkApiKeyInDB(apiKey)) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  // API key is valid, continue to the next middleware/route handler
  next();
};
