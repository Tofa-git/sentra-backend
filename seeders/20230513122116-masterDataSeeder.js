'use strict';

const moment = require('moment/moment');
const db = require('../config/sequelize');

const cityLocationModel = db.cityLocation
const countryGroupModel = db.countryGroup
const nationalityModel = db.nationality
const msFacilitiesModel = db.masterFacility
const breakfastsModel = db.masterBreakfasts
const roomGradesModel = db.masterRoomGrade
const sessionsModel = db.masterSession
const paymentMethodModel = db.masterPaymentMethod
const holidayModel = db.holiday

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const date = '2023-01-01';
    let cityLocations = [];
    let countryGroups = [];
    let nationalities = [];
    let facilities = [];
    let breakfasts = [];
    let holidays = [];

    for (let i = 1; i <= 1500; i++) {
      cityLocations.push({
        cityId: i,
        code: i,
        name: `location ${i}`,
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

      nationalities.push({
        code: i,
        name: `nationality ${i}`,
        rank: i,
        status: 1,
        createdBy: 1,
      });

      facilities.push({
        name: `name ${i}`,
        code: i,
        category: i % 2 === 0 ? 'hotel' : 'room',
        status: '1',
        createdBy: 1,
      });

      breakfasts.push({
        name: `name ${i}`,
        code: i,
        createdBy: 1,
      });

      holidays.push({
        date: moment(date).add((i - 1), 'days'),
        isHoliday: false,
      })
    }

    // await cityLocationModel.bulkCreate(cityLocations);
    // await countryGroupModel.bulkCreate(countryGroups);
    // await nationalityModel.bulkCreate(nationalities);
    // await msFacilitiesModel.bulkCreate(facilities);
    // await breakfastsModel.bulkCreate(breakfasts);
    // await roomGradesModel.bulkCreate(breakfasts);
    // await sessionsModel.bulkCreate(breakfasts);
    // await paymentMethodModel.bulkCreate(breakfasts);
    await holidayModel.bulkCreate(holidays);

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
