const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const multer = require("multer");
const { tokenParse } = require("./utils");

dotenv.config();

const db = require("../models/index");
const ShopMenu = require("../models/ShopMenu");
const { Review, ReviewImage } = db;

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

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
router.post("/", upload.single("img"), (req, res) => {
  try {
    const { cookie } = req.headers;
    const email = tokenParse(cookie);
    const { shopId, comment, tasty, price, cleanliness, acessibility, mood } =
      req.body;
    Review.create({
      UserEmail: email,
      ShopId: shopId,
      useremail: email,
      comment: comment,
      tasty: tasty,
      acessibility: acessibility,
      mood: mood,
      price: price,
      cleanliness: cleanliness,
    });

    if (req.file) {
      ReviewImage.create({
        ShopId: shopId,
        src: `/uploads/${req.file.filename}`,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

router.get("/:id", (req, res) => {
  const target = req.params.id;
  Review.findAll({
    where: {
      ShopId: target,
    },
  }).then((review) => {
    ReviewImage.findAll({
      where: {
        ShopId: target,
      },
    }).then((image) => {
      ShopMenu.findAll({
        where: {
          ShopId: target,
        },
      }).then((menu) => {
        res.json({
          success: true,
          review: review,
          reviewImage: image,
          menu: menu,
        });
      });
    });
  });
});

module.exports = router;
