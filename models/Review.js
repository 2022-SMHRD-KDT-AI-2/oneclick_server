const Sequelize = require('sequelize')
const {Model, DataTypes} = Sequelize

module.exports = class Review extends Model {
    static init(sequelize) {
        return super.init(
            {
                comment: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                tasty: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                acessibility: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                mood: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                cleanliness: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                timestamps: true,
                modelName: "Review",
                tableName: "reviews",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci", // 한글 저장
                sequelize,
            }
        );
    }
    static associate(db) {
        db.Review.belongsTo(db.User)
        db.Review.belongsTo(db.Shop)
    }
};