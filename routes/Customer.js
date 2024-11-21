const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Fileupload");

const { createNewCustomer } = require("../controllers/Customer/createNewCustomer")
router.post('/createNewCustomer', upload.fields([{ name: 'aadharFrontImage' }, { name: 'pancardImage' }, { name: 'aadharBackImage' }]), createNewCustomer)

const { getListOfCustomer } = require("../controllers/Customer/getListOfCustomer")
router.get('/getListOfCustomers', getListOfCustomer)

module.exports = router