import multer from 'multer'


const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'public/files');
      },
      filename(req, file, cb) {
        const ext = file.mimetype.split("/")[1]
        cb(null,`${file.originalname}`)
      }
    }),
    limits: {
      fileSize: 5000000 // max file size 5MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
      const ext = file.mimetype.split("/")[1]
      if (!ext.match(/(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|WEBM|MPG|MP2|MPEG|MPE|MPV|OGG|MP4|M4P|M4V|AVI|WMV|MOV|QT|FLV|SWF|AVCHD| MP3| WMA| AAC| WAV|RAW)$/)) {
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
