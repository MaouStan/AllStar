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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../config/firebase");
const storage_1 = require("firebase/storage");
exports.router = express_1.default.Router();
exports.router.get('/', (req, res) => {
    return res.send('Upload API');
});
// POST /upload on localhost
// import { FileMiddleWare } from "../middleware/file_middleware";
// const fileUploadMiddleWare = new FileMiddleWare();
// if body has file variable, then it will be saved in the diskLoader
// router.post(
//   "/",
//   fileUploadMiddleWare.diskLoader.single("file"),
//   (req: Request, res: Response) => {
//     if (req.file) {
//       return res.status(200).json({
//         message: "File uploaded successfully",
//         filename:
//           "http://localhost:3000/uploads/" + fileUploadMiddleWare.fileName,
//       });
//     }
//     return res.status(404).json("File not uploaded");
//   }
// );
// POST /uploads on firebase
// Initial a firebase storage
const storage = (0, storage_1.getStorage)(firebase_1.app);
// Initial a reference to the storage
const storageRef = (0, storage_1.ref)(storage, 'images');
// Setting up multer to upload file
const firebase_storage_middleware_1 = require("../middleware/firebase_storage_middleware");
const upload = new firebase_storage_middleware_1.FileStorageMiddleWare();
// if body has file variable, then it will be saved in the diskLoader
exports.router.post('/', upload.diskLoader.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const file = req.file;
        // Create a reference to 'file' unique name
        let name = Date.now() + '-' + Math.round(Math.random() * 10000);
        name += '.' + file.originalname.split('.').pop();
        console.log(`File uploaded ${name}`);
        const fileRef = (0, storage_1.ref)(storageRef, name);
        // Define file detail metadata to be saved
        const metadata = {
            contentType: file.mimetype,
        };
        try {
            // Upload file to the path 'file'
            yield (0, storage_1.uploadBytesResumable)(fileRef, file.buffer, metadata);
            // Get the download URL
            const url = yield (0, storage_1.getDownloadURL)(fileRef);
            return res.status(200).json({
                message: 'File uploaded successfully',
                filename: url,
            });
        }
        catch (e) {
            return res
                .status(500)
                .json({ message: 'Error uploading file', error: e });
        }
    }
    else {
        console.log('File not uploaded');
        res.status(404).json({ message: 'File not uploaded' });
    }
}));
//# sourceMappingURL=upload.js.map