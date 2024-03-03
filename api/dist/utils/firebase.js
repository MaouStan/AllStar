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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileExists = exports.deleteFile = exports.uploadFile = void 0;
const storage_1 = require("firebase/storage");
const fireabase_1 = require("../config/fireabase");
// Initial a firebase Storage
const storage = (0, storage_1.getStorage)(fireabase_1.app);
// Initial a reference to the storage service, which is used to create references in your storage bucket
const storageRef = (0, storage_1.ref)(storage, 'images');
const uploadFile = (file, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = generateUniqueFileName(file.originalname);
    const fileBuffer = file.buffer;
    const fileRef = (0, storage_1.ref)(storageRef, fileName);
    try {
        yield (0, storage_1.uploadBytesResumable)(fileRef, fileBuffer);
        const url = yield (0, storage_1.getDownloadURL)(fileRef);
        res.status(200).json({
            status: 'ok',
            message: 'File uploaded successfully',
            data: {
                url: url,
            }
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: 'error', message: 'Internal server error' });
    }
});
exports.uploadFile = uploadFile;
const deleteFile = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const url = fileUrl.split('/');
    const filePath = url[url.length - 1].replace("%2F", "/");
    const fileRef = (0, storage_1.ref)(storage, filePath.split("?")[0]);
    try {
        // check file exists
        if (yield (0, exports.checkFileExists)(fileUrl)) {
            yield (0, storage_1.deleteObject)(fileRef);
        }
        return {
            status: 'ok',
            message: 'File deleted successfully',
        };
    }
    catch (error) {
        console.log(error);
        return { status: 'error', message: 'Internal server error' };
    }
    ;
});
exports.deleteFile = deleteFile;
const checkFileExists = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileRef = (0, storage_1.ref)(storage, fileUrl);
        yield (0, storage_1.getDownloadURL)(fileRef);
        return true; // File exists
    }
    catch (error) {
        return false; // File does not exist
    }
});
exports.checkFileExists = checkFileExists;
function generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 10000);
    return `${timestamp}-${randomNum}-${originalName}`;
}
