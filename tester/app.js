import mqtt from 'mqtt';

const BROKER_IP = 'broker.hivemq.com';
const options = 
{
    clientId:process.argv[2],
    port: 1883,
    protocol: 'mqtt'
};


const attribures =
    {
        fullness: 300,
        longitude: 300,
        latitude: 300
    }

const client = mqtt.connect(BROKER_IP, options);

client.on('connect', () => {
    console.log("Сlient сonnected");
    client.publish('containers/new_container', options.clientId);
    setTimeout(() => client.publish(`containers/${options.clientId}`, "sss"), 3000);

    setTimeout(() =>client.publish(`containers/${options.clientId}/fullness`, attribures.fullness.toString()), 1000);
    setTimeout(() =>client.publish(`containers/${options.clientId}/longitude`, attribures.longitude.toString()), 1000);
    setTimeout(() =>client.publish(`containers/${options.clientId}/latitude`, attribures.latitude.toString()), 1000);
})