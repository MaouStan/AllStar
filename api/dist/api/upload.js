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
exports.uploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const file_middleware_1 = require("../middleware/file_middleware");
const firebase_1 = require("../utils/firebase");
exports.uploadRouter = express_1.default.Router();
// Setting up multer
const fileMiddleware = new file_middleware_1.FileMiddleware();
exports.uploadRouter.post('/', fileMiddleware.diskLoader.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const file = req.file;
        return (0, firebase_1.uploadFile)(file, res);
    }
    else {
        res.status(400).json({ status: 'error', message: 'File upload failed' });
    }
}));
