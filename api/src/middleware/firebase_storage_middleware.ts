import multer, { Multer } from "multer";

export class FileStorageMiddleWare {
  // Attribute Save FileName
  public fileName: string;

  // Attribute Save File Type
  // Create Object File Multer to get the file type.
  public readonly diskLoader: Multer = multer({
    // storage = define folder to be saved the files
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 2_097_152, // 2 MByte 2 * 1024 * 1024
    },
  });
}
