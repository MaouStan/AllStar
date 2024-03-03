"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuthen = void 0;
const express_jwt_1 = require("express-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
// App Variables
dotenv_1.default.config();
// AUTH JWT
exports.jwtAuthen = (0, express_jwt_1.expressjwt)({
    algorithms: ['HS256'],
    secret: process.env.ACCESS_TOKEN_PUBLIC_KEY,
}).unless({
    path: [
        '/',
        '/api/auth/register',
        '/api/auth/login',
        '/api/image/ranks',
        '/api/image/random',
        '/api/vote',
        '/api/upload',
    ],
});
