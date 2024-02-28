"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageMiddleWare = void 0;
const multer_1 = __importDefault(require("multer"));
class FileStorageMiddleWare {
    constructor() {
        // Attribute Save File Type
        // Create Object File Multer to get the file type.
        this.diskLoader = (0, multer_1.default)({
            // storage = define folder to be saved the files
            storage: multer_1.default.memoryStorage(),
            limits: {
                fileSize: 2097152, // 2 MByte 2 * 1024 * 1024
            },
        });
    }
}
exports.FileStorageMiddleWare = FileStorageMiddleWare;
//# sourceMappingURL=firebase_storage_middleware.js.map