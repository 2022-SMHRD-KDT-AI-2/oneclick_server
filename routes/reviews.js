const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const multer = require("multer");
const { tokenParse } = require("./utils");

dotenv.config();

const db = require("../models/index");
const { Review, ReviewImage } = db;

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const { shopId } = req.body;
    const fileName = `${Date.now()}_${shopId}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage }).single("img");

router.post("/save", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
    });
  });
});

router.get("/img", (req, res) => {
  const defaultURL = "http:localhost:7501/uploads/";
});

// 리뷰 등록
router.post("/", (req, res) => {
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

module.exports = router;
