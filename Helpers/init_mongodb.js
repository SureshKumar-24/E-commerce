const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017', { dbName: 'e-commerce' })
    .then(() => {
        console.log("Mongodb Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
    })

mongoose.connection.on('connected', () => {
    console.log('Mongoose Connected to db');
})

mongoose.connection.on('error', () => {
    console.log(err.message);
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose Connected is disconnected');
})

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
})