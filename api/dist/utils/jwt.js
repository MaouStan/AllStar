"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// App Variables
dotenv_1.default.config();
// Generate JWT for users.
const generateJWT = function (payload = {}, options = {}) {
    const privateKey = process.env.ACCESS_TOKEN_PUBLIC_KEY;
    const defaultOptions = {
        expiresIn: '2h',
    };
    return jsonwebtoken_1.default.sign(payload, privateKey, Object.assign(defaultOptions, options));
};
exports.generateJWT = generateJWT;
// To verify the JWT token.
const verifyToken = function (token) {
    try {
        const publicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY;
        return { valid: true, decoded: jsonwebtoken_1.default.verify(token, publicKey) };
    }
    catch (e) {
        return { valid: false, error: JSON.stringify(e) };
    }
};
exports.verifyToken = verifyToken;
