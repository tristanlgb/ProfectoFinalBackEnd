import * as multer from 'multer';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const MulterUtil = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = uuidv4();
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
