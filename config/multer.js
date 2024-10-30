const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = 'uploads';
try {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
} catch (error) {
  console.error("Error creating uploads directory:", error);
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Not a PDF file!'), false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const id = req.params.userId;
    const fileName = id + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage, fileFilter });
module.exports = { upload };
