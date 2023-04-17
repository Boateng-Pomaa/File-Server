import multer from 'multer'


const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'public');
      },
      filename(req, file, cb) {
        const ext = file.mimetype.split("/")[1]
        cb(null,`${file.originalname}-${Date.now()}.${ext}`)
      }
    }),
    limits: {
      fileSize: 5000000 // max file size 5MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
      const ext = file.mimetype.split("/")[1]
      if (!ext.match(/(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
        return cb(
          new Error(
            'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
          ),false
        )
      }
      cb(null, true)// continue with upload
    }
  })


  export default upload
