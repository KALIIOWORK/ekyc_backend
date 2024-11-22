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

app.use(cors());

//Cors Access
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
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