const Sequelize = require('sequelize')
const {Model, DataTypes} = Sequelize

module.exports = class ShopMenu extends Model {
    static init(sequelize) {
        return super.init(
            {
                title: {
                    type: DataTypes.STRING(30),
                    allowNull: false
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                img_src: {
                    type: DataTypes.STRING(200)
                }
            },
            {
                timestamps: false,
                modelName: "ShopMenu",
                tableName: "shopmenus",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci", // 한글 저장
                sequelize,
            }
        );
    }
    static associate(db) {
        db.ShopMenu.belongsTo(db.Shop)
    }
};