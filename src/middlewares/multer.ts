import multer from 'multer';
import { Request } from 'express';
import config from 'config';

type DestinationCallback = (error: Error | null, destination: string) => void;

const fileStorage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
        // temporary destination for uploaded files
        cb(null, './temp');
    },
});

const memoryStorage = multer.memoryStorage();

const fileUpload = multer({
    storage: fileStorage,
    limits: {
        fileSize: config.get('App.maxUploadLimit'),
    },
});

const kubConfigUpload = multer({
    storage: memoryStorage,
});

export { fileUpload, kubConfigUpload };
