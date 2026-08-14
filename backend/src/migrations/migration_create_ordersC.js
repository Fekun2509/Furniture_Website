'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders_c', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            user_id: {
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
            added_at: {
                type: Sequelize.DATEONLY
            }

        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders_c');
    }
};