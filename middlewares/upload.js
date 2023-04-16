import multer from 'multer'
import path from 'path'

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'public');
      },
      filename(req, file, cb) {
        cb(null, file.originalname)
      }
    }),
    limits: {
      fileSize: 5000000 // max file size 5MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
        return cb(
          new Error(
            'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
          )
        )
      }
      cb(undefined, true); // continue with upload
    }
  })


  export default upload
