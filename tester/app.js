const mqtt = require('mqtt');
const {MQTTMessageHandler} = require('../src/mqtt_service/MQTTMessageHandler.js')
require("dotenv").config();

const options = 
{
    host: process.env.MQTT_HOST,
    clientId: "garbage",
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    port: process.env.MQTT_PORT,
    protocol: 'mqtt',
    will: {
        topic: "containers/stopped_container",
        message: "garbage"
    }
};


const attribures =
    {
        fullness: 51,
        longitude: 55.5414643,
        latitude: 37.0792043
    }

const client = mqtt.connect(options);
const handler = new MQTTMessageHandler(client);

handler.on('connected', (topic, message) => 
{
    client.publish('containers/new_container', options.clientId);

    client.publish(`containers/${options.clientId}/latitude`, attribures.latitude.toString());
    client.publish(`containers/${options.clientId}/fullness`, attribures.fullness.toString());
    client.publish(`containers/${options.clientId}/longitude`, attribures.longitude.toString());
});

client.on('connect', () => 
{
    console.log("Сlient сonnected");
    client.publish('containers/new_container', options.clientId);
    
    setTimeout(() =>client.publish(`containers/${options.clientId}/fullness`, attribures.fullness.toString()), 1000);
    setTimeout(() =>client.publish(`containers/${options.clientId}/longitude`, attribures.longitude.toString()), 1000);
    setTimeout(() =>client.publish(`containers/${options.clientId}/latitude`, attribures.latitude.toString()), 1000);
})

client.on('message', (topic, message) => 
{
    console.log("message:");
    handler.process(topic, message)
});
