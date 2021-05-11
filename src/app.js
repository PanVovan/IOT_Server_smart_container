'use strict'

const express = require('express');
const mqtt_service = require("./mqtt_service/mqttService.js")

const app = express();

app.set("mqtt_service", new mqtt_service())

app.get('/example', (req, res) => {
    res.send(app.get("mqtt_service").getContainers());
});

setTimeout(() => console.log(app.get("mqtt_service").getContainers()), 10000)