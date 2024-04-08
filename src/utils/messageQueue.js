const amqplib = require('amqplib');

const { ServerConfig } = require('../config');

async function createChannel(){
    try {
        const connection = await amqplib.connect(ServerConfig.MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(ServerConfig.EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        throw error;
    }
}

async function subscribeMessage(channel, service, binding_key){
    try {
        const applicationQueue = await channel.assertQueue(ServerConfig.QUEUE_NAME);

        await channel.bindQueue(applicationQueue.queue, ServerConfig.EXCHANGE_NAME, binding_key);

        channel.consume(applicationQueue.queue, (msg) => {
            console.log("Received data");
            console.log(msg.content.toString());
            channel.ack(msg);
        });
    } catch (error) {
        throw error;
    }
}

async function publishMessage(channel, binding_key, message){
    try {
        await channel.assertQueue(ServerConfig.QUEUE_NAME);
        await channel.publish(ServerConfig.EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}