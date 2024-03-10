const { BookingService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse} = require('../utils/common')

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

module.exports = {
    createBooking
}