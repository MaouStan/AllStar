import express, { Request, Response } from 'express';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { FileMiddleware } from '../middleware/file_middleware';
import { uploadFile } from '../utils/firebase';

export const uploadRouter = express.Router();

// Setting up multer
const fileMiddleware = new FileMiddleware();
uploadRouter.post(
  '/',
  fileMiddleware.diskLoader.single('file'),
  async (req: Request, res: Response) => {
    if (req.file) {
      const file = req.file;
      return uploadFile(file, res);
    } else {
      res.status(400).json({ status: 'error', message: 'File upload failed' });
    }
  }
);