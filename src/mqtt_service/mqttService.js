import mqtt from 'mqtt';
import {MQTTMessageHandler} from './MQTTMessageHandler.ts'


const BROKER_IP = 'broker.hivemq.com';
const options = 
{
    clientId:"mqttjs01",
    port: 1883,
    protocol: 'mqtt'
};

const client = mqtt.connect(BROKER_IP, options);

const handler = new MQTTMessageHandler(client);

handler.on('containers/new_container', (topic, message) => 
{

    console.log(`topic created: containers/${message.toString()}`);

    handler.on(`containers/${message}/fullness`, (t, m) =>
    {
        console.log(`fullness: ${m.toString()} container: ${t.toString()}`);
    });
    
    handler.on(`containers/${message}/longitude`, (t, m) =>
    {
        console.log(`longitude: ${m.toString()} container: ${t.toString()}`);
    });
    
    handler.on(`containers/${message}/latitude`, (t, m) =>
    {
        console.log(`latitude: ${m.toString()} container: ${t.toString()}`);
    });

});

client.on('connect', (topic, message) => {
    console.log('Connected');
    handler.debug()
});

client.on('message', (topic, message) => {
    console.log("message:");
    handler.process(topic, message)
});