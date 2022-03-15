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
          allowNull: true,
        },
        admin: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        token: {
          type: DataTypes.STRING(200),
          allowNull: true,
          unique: true,
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

  static associate(db) {
    db.User.belongsTo(db.Shop);
  }
};
