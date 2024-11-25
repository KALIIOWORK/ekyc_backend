const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
require('dotenv').config();
require('./config/db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Enable CORS for API requests
const corsOptions = {
    origin: false,
};
app.use(cors(corsOptions));

//app.use(cors());

// Set static folder for public files
app.use(express.static(path.join(__dirname, '/public')));

// Serve static files from Vite's build folder (dist)
app.use(express.static(path.join(__dirname, '/dist')));

// Routes
const eKYCRoutes = require('./routes/eKYC');
app.use('/api/v1/ekyc', eKYCRoutes);

const UserRoutes = require('./routes/User');
app.use('/api/v1/user', UserRoutes);

const CustomerRoutes = require('./routes/Customer');
app.use('/api/v1/customer', CustomerRoutes);

// Wildcard route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`> Server is running on port ${PORT}`);
});
