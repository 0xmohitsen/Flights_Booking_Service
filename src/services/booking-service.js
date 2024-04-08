const { BookingRepository } = require('../repositories');

const db = require('../models');
const axios = require('axios');
const { ServerConfig, Queue } = require('../config');
const AppError = require('../utils/error/app-error');
const { StatusCodes } = require('http-status-codes');

const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

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

        const booking = await bookingRepository.createBooking(bookingPayload, transaction);

        // update the remaining seats in flight table;
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats
        });

        await transaction.commit();
        return booking;
    } catch(error) {
        await transaction.rollback();
        // console.log(error);
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong while booking the flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.getBooking(data.bookingId);

        if(bookingDetails.status === CANCELLED){
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        
        if(currentTime - bookingTime > 1200000){
            // await bookingRepository.updateBooking({status: CANCELLED}, data.bookingId, transaction);
            await cancelBooking(data.bookingId);
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.totalCost != data.totalCost){
            throw new AppError('The payment amount does not match with the amount you have to pay', StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.userId != data.userId){
            throw new AppError('The user is not associated with the corresponding booking', StatusCodes.BAD_REQUEST);
        }

        // NOW WE'LL ASSUME THAT PAYMENT IS SUCCESSFUL
        await bookingRepository.updateBooking({status: BOOKED}, data.bookingId, transaction);

        // await axios.post(`${ServerConfig.FLIGHT_NOTIFICATION_SERVICE}/api/v1/tickets`, {
        //     subject: 'Ticket is booked',
        //     content: 'Ticket is booked successfully',
        //     recipientEmail: 'mohitsen0103@gmail.com',
        //     notificationTime: new Date()
        // })

        Queue.sendData({
            content: `Ticket Booked`,
            text: `Ticket is booked for the booking Id: ${data.bookingId}.`,
            recipientEmail: 'mohitsen0103@gmail.com'
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong while making the payment', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function cancelBooking(bookingId){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.getBooking(bookingId);

        if(bookingDetails.status === CANCELLED){
            await transaction.commit();
            return true;
        }

        // first increase the no of seats in that booked flight
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/$"{bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: 0
        });

        // now update the entry of the bookingId in booking table
        await bookingRepository.updateBooking({status: CANCELLED}, bookingId, transaction);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBooking(){
    try {
        console.log("Inside service");
        const time = new Date(Date.now() - 1000*300); // 5 min ago from the current time
        const response = await bookingRepository.cancelOldBookings(time);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBooking
}