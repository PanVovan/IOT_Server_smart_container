const mqtt = require('mqtt');
const {MQTTMessageHandler} = require('../src/mqtt_service/MQTTMessageHandler.js')
require("dotenv").config();

const options = 
{
    host: process.env.MQTT_HOST,
    clientId: process.argv[2],
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    port: process.env.MQTT_PORT,
    protocol: 'mqtt'
};


const attribures =
    {
        fullness: 300,
        longitude: 51.508,
        latitude: -0.11
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
    setTimeout(() =>client.publish("containers/stopped_container", options.clientId, {
        retain:true
    }), 10000);
})

client.on('message', (topic, message) => 
{
    console.log("message:");
    handler.process(topic, message)
});
