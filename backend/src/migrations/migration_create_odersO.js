'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders_o', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.UUID,
            },
            coupon_id: {
                allowNull: false,
                type: Sequelize.UUID,
            },
            order_code: {
                allowNull: false,
                type: Sequelize.STRING
            },

            status: {
                allowNull: false,
                type: Sequelize.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancel'),
            },

            subtotal: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            shipping_fee: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            discount_amount: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            total: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            note: {
                type: Sequelize.TEXT
            },
            ordered_at: {
                allowNull: false,
                type: Sequelize.DATEONLY
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATEONLY
            }
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders_o');
    }
};