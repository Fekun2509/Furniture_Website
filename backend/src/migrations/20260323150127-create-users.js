'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {

      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      fullname: {
        type: Sequelize.STRING
      },

      address: {
        type: Sequelize.STRING
      },

      phone: {
        type: Sequelize.STRING
      },

      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false,
        defaultValue: 'male'
      },

      role: {
        type: Sequelize.ENUM('admin', 'staff', 'customer'),
        allowNull: false,
        defaultValue: 'customer'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};