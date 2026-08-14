'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders_coupon', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            code: {
                allowNull: false,
                type: Sequelize.STRING,
            },

            status: {
                allowNull: false,
                type: Sequelize.ENUM('percent', 'fixed'),
            },

            value: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            min_order_value: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            max_discount: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            usage_limit: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            used_count: {
                allowNull: false,
                type: Sequelize.INTEGER
            },

            expired_at: {
                allowNull: false,
                type: Sequelize.DATEONLY
            },
            is_active: {
                allowNull: false,
                type: Sequelize.DATEONLY
            }
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders_coupon');
    }
};