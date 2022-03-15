const multer = require("multer");

exports.tokenParse = (token) => {
  const base = token.split(".")[1];
  const payload = Buffer.from(base, "base64");
  const { email } = JSON.parse(payload.toString());
  return email;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

exports.upload = multer({ storage: storage });
