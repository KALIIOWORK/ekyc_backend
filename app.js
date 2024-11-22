const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const multer = require("multer");
const cors = require('cors');
var cron = require('node-cron');


require("dotenv").config();
require("./config/db");

const corsOptions = {
    origin: 'https://ekyc.tech',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://ekyc.tech');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
});


// app.use(cors(corsOptions));

// //Cors Access
// app.use((req, res, next) => {
//     // res.setHeader('Access-Control-Allow-Origin', 'https://ekyc.tech'); // Frontend origin
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); // If cookies are needed
//     next();
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');

console.log(path.join(__dirname, '/public'))

app.use(express.static(path.join(__dirname, '/public')))


const eKYCRoutes = require("./routes/eKYC")
app.use("/api/v1/ekyc", eKYCRoutes)

const UserRoutes = require("./routes/User")
app.use("/api/v1/user", UserRoutes)


const CustomerRoutes = require("./routes/Customer")
app.use("/api/v1/customer", CustomerRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`> Server is running on port ${PORT}`);
});