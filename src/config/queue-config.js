const amqplib = require('amqplib');
const ServerConfig = require('./server-config');

let connection , channel;

async function connectQueue(){
    try {
        connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();

        await channel.assertQueue(ServerConfig.MSG_QUEUE);
    } catch (error) {
        console.log(error);
    }
}

async function sendData(data){
    // data is mostly coming in the object form so convert it into string
    try {
        await channel.sendToQueue(ServerConfig.MSG_QUEUE, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectQueue,
    sendData
}