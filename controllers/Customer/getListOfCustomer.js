const Customer = require("../../models/Customer")

exports.getListOfCustomer = async (req, res) => {
    try {
        const customers = await Customer.find();

        if (customers.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No Customers"
            })
        }

        return res.status(200).json({
            status: true,
            message: "List of customers retrieved successfully",
            customers: customers
        });

    }
    catch (err) {
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}