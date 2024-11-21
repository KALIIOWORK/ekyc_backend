const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Fileupload");

const { createNewCustomer } = require("../controllers/Customer/createNewCustomer")
router.post('/createNewCustomer', upload.fields([{ name: 'aadharImage' }, { name: 'pancardImage' }]), createNewCustomer)

const { getListOfCustomer } = require("../controllers/Customer/getListOfCustomer")
router.get('/getListOfCustomers', getListOfCustomer)

module.exports = router