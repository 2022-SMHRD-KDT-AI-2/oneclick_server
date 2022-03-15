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
const { Shop } = db;

const router = express.Router();

router.post("/keyword", (req, res) => {
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
        data: data.data.searchPoiInfo.pois,
        success: true,
      });
    });
});

router.post("/search", (req, res) => {
  const { lat, long, keyword, category } = req.body;

  const range = (targetRange * 360) / (earthRadius * 2 * pi);

  Shop.findAll({
    where: {
      [Op.and]: {
        lat: { [Op.between]: [lat - range, lat + range] },
        long: { [Op.between]: [long - range, long + range] },
      },
    },
  }).then((data) => {
    res.json({ data: data });
  });
});

router.get("/test1", (req, res) => {
  axios
    .get(
      "https://apis.openapi.sk.com/tmap/pois/" +
        10297205 + // 상세보기를 누른 아이템의 POI ID
        "?version=1&resCoordType=EPSG3857&format=json&appKey=" +
        appKey
    )
    .then((res) => {
      console.log(res);
    });
});

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
          const insertData = {
            name: item.name,
            tell: item.telNo,
            lat: item.noorLat,
            long: item.noorLon,
            parking: item.parkFlag == 1 ? true : false,
            address: `${item.upperAddrName} ${item.middleAddrName} ${item.roadName} ${item.buildingNo1}-${item.buildingNo2}`,
          };
          Shop.findOrCreate({
            where: {
              id: item.id,
            },
            defaults: insertData,
          });
        });
        console.log("end");
      });
  }
  res.json({ success: true });
});

// 관리자 페이지
// 선택한 가게의 id로 가게정보를 가져옴
router.post("/findbyid", (req, res) => {
  const { id } = req.body;
  Shop.findOne({
    where: {
      id: id,
    },
  }).then((data) => {
    res.json({
      success: true,
      data: data,
    });
  });
});

// 관리자페이지
// 가게 정보를 수정함
router.post("editinfo", (req, res) => {
  const { id } = req.body;
  Shop.update({ where: { id: id } }, {});
});
module.exports = router;
