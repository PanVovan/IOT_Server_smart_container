const express = require('express');
const MQTTService = new (require("./mqtt_service/mqttService.js"));
const app = express();
const path = require('path');
const fs = require('fs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'client')))

server.listen(port, () => {
    console.log("Listening to %d", port)
})


io.sockets.on('connection', (socket) =>
{
    let ID = (socket.id).toString();

    const emitter = MQTTService.emitter;

    socket.emit('getcontainers', getContainers());

    console.log("connected");
    console.log("ID:", ID);


    emitter.on('update', (data) =>
    {
        socket.emit('update_containers', data[0]);
    })


    emitter.on('delete', (data) =>
    {
        socket.emit('delete_container', data);
    })
})

function getContainers()
{
    return JSON.stringify([...MQTTService.getContainers()]);
}