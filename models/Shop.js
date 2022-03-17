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
          allowNull: true,
        },
        url: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        desc: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
        occupied_tables: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        tables: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        parking: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        parking_capacity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        title_img: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        holiday: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        opTime: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        breakTime: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        upperBizName: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        middleBizName: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        lowerBizName: {
          type: DataTypes.STRING(20),
          allowNull: true,
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
