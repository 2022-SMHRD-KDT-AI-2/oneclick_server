const Sequelize = require('sequelize')
const {Model, DataTypes} = Sequelize

module.exports = class Preset extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    unique: true
                },
                lat: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                long: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                address: {
                    type: DataTypes.STRING(250),
                    allowNull: false
                },
                tell: {
                    type: DataTypes.STRING(13)
                },
                url: {
                    type: DataTypes.STRING(200)
                },
                desc: {
                    type: DataTypes.STRING(300)
                },
                occupied_tables : {
                    type: DataTypes.INTEGER
                },
                tables: {
                    type: DataTypes.INTEGER
                },
                parking: {
                    type: DataTypes.BOOLEAN
                },
                parking_capacity: {
                    type: DataTypes.INTEGER
                },
                title_img_src: {
                    type: DataTypes.STRING(200)
                },
                holiday: {
                    type: DataTypes.INTEGER
                },
                open: {
                    type: DataTypes.INTEGER
                },
                close: {
                    type: DataTypes.INTEGER
                },
                break_start: {
                    type: DataTypes.INTEGER
                },
                break_end: {
                    type: DataTypes.INTEGER
                },
                category1: {
                    type: DataTypes.STRING(20)
                },
                category2: {
                    type: DataTypes.STRING(20)
                },
                category3: {
                    type: DataTypes.STRING(20)
                },
                review_tasty: {
                    type: DataTypes.INTEGER
                },
                review_mood: {
                    type: DataTypes.INTEGER
                },
                review_access: {
                    type: DataTypes.INTEGER
                },
                review_clean: {
                    type: DataTypes.INTEGER
                },
                review_price: {
                    type: DataTypes.INTEGER
                },
                review_count: {
                    type: DataTypes.INTEGER
                }

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
    static associate(db) {
        db.Shop.belongsTo(db.User)
    }
};