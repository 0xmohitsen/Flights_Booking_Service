const { BookingService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse} = require('../utils/common')

const inMemDB = {};

async function createBooking(req, res){
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });

        SuccessResponse.data = response;

        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {

        // console.log("Controller catching the error: ",error);
        ErrorResponse.error = error;

        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function makePayment(req, res){
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];
        console.log(idempotencyKey);
        if(!idempotencyKey){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'Idempotency key is missing'});
        }
        if(inMemDB[idempotencyKey]){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'Can not retry on a successful payment'});
        }
        const payment = await BookingService.makePayment({
            bookingId: req.body.bookingId,
            userId: req.body.userId,
            totalCost: req.body.totalCost
        });

        SuccessResponse.data = payment;

        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;

        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment
}