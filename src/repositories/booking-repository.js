const { StatusCodes } = require('http-status-codes');
const { Booking } = require('../models');
const AppError = require('../utils/error/app-error');
const CrudRepository = require('./crud-repository');

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data, transaction){
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    }

    async getBooking(id, transaction){
            const response = await Booking.findByPk(id, {transaction: transaction});
            if(!response){
                throw new AppError('Booking details are not found', StatusCodes.NOT_FOUND);
            }
            return response;
    }

    async updateBooking(data, id, transaction){
        const response = await Booking.update(data, {
            where: {
                id: id
            }},{transaction: transaction});

            return response;
    }
}

module.exports = BookingRepository;