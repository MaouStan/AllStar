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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../utils/jwt");
const dbconnect_1 = require("../config/dbconnect");
const bcrypt_1 = require("../utils/bcrypt");
exports.authRouter = express_1.default.Router();
// POST NEW USER SIGN UP
exports.authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    // Check user complete input type
    if (user.image && user.username && user.password) {
        // Check username is unique
        let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
        const result = yield (0, dbconnect_1.queryAsync)(sql, [user.username]);
        if (result.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Username already exists' });
        }
        // Hash Password
        user.password = yield (0, bcrypt_1.hashPassword)(user.password);
        // Insert new user
        sql = `INSERT INTO allstarUsers (username, password, image) VALUES (?, ?, ?)`;
        const resultInsert = yield (0, dbconnect_1.queryAsync)(sql, [user.username, user.password, user.image]);
        if (resultInsert.affectedRows === 0) {
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        // Generate JWT token
        const token = (0, jwt_1.generateJWT)({
            userId: resultInsert.insertId,
            username: user.username,
            image: user.image
        });
        return res.status(200).json({ status: 'ok', message: 'User created', token: token });
    }
    return res.status(400).json({ status: 'error', message: 'Invalid input' });
}));
// POST USER LOGIN
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (user.username && user.password) {
        let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
        const result = yield (0, dbconnect_1.queryAsync)(sql, [user.username]);
        if (result.length > 0) {
            const userDB = result[0];
            const isPasswordMatch = yield (0, bcrypt_1.comparePassword)(user.password, userDB.password);
            if (isPasswordMatch) {
                const token = (0, jwt_1.generateJWT)({
                    userId: userDB.userId,
                    username: userDB.username,
                    image: userDB.image
                });
                return res.status(200).json({ status: 'ok', message: 'Login success', token: token });
            }
        }
    }
    return res.status(400).json({ status: 'error', message: 'Invalid input' });
}));
// POST TO VERIFY TOKEN
exports.authRouter.post('/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const result = (0, jwt_1.verifyToken)(token);
            if (result.valid) {
                return res.status(200).json({ status: 'ok', message: 'Token is valid', data: result.decoded });
            }
        }
    }
    return res.status(400).json({ status: 'error', message: 'Invalid token' });
}));
