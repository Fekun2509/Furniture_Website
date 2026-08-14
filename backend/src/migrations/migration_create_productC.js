'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('product_c', {

            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING
            },

            description: {
                type: Sequelize.STRING
            },

        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('product_c');
    }
};