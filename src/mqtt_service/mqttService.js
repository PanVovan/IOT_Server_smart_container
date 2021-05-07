import mqtt from 'mqtt';
import {MQTTMessageHandler} from './MQTTMessageHandler.ts'
import {Trashbox} from '../trashbox.ts'

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
    containers.get(getId(t)).fullness = parseFloat(m)
});

handler.on(`containers/+/longitude`, (t, m) =>
{
    containers.get(getId(t)).longitude = parseFloat(m)
});

handler.on(`containers/+/latitude`, (t, m) =>
{
    containers.get(getId(t)).latitude = parseFloat(m)
});

handler.on('containers/stopped_container', (t, m) =>
{
    containers.delete(message.toString());
});

//console.log(`fullness: ${m.toString()} container: ${getId(t)}`);


client.on('connect', (topic, message) => {
    console.log('Connected');
    handler.start();
});

client.on('message', (topic, message) => {
    console.log("message:");
    handler.process(topic, message)
});

function getId(topic)
{
    return topic.toString().split('/')[1]
}

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