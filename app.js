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
    origin: 'https://ekyc.tech', // Allow only your frontend origin
    credentials: true,           // Include cookies if required
};

app.use(cors(corsOptions));

// Ensure CORS headers are present for OPTIONS preflight requests
app.options('*', cors(corsOptions));

//Cors Access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://ekyc.tech'); // Frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // If cookies are needed
    next();
});

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