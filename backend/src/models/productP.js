'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductP extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    ProductP.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        base_price: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        sell_price: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        material: DataTypes.STRING,
        style: DataTypes.STRING,
        weight: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
            defaultValue: null
        },
        color: DataTypes.STRING,
        stock_qty: DataTypes.INTEGER,
        image: DataTypes.TEXT,

    }, {
        sequelize,
        modelName: 'ProductP',
        tableName: 'product_p',
        timestamps: false
    });
    return ProductP;
};