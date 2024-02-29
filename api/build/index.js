"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const port = 3500;
const server = http_1.default.createServer(app_1.app);
server.listen(port, () => {
    console.log("Server is started");
});
//# sourceMappingURL=index.js.map