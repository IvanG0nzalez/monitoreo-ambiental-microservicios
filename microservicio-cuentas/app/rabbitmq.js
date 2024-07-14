const amqp = require('amqplib');

let channel;

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'admin_dev',
    password: 'admin_dev',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
};

const connect = async () => {
    const connection = await amqp.connect(rabbitSettings);
    channel = await connection.createChannel();
};

const assertQueue = async (queue) => {
    if(!channel) {
        throw new Error('No hay canal disponible');
    }
    await channel.assertQueue(queue, { durable: true });
};

const sendMessage = async (queue, message) => {
    if(!channel) {
        throw new Error('No hay canal disponible');
    }
    await assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};

const consumeMessage = async (queue, callback) => {
    if(!channel) {
        throw new Error('No hay canal disponible');
    }
    await assertQueue(queue);
    channel.consume(queue, (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());
            callback(messageContent);
            channel.ack(msg);
        }
    }, { noAck: false });
};

const getChannel = () => channel;

module.exports = { connect, assertQueue, sendMessage, consumeMessage, getChannel };