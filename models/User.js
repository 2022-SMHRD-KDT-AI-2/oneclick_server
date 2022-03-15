const Sequelize = require("sequelize");
const { Model, DataTypes } = Sequelize;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
          primaryKey: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
        admin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING(200),
          allowNull: true,
          unique: true,
        },
        shopid: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        timestamps: true,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
};
