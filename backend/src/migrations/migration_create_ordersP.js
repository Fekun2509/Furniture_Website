'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders_p', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            order_id: {
                allowNull: false,
                type: Sequelize.UUID,
            },
            method: {
                allowNull: false,
                type: Sequelize.ENUM('cod', 'bank_transfer', 'momo', 'vnpay', 'zalopay'),
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM('pending', 'success', 'failed', 'refunded'),
            },
            amount: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            transaction_id: {
                allowNull: false,
                type: Sequelize.STRING
            },
            paid_at: {
                type: Sequelize.DATEONLY
            }

        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders_p');
    }
};