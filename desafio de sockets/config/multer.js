const multer = require('multer');
const mimetypes = require('mime-types');

const storage = multer.diskStorage({
  destination:'uploads/',
  filename: function (req,file,cb){
    cb(null, Date.now() + file.originalname + '.' + mimetypes.extension(file.mimetype) );
  }
})

const upload = multer({storage:storage})

module.exports = upload ; 