const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Op } = require("@sequelize/core");

dotenv.config();

const db = require("../models/index");
const { User, Preset } = db;

const router = express.Router();

router.post("/login", async (req, res) => {
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
          );
          res.json({ success: true, message: "로그인 성공", token: token });
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

// 프리셋 등록
router.post("/preset", (req, res) => {
  try {
    const { token } = req.header;
    const { keyword, category1, category2, category3 } = req.body;
    const { email } = jwt.decode(token, process.env.JWT_SECRET_KEY);
    Preset.create({
      UserEmail: email,
      keyword: keyword,
      category1: category1,
      category2: category2,
      category3: category3,
    });
    res.json({ success: true, message: "프리셋 등록 성공" });
  } catch (err) {}
});

// 프리셋 정보 가져오기
router.get("/preset", (req, res) => {
  try {
    const { token } = req.header;
    if (!token) {
      // 에러처리
    } else {
      const { email } = jwt.decode(token, process.env.JWT_SECRET_KEY);
      const presets = Preset.findAll({
        where: {
          UserEmail: { [Op.eq]: email },
        },
      }).then((data) => {
        res.json({ presets: data });
      });
    }
  } catch (err) {}
});

module.exports = router;
