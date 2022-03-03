const Sequelize = require('sequelize')
const {Model, DataTypes} = Sequelize

module.exports = class ReviewImage extends Model {
    static init(sequelize) {
        return super.init(
            {
                src: {
                    type: DataTypes.STRING(200),
                    allowNull: false
                }
            },
            {
                timestamps: false,
                modelName: "ReviewImage",
                tableName: "reviewimages",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci", // 한글 저장
                sequelize,
            }
        );
    }
    static associate(db) {
        db.ReviewImage.belongsTo(db.Shop)
    }
};