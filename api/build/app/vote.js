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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const dbconnect_1 = require("../config/dbconnect");
exports.router = express_1.default.Router();
// vote
exports.router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vote = req.body;
    try {
        const insertVoteQuery = "INSERT INTO allstarVoting (userId, imageId, score) VALUES (?,?,?)";
        const updateScoreQuery = "UPDATE allstarImages SET score = ? WHERE id = ?";
        yield (0, dbconnect_1.executeQuery)(insertVoteQuery, [
            vote.userId,
            vote.winnerId,
            vote.winnerScore
        ]);
        yield (0, dbconnect_1.executeQuery)(insertVoteQuery, [
            vote.userId,
            vote.loserId,
            vote.loserScore,
        ]);
        yield (0, dbconnect_1.executeQuery)(updateScoreQuery, [vote.winnerScore, vote.winnerId]);
        yield (0, dbconnect_1.executeQuery)(updateScoreQuery, [vote.loserScore, vote.loserId]);
        return res.status(200).json({ message: "Vote success", affectedRows: 4 });
    }
    catch (err) {
        return res.status(500).json({ message: `Error ${err}`, affectedRows: -1 });
    }
}));
//# sourceMappingURL=vote.js.map