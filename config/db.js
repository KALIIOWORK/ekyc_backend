const mongoose = require('mongoose');

uri = process.env.DATABASE_URI

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .catch((err) => {
        console.log(err)
        console.log('Error in connection');
    })

const connection = mongoose.connection

connection.on('connected', () => {
    console.log('MongoDb Connected!');
})