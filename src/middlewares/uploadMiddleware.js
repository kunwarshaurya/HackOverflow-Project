const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  // ensure uploads directory exists
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const checkFileType = (file, cb) => {
  const allowed = /jpg|jpeg|png|pdf/;
  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );
  const type = allowed.test(file.mimetype);

  if (ext && type) {
    cb(null, true);
  } else {
    cb('Only images and PDFs are allowed');
  }
};

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
