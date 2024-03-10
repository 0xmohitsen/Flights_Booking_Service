const { BookingRepository } = require('../repositories');

const db = require('../models');
const axios = require('axios');
const { ServerConfig } = require('../config');
const AppError = require('../utils/error/app-error');
const { StatusCodes } = require('http-status-codes');

const bookingRepository = new BookingRepository();

async function createBooking(data){
    // console.log(ServerConfig.FLIGHT_SERVICE);

    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.seatCapacity) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const totalBilling = data.noOfSeats*flightData.ticketPrice;
        const bookingPayload = {...data, totalCost: totalBilling};

        const booking = await bookingRepository.create(bookingPayload, transaction);

        // update the remaining seats in flight table;
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats
        });

        await transaction.commit();
        return booking;
    } catch(error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking
}