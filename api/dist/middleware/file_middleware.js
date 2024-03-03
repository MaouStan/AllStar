"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
class FileMiddleware {
    constructor() {
        // fileName
        this.fileName = '';
        // Create Object File Multer
        this.diskLoader = (0, multer_1.default)({
            // storage
            storage: multer_1.default.memoryStorage(),
            // file size
            limits: {
                fileSize: 2 * 1024 * 1024, // no larger than 2mb
            },
        });
    }
}
exports.FileMiddleware = FileMiddleware;
