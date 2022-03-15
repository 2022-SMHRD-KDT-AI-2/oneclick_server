const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Op } = require("@sequelize/core");
dotenv.config();

const db = require("../models/index");
const { tokenParse } = require("./utils");
const { User, Preset } = db;

const router = express.Router();

/*update shopid in user table*/
// complete
router.post("/shop", (req, res) => {
  try {
    const { token } = req.cookies;
    const email = tokenParse(token);
    User.findOne({ where: { email: email } }).then((res) => console.log(res));
    User.update(
      { shopid: req.body.id },
      {
        where: {
          email: email,
        },
      }
    )
      .then((data) => {
        res.json({ success: true });
      })
      .catch((err) => {
        res.json({ success: false });
      });
  } catch (err) {
    res.json({ success: false, message: err });
  }
});

// complete
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await User.findOne({ where: { email: email } }).then((data) => {
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
        ).then(async () => {
          const result = {
            success: true,
            message: "로그인 성공",
          };
          await User.findOne({ where: { email: email } }).then((data) => {
            result["admin"] = data.admin;
            result["shopId"] = data.shopid;
          });
          await Preset.findAll({ where: { UserEmail: email } }).then((data) => {
            result["preset"] = data;
            res.cookie("token", token).json(result);
          });
        });
      }
    });
  } catch (err) {
    res.json({ success: false });
  }
});

// complete
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, admin } = req.body;
    await User.create({
      email: email,
      password: bcrypt.hashSync(password, 10),
      admin: admin,
    });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err });
  }
});

// complete
router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", { path: "/" }).json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// 프리셋 등록 및 반환

router.post("/preset", async (req, res) => {
  try {
    const { token } = req.cookies;
    const { keyword, category } = req.body;
    const email = await tokenParse(token);
    await Preset.create({
      UserEmail: email,
      keyword: keyword,
      category: category,
    })
      .then(async () => {
        await Preset.findAll({ where: { useremail: email } }).then((data) => {
          res.json({
            success: true,
            message: "프리셋 등록 성공",
            preset: data,
          });
        });
      })
      .catch((err) => {
        res.json({ success: false });
      });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
