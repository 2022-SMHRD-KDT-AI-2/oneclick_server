const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Op } = require("@sequelize/core");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

dotenv.config();

const db = require("../models/index");
const { Review, ReviewImage } = db;

const router = express.Router();

fs.readdir("uploads", (error) => {
  // uploads 폴더 없으면 생성
  if (error) {
    fs.mkdirSync("uploads");
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `uploads/`);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename((file.originalname, ext) + Date.now() + ext));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 리뷰 등록
router.post("./review", upload.single("img"), (req, res) => {
  try {
    const { token } = req.header;
    const { email } = jwt.decode(token, process.env.JET_CESRET_KEY);
    const { shopId, comment, tasty, acessibility, mood, price, cleanliness } =
      req.body;

    Review.create({
      shopid: shopId,
      useremail: email,
      comment: comment,
      tasty: tasty,
      acessibility: acessibility,
      mood: mood,
      price: price,
      cleanliness: cleanliness,
    });

    ReviewImage.create({
      shopId: shopId,
      src: `/img/${req.file.filename}`,
    });
  } catch (err) {}
});

// 해당 가게의 모든 리뷰 가져오기

module.exports = router;
