const dotenv = require('dotenv');
const { PROCESSING } = require('http-status-codes');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
    MSG_QUEUE: process.env.MSG_QUEUE
}