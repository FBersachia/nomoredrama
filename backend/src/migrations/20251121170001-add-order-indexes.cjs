'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('visuals', ['order', 'id']);
    await queryInterface.addIndex('sets', ['order', 'id']);
    await queryInterface.addIndex('collaborations', ['order', 'id']);
    await queryInterface.addIndex('influences', ['order', 'id']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('visuals', ['order', 'id']);
    await queryInterface.removeIndex('sets', ['order', 'id']);
    await queryInterface.removeIndex('collaborations', ['order', 'id']);
    await queryInterface.removeIndex('influences', ['order', 'id']);
  }
};
