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
const image_1 = require("./app/image");
const vote_1 = require("./app/vote");
const cors_1 = __importDefault(require("cors"));
const api_key_middleware_1 = require("./middleware/api_key_middleware");
exports.app = (0, express_1.default)();
// Enable CORS
exports.app.use((0, cors_1.default)({
    origin: "https://anime-allstar.web.app",
    // origin: "*",
}));
// Apply the middleware globally to all routes
exports.app.use(api_key_middleware_1.checkApiKey);
exports.app.use(body_parser_1.default.text(), body_parser_1.default.json());
exports.app.get("/api", (_req, res) => {
    return res.send("Express Typescript on Vercel");
});
exports.app.get("/api/ping", (_req, res) => {
    return res.send("pong 🏓");
});
// Database
exports.app.use("/api/user", user_1.router);
exports.app.use("/api/image", image_1.router);
exports.app.use("/api/vote", vote_1.router);
// Upload
exports.app.use("/api/upload", upload_1.router);
exports.app.use("/api/uploads", express_1.default.static("uploads"));
//# sourceMappingURL=app.js.map