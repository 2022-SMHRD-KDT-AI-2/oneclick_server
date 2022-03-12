const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Op } = require("@sequelize/core");
const { tokenParse } = require("./utils");
dotenv.config();

const db = require("../models/index");
const { User, Preset } = db;

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } }).then(
      (data) => {
        if (bcrypt.compare(password, data.password)) {
          const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1800s",
          });
          const refresh = jwt.sign({}, process.env.JWT_REFRESH_KEY, {
            expiresIn: "15d",
          });
          User.update(
            {
              token: refresh,
            },
            {
              where: {
                email: email,
              },
            }
          ).then(() => {
            const result = {
              success: true,
              message: "로그인 성공",
            };
            User.findOne({ where: { email: email } }).then((data) => {
              result["admin"] = data.admin;
              Preset.findAll({ where: { useremail: email } }).then((data) => {
                result["preset"] = data;
                res.cookie("token", token).json(result);
                next();
              });
            });
          });
        } else {
          res.json({ success: false, message: "로그인 실패" });
        }
      }
    );
  } catch (err) {
    res.json({ success: false, message: err });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, admin } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      await User.create({
        email: email,
        password: await bcrypt.hash(password, 10),
        admin: admin,
      }).then(() => {
        res.json({ success: true });
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res) => {});

// 프리셋 등록 및 반환
router.post("/preset", async (req, res) => {
  try {
    const { token } = req.cookies;
    const email = tokenParse(token);
    console.log(email);
    const { keyword, category1, category2, category3 } = req.body;

    await Preset.create({
      UserEmail: email,
      keyword: keyword,
      category1: category1,
      category2: category2,
      category3: category3,
    });

    await Preset.findAll({ where: { useremail: email } }).then((data) => {
      res.json({ success: true, message: "프리셋 등록 성공", preset: data });
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
