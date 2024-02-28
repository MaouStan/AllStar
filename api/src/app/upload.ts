import express, { Request, Response } from 'express';
import { app } from '../config/firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

export const router = express.Router();

router.get('/', (req: Request, res: Response) => {
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
const storage = getStorage(app);
// Initial a reference to the storage
const storageRef = ref(storage, 'images');
// Setting up multer to upload file
import { FileStorageMiddleWare } from '../middleware/firebase_storage_middleware';
const upload = new FileStorageMiddleWare();

// if body has file variable, then it will be saved in the diskLoader
router.post(
  '/',
  upload.diskLoader.single('file'),
  async (req: Request, res: Response) => {
    if (req.file) {
      const file = req.file;
      // Create a reference to 'file' unique name
      let name = Date.now() + '-' + Math.round(Math.random() * 10000);
      name += '.' + file.originalname.split('.').pop();
      console.log(`File uploaded ${name}`);
      const fileRef = ref(storageRef, name);
      // Define file detail metadata to be saved
      const metadata = {
        contentType: file.mimetype,
      };
      try {
        // Upload file to the path 'file'
        await uploadBytesResumable(fileRef, file.buffer, metadata);
        // Get the download URL
        const url = await getDownloadURL(fileRef);
        return res.status(200).json({
          message: 'File uploaded successfully',
          filename: url,
        });
      } catch (e) {
        return res
          .status(500)
          .json({ message: 'Error uploading file', error: e });
      }
    } else {
      console.log('File not uploaded');
      res.status(404).json({ message: 'File not uploaded' });
    }
  }
);
