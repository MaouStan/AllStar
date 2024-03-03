"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const upload_1 = require("./api/upload");
const auth_middleware_1 = require("./middleware/auth_middleware");
const image_1 = require("./api/image");
const vote_1 = require("./api/vote");
const auth_1 = require("./api/auth");
const user_1 = require("./api/user");
// App Variables
dotenv_1.default.config();
exports.app = (0, express_1.default)();
// using the dependencies
exports.app.use(body_parser_1.default.json(), body_parser_1.default.urlencoded({ extended: true }), body_parser_1.default.raw()); // body accepts JSON, form-data
exports.app.use((0, helmet_1.default)()); // security
exports.app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN, // allow the frontend to access this server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// JWT middleware
exports.app.use(auth_middleware_1.jwtAuthen);
// API
exports.app.get('/', (req, res) => {
    res.send('Hello World');
});
// Routes
exports.app.use('/api/upload', upload_1.uploadRouter);
exports.app.use('/api/image', image_1.imageRouter);
exports.app.use('/api/vote', vote_1.voteRouter);
exports.app.use('/api/auth', auth_1.authRouter);
exports.app.use('/api/user', user_1.userRouter);
