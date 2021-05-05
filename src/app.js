'use strict'

import express from 'express';

const mqtt_service = require("./mqtt_service/mqttService.js")

const app = express();

app.set("mqtt_service", new mqtt_service())