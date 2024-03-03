/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
import { Response } from 'express';
export declare const uploadFile: (file: Express.Multer.File, res: Response) => Promise<void>;
export declare const deleteFile: (fileUrl: string) => Promise<{
    status: string;
    message: string;
}>;
export declare const checkFileExists: (fileUrl: string) => Promise<boolean>;
