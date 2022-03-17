const express = require("express");
const dotenv = require("dotenv");
const { Op } = require("@sequelize/core");
const axios = require("axios");

dotenv.config();

const appKey = process.env.TMAP_APPKEY;
const targetRange = 1.3;
const earthRadius = 6371;
const pi = Math.PI;

const db = require("../models/index");
const { Shop, ShopMenu, Review, ReviewImage } = db;
const { upload } = require("./utils");

const router = express.Router();

router.post("/keyword", (req, res) => {
  try {
    const { keyword, page, lat, long } = req.body;
    axios
      .get("https://apis.openapi.sk.com/tmap/pois", {
        params: {
          appKey: appKey,
          searchKeyword: keyword,
          resCoordType: "WGS84GEO",
          page: page,
          count: 10,
          searchtypCd: "R",
          radius: 5,
          centerLat: lat,
          centerLon: long,
          version: 1,
        },
      })
      .then((data) => {
        res.json({
          data: data.data.searchPoiInfo.pois.poi,
          success: true,
        });
      });
  } catch (err) {
    res.json({ success: false });
  }
  const { keyword, page, lat, long } = req.body;
});

// 프리셋 버튼을 클릭하여 검색
// 검색결과를 반환하고 해당 가게의 리뷰 정보 + 이미지까지 가져오기
router.post("/search", (req, res) => {
  try {
    const { lat, long, keyword, category } = req.body;
    const range = (targetRange * 360) / (earthRadius * 2 * pi);
    console.log(category);
    if (!category) {
      Shop.findAll({
        where: {
          [Op.and]: {
            lat: { [Op.between]: [lat - range, lat + range] },
            long: { [Op.between]: [long - range, long + range] },
          },
        },
      }).then((shop) => {
        res.json({ shopData: shop });
      });
    } else {
      Shop.findAll({
        where: {
          [Op.and]: [
            { lat: { [Op.between]: [lat - range, lat + range] } },
            { long: { [Op.between]: [long - range, long + range] } },
            { upperBizName: { [Op.like]: `%${category}%` } },
          ],
        },
      }).then((shop) => {
        res.json({ shopData: shop });
      });
    }
  } catch (err) {
    res.json({ success: false });
  }
});
router.post("/update", (req, res) => {
  const { name, upperBizName } = req.body;
  Shop.update(
    {
      upperBizName: upperBizName,
    },
    { where: { name: name } }
  ).then(() => {
    res.json({ success: true });
  });
});
router.get("/detail", (req, res) => {});
// 검색해서 디비저장
router.get("/boundary", async (req, res) => {
  // from 51
  //35.10928780737578, 126.87626628837687
  for (let i = 1; i <= 13; i += 1) {
    await axios
      .get(`https://apis.openapi.sk.com/tmap/pois/search/around`, {
        params: {
          version: 1,
          page: i,
          count: 200,
          centerLon: 126.87626628837687,
          centerLat: 35.10928780737578,
          radius: 3,
          categories: "음식점;카페;술집",
          resCoordType: "WGS84GEO",
          appKey: appKey,
        },
      })
      .then((res) => {
        const data = res.data.searchPoiInfo.pois.poi;

        data.forEach((item) => {
          const {
            id,
            name,
            telNo,
            frontLat,
            frontLon,
            parkFlag,
            upperAddrName,
            middleAddrName,
            roadName,
            buildingNo1,
            buildingNo2,
          } = item;
          if (!name.match("주차장")) {
            const insertData = {
              id: id,
              name: name,
              tell: telNo,
              lat: frontLat,
              long: frontLon,
              parking: parkFlag === 1 ? true : false,
              address: `${upperAddrName} ${middleAddrName} ${roadName} ${buildingNo1}-${buildingNo2}`,
            };
            Shop.findOrCreate({
              where: {
                id: item.id,
              },
              defaults: insertData,
            });
          }
        });
        console.log("end");
      });
  }
  res.json({ success: true });
});

// 관리자 페이지
// 선택한 가게의 id로 가게정보를 가져옴
//complete
router.post("/findbyid", (req, res) => {
  const { id } = req.body;
  Shop.findOne({
    where: {
      id: id,
    },
  }).then((data) => {
    ShopMenu.findAll({
      where: {
        ShopId: id,
      },
    }).then((menu) => {
      res.json({
        success: true,
        shop: data,
        menu: menu,
      });
    });
  });
});

// 관리자페이지
// 가게 정보를 수정함
// /uploads/${req.file.filename}
router.post("/editinfo", upload.single("img"), (req, res) => {
  try {
    const { id } = req.body;
    const data = req.body;
    if (req.file) {
      data["title_img"] = `/uploads/${req.file.filename}`;
    }
    Shop.update(
      {
        ...data,
      },
      { where: { id: id } }
    ).then(() => {
      res.json({ success: true });
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/addmenu", upload.single("img"), (req, res) => {
  try {
    const { id, title, price } = req.body;
    ShopMenu.create({
      ShopId: id,
      title: title,
      price: price,
      img_src: `/uploads/${req.file.filename}`,
    })
      .then(() => {
        res.json({ success: true });
      })
      .catch((err) => {
        res.json({ success: false, message: err });
      });
  } catch (err) {
    res.json({
      success: false,
    });
  }
});

module.exports = router;
