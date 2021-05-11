const mqtt = require('mqtt');
const {MQTTMessageHandler} = require('./MQTTMessageHandler.js')
const {Trashbox} = require('../trashbox.js');
const { split_topic } = require("./topic_parser");

const BROKER_IP = 'broker.hivemq.com';
const options = 
{
    clientId:"mqttjs01",
    port: 1883,
    protocol: 'mqtt'
};

const client = mqtt.connect(BROKER_IP, options);
const handler = new MQTTMessageHandler(client);
const containers = new Map();

handler.on('containers/new_container', (topic, message) => 
{
    containers.set(message.toString(), new Trashbox(message.toString()));
});



handler.on(`containers/+/fullness`, (t, m) =>
{
    containers.get(split_topic(t)[1]).fullness = parseFloat(m)
});




handler.on(`containers/+/longitude`, (t, m) =>
{
    containers.get(split_topic(t)[1]).longitude = parseFloat(m)
});




handler.on(`containers/+/latitude`, (t, m) =>
{
    containers.get(split_topic(t)[1]).latitude = parseFloat(m)
});




handler.on('containers/stopped_container', (t, m) =>
{
    containers.delete(message.toString());
});




client.on('connect', (topic, message) => {
    console.log('Connected');
    handler.start();
});

client.on('message', (topic, message) => {
    handler.process(topic, message)
});


class MQTTService {
    constructor() {
        this.client = client;
        this.containers = containers;
    }

    getContainers()
    {
        return containers;
    }
}

module.exports = MQTTService;