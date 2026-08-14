'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders_i', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            order_id: {
                allowNull: false,
                type: Sequelize.UUID,
            },
            product_id: {
                allowNull: false,
                type: Sequelize.UUID,
            },
            qty: {
                allowNull: false,
                type: Sequelize.INTEGER
            },

            unit_price: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            total_price: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            }

        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders_i');
    }
};