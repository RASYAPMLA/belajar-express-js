'use strict';
const { Item } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = await Item.findAll();
    const data = [];
    for (let i = 1; i < 25; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      // mengambil 
      data.push({
        item_id: randomItem.id,
        name: `peminjaman ke.${i}`,
        total_item: 1,
        date: new Date(),
        createdAt:new Date(),
        updatedAt:new Date()
      });
    }
    await queryInterface.bulkInsert('loans',data);
  },

  async down(queryInterface, Sequelize) {
      //menghapus data
      await queryInterface.bulkDelete('loans',null,{});
  }
};
