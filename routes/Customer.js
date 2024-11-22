const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Fileupload");

const { createNewCustomer } = require("../controllers/Customer/createNewCustomer")
router.post('/createNewCustomer', upload.fields([{ name: 'aadharFrontImage' }, { name: 'pancardImage' }, { name: 'aadharBackImage' }, { name: 'customerPhoto' }]), createNewCustomer)

const { getListOfCustomer } = require("../controllers/Customer/getListOfCustomer")
router.get('/getListOfCustomers', getListOfCustomer)

const { generateCustomerToken } = require("../controllers/Customer/generateCustomerToken")
router.get('/generateCustomerToken', generateCustomerToken)

module.exports = router