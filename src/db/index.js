const mongoose = require('mongoose');
const { DB_NAME } = require('../constants');

 const connectDB=async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB in index of db:', error);
    }
};
module.exports = { connectDB };
