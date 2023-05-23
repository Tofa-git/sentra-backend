'use strict';

const db = require('../config/sequelize');

const cityLocationModel = db.cityLocation
const countryGroupModel = db.countryGroup
const msFacilitiesModel = db.masterFacility
const breakfastsModel = db.masterBreakfasts
const roomGradesModel = db.masterRoomGrade
const sessionsModel = db.masterSession

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let cityLocations = [];
    let countryGroups = [];
    let facilities = [];
    let breakfasts = [];

    for (let i = 1; i <= 1000; i++) {
      cityLocations.push({
        cityId: i,
        sequence: i,
        name: `location ${i}`,
        latitude: 100.00,
        longitude: 2.00,
        status: 1,
        createdBy: 1,
      });

      countryGroups.push({
        countryId: i,
        name: `group ${i}`,
        latitude: 100.00,
        longitude: 2.00,
        status: 1,
        createdBy: 1,
      });

      facilities.push({
        description: `desc ${i}`,
        code: i,
        category: i % 2 === 0 ? 'hotel' : 'room',
        used: 0,
        createdBy: 1,
        used: 0,
      });

      breakfasts.push({
        description: `desc ${i}`,
        code: i,
        createdBy: 1,
      });
    }

    await cityLocationModel.bulkCreate(cityLocations);
    await countryGroupModel.bulkCreate(countryGroups);
    await msFacilitiesModel.bulkCreate(facilities);
    await breakfastsModel.bulkCreate(breakfasts);
    await roomGradesModel.bulkCreate(breakfasts);
    await sessionsModel.bulkCreate(breakfasts);

    return true;
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
