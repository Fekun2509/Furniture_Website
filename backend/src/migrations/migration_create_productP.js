'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('product_p', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            category_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING
            },

            description: {
                type: Sequelize.STRING
            },
            base_price: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            sell_price: {
                allowNull: false,
                type: Sequelize.DECIMAL(12, 0)
            },
            material: {
                type: Sequelize.STRING
            },
            style: {
                type: Sequelize.STRING
            },
            size: {
                type: Sequelize.STRING
            },
            weight: {
                allowNull: false,
                type: Sequelize.DECIMAL(6, 2)
            },
            color: {
                type: Sequelize.STRING
            },
            stock_qty: {
                type: Sequelize.INTEGER
            },
            image: {
                type: Sequelize.TEXT
            },
            review: {
                type: Sequelize.STRING
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('product_p');
    }
};