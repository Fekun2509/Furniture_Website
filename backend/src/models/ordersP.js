'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrdersP extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    OrdersP.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        order_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        method: {
            type: DataTypes.ENUM('cod', 'bank_transfer', 'momo', 'vnpay', 'zalopay'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paid_at: {
            type: DataTypes.DATEONLY
        }

    }, {
        sequelize,
        modelName: 'OrdersP',
        tableName: 'orders_p',
        timestamps: true
    });
    return OrdersP;
};