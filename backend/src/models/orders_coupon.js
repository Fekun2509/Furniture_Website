'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrdersCoupon extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    OrdersCoupon.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('percent', 'fixed'),
            allowNull: false
        },
        value: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false
        },
        min_order_value: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false
        },
        max_discount: {
            type: DataTypes.DECIMAL(12, 0),
            allowNull: false
        },
        usage_limit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        used_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expried_at: {
            type: DataTypes.DATEONLY
        },
        is_active: {
            type: DataTypes.DATEONLY
        }

    }, {
        sequelize,
        modelName: 'OrdersCoupon',
        tableName: 'orders_coupon',
        timestamps: true
    });
    return OrdersCoupon;
};