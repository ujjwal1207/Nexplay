const express = require('express');
const cors= require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

module.exports = {app};