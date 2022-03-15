const Sequelize = require("sequelize");
const { Model, DataTypes } = Sequelize;

module.exports = class Preset extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        lat: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        long: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(250),
          allowNull: false,
        },
        tell: {
          type: DataTypes.STRING(13),
        },
        url: {
          type: DataTypes.STRING(200),
        },
        desc: {
          type: DataTypes.STRING(300),
        },
        occupied_tables: {
          type: DataTypes.INTEGER,
        },
        tables: {
          type: DataTypes.INTEGER,
        },
        parking: {
          type: DataTypes.INTEGER,
        },
        parking_capacity: {
          type: DataTypes.INTEGER,
        },
        title_img_src: {
          type: DataTypes.STRING(200),
        },
        holiday: {
          type: DataTypes.INTEGER,
        },
        opTime: {
          type: DataTypes.STRING(20),
        },
        breakTime: {
          type: DataTypes.STRING(20),
        },
        upperBizName: {
          type: DataTypes.STRING(20),
        },
        middleBizName: {
          type: DataTypes.STRING(20),
        },
        lowerBizName: {
          type: DataTypes.STRING(20),
        },
        detailBizName: {
          type: DataTypes.STRING(20),
        },
      },
      {
        timestamps: true,
        modelName: "Shop",
        tableName: "Shops",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
};
