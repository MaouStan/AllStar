"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const upload_1 = require("./app/upload");
const user_1 = require("./app/user");
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
// Cors
exports.app.use((0, cors_1.default)({
    origin: "*",
}));
exports.app.use(body_parser_1.default.text(), body_parser_1.default.json());
exports.app.get("/", (_req, res) => {
    return res.send("Express Typescript on Vercel");
});
exports.app.get("/ping", (_req, res) => {
    return res.send("pong 🏓");
});
// Database
exports.app.use("/user", user_1.router);
// Upload
exports.app.use("/upload", upload_1.router);
exports.app.use("/uploads", express_1.default.static("uploads"));
//# sourceMappingURL=app.js.map