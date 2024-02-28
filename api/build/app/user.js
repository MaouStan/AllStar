"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const dbconnect_1 = require("../config/dbconnect");
exports.router = express_1.default.Router();
// get user
exports.router.get("/", (req, res) => {
    let sql = "SELECT * FROM allstarUsers";
    if (req.query.id) {
        // if has id return get by id
        sql += ` WHERE userId = ${req.query.id}`;
    }
    else if (req.query.username) {
        // if has name return get find with username
        sql += ` WHERE username = '${req.query.username}'`;
    }
    // execute
    dbconnect_1.conn.query(sql, (err, result) => {
        if (err)
            return res.status(500).send(`Error: ${err}`);
        return res.status(200).json(result);
    });
});
// create user
exports.router.post("/", (req, res) => {
    let user = req.body;
    // check has username already
    let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
    dbconnect_1.conn.query(sql, [user.username], (err, result) => {
        if (err)
            return res.status(500).json({ message: `Error ${err}` });
        if (result.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }
    });
    sql = `INSERT INTO allstarUsers (username, password, image) VALUES (?,?,?)`;
    console.log(user);
    // execute
    dbconnect_1.conn.query(sql, [user.username, user.password, user.imageURL], (err, result) => {
        if (err)
            return res.status(500).json({ message: `Error ${err}` });
        return res.status(200).json({
            message: "User created",
            id: result.insertId,
        });
    });
});
//# sourceMappingURL=user.js.map