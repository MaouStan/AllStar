"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const dbconnect_1 = require("../config/dbconnect");
exports.router = express_1.default.Router();
// Get Images
exports.router.get("/random", (_req, res) => {
    dbconnect_1.conn.query(`SELECT allstarImages.*, allstarUsers.username, allstarUsers.image as userImage 
     FROM allstarImages 
     JOIN allstarUsers ON allstarImages.userId = allstarUsers.userId 
     ORDER BY RAND() LIMIT 2`, (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(200).json(results);
    });
});
// Get Images for User
exports.router.get("/user/:userId", (_req, res) => {
    const userId = _req.params.userId;
    dbconnect_1.conn.query("SELECT * FROM allstarImages WHERE userId = ?", [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(200).json(results);
    });
});
// Get ImageStat for User
exports.router.get("/user/:userId/stats", (_req, res) => {
    const userId = _req.params.userId;
    dbconnect_1.conn.query("CALL allstarGetAllImageScores(?);", [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(200).json(results[0]);
    });
});
// Post Image
exports.router.post("/", (_req, res) => {
    const image = _req.body;
    dbconnect_1.conn.query("CALL allStarInsertImageWithLimit(?, ?, ?, ?, ?)", [
        image.userId,
        image.imageURL,
        image.name,
        image.series_name,
        image.description,
    ], (err, results) => {
        if (err) {
            return res.status(500).json({ affectedRows: -1, message: err.message });
        }
        const message = results[0][0].Message;
        return res.status(200).json({
            message: message,
            affectedRows: results[0][0].affectedRows,
        });
    });
});
//# sourceMappingURL=image.js.map