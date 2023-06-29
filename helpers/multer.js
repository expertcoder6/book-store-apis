const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const file_name = file.originalname.split(".")[0];
    cb(null, `book-${file_name}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: multerStorage });
const uploadCoverImage = upload.single("coverImage");

module.exports = { uploadCoverImage };
