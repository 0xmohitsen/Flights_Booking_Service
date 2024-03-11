const cron = require('node-cron');
const { BookingService } = require('../../services');

function scheduleCrons(){
    cron.schedule('* * * * *', async () => {
        // console.log('I am in cron-jobs');
        await BookingService.cancelOldBooking();
});
}

module.exports = scheduleCrons;