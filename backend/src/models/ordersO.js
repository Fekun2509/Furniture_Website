'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrdersO extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    OrdersO.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        coupon_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        order_code: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancel'),
            allowNull: false
        },
        subtotal: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        shipping_fee: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        discount_amount: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        total: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false,
            defaultValue: 0
        },
        note: DataTypes.TEXT,
        ordered_at: DataTypes.DATEONLY,
        updated_at: DataTypes.DATEONLY
    }, {
        sequelize,
        modelName: 'OrdersO',
        tableName: 'orders_o',
        timestamps: true
    });
    return OrdersO;
};