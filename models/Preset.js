const Sequelize = require("sequelize");
const { Model, DataTypes } = Sequelize;

module.exports = class Preset extends Model {
  static init(sequelize) {
    return super.init(
      {
        keyword: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        timestamps: false,
        modelName: "Preset",
        tableName: "presets",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Preset.belongsTo(db.User);
  }
};
