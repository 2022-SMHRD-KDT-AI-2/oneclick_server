const Sequelize = require("sequelize");

const user = require("./user");
const review = require("./Review")
const reviewImage = require("./ReviewImage")
const shop = require("./Shop")
const shopMenu = require("./ShopMenu")
const preset = require("./Preset")

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.User = user;
db.Shop = shop
db.Preset = preset
db.ShopMenu = shopMenu
db.Review = review
db.ReviewImage = reviewImage

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;