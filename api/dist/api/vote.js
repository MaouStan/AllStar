"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteRouter = void 0;
const express_1 = __importDefault(require("express"));
const dbconnect_1 = require("../config/dbconnect");
const elo_1 = __importDefault(require("@studimax/elo"));
exports.voteRouter = express_1.default.Router();
// Elo Rating
exports.voteRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        // can't userId and browserId both null
        if (!data.userId && !data.browserId) {
            return res.status(400).json({ status: 'error', message: 'Invalid input' });
        }
        // Get current score from db
        let sql = `SELECT score FROM allstarImages WHERE id = ?`;
        const winnerOldScore = yield (0, dbconnect_1.queryAsync)(sql, [data.winnerId]);
        const loserOldScore = yield (0, dbconnect_1.queryAsync)(sql, [data.loserId]);
        if (!(winnerOldScore.length > 0 || loserOldScore.length > 0)) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Image not found' });
        }
        // Elo Rating Calculate
        const elo = new elo_1.default({ kFactor: 32 });
        // Ra = winnerNewScore, Rb = loserNewScore
        let { Ra: newWinnerScore, Rb: newLoserScore } = elo.calculateRating(winnerOldScore[0].score, loserOldScore[0].score, 1); // 1 = win
        // Round
        newWinnerScore = Math.round(newWinnerScore);
        newLoserScore = Math.round(newLoserScore);
        // Insert Vote Event
        sql = `INSERT INTO allstarVoting (userId, browserId, imageId, score) VALUES (?, ?, ?, ?)`;
        dbconnect_1.conn.query(sql, [data.userId, data.browserId, data.winnerId, newWinnerScore]);
        dbconnect_1.conn.query(sql, [data.userId, null, data.loserId, newLoserScore]);
        // Update the score
        sql = `UPDATE allstarImages SET score = ? WHERE id = ?`;
        dbconnect_1.conn.query(sql, [newWinnerScore, data.winnerId]);
        dbconnect_1.conn.query(sql, [newLoserScore, data.loserId]);
        res.status(200).json({
            status: 'ok', message: 'Vote success', data: {
                // changing score
                winner: newWinnerScore - Number(winnerOldScore[0].score),
                loser: newLoserScore - Number(loserOldScore[0].score)
            }
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}));
