const dotenv = require('dotenv');
const { PROCESSING } = require('http-status-codes');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
    MSG_QUEUE: process.env.MSG_QUEUE,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    QUEUE_NAME: process.env.QUEUE_NAME,
    FLIGHT_NOTIFICATION_SERVICE: process.env.FLIGHT_NOTIFICATION_SERVICE
}