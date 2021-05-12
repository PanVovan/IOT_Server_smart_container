const express = require('express');
const mqtt_service = require("./mqtt_service/mqttService.js")

const app = express();

const path = require('path');
const fs = require('fs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.set("mqtt_service", new mqtt_service())


app.use(express.static(path.join(__dirname, 'client')))

server.listen(port, () => {
    console.log("Listening to %d", port)
})


io.sockets.on('connection', (socket) =>
{
    let ID = (socket.id).toString();

    const emitter = app.get("mqtt_service").emitter;

    socket.emit('getcontainers', getContainers());

    console.log("connected");
    console.log("ID:", ID);


    emitter.on('update', (data) =>
    {
        socket.emit('update_containers', data[0]);
    })


    emitter.on('delete', (data) =>
    {
        socket.emit('delete', data[0]);
    })
})

function getContainers()
{
    return JSON.stringify([...app.get("mqtt_service").getContainers()]);
}