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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const dbconnect_1 = require("../config/dbconnect");
const bcrypt_1 = require("../utils/bcrypt");
exports.userRouter = express_1.default.Router();
// GET /api/user/:id
exports.userRouter.get('/:id', (req, res) => {
    const userId = req.params.id;
    // Query user by id
    let sql = `SELECT * FROM allstarUsers WHERE userId = ?`;
    dbconnect_1.conn.query(sql, [userId], (err, result) => {
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
        let user = result[0];
        // Remove password
        delete user.password;
        res.status(200).json({ status: 'ok', data: user });
    });
});
// PUT /api/user/:id
exports.userRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = req.body;
    // Get Old Data User by id
    let sql = `SELECT * FROM allstarUsers WHERE userId = ?`;
    const oldUserData = (yield (0, dbconnect_1.queryAsync)(sql, [userId]))[0];
    if (!oldUserData) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    // check if user want to update password
    if (user.password) {
        // check if user input old password
        if (!user.oldPassword) {
            return res.status(400).json({ status: 'error', message: 'Old password is required' });
        }
        // check if user input password is same with old password
        const isPasswordMatch = yield (0, bcrypt_1.comparePassword)(user.oldPassword, oldUserData.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ status: 'error', message: 'Old password is wrong' });
        }
        // Hash new password
        user.password = yield (0, bcrypt_1.hashPassword)(user.password);
    }
    // Merge new data with old data
    const _a = Object.assign(Object.assign({}, oldUserData), user), { oldPassword } = _a, newUserData = __rest(_a, ["oldPassword"]);
    // Update User
    sql = `UPDATE allstarUsers SET ? WHERE userId = ?`;
    yield (0, dbconnect_1.queryAsync)(sql, [newUserData, userId]);
    res.status(200).json({ status: 'ok', message: 'User updated successfully.' });
}));
// GET /api/user/:userId/stats
exports.userRouter.get('/:userId/stats', (req, res) => {
    const userId = req.params.userId;
    const sql = `CALL allstarGetAllImageScores(?)`;
    dbconnect_1.conn.query(sql, [userId], (err, result) => {
        if (err) {
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal server error' });
        }
        res.status(200).json({ status: 'ok', data: result[0] });
    });
});
