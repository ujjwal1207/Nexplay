require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // ✅ correct
console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);  // Add this line for debugging
const { connectDB } = require('./db/index.js');
const {app} = require('./app.js');
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
    console.log('Database connection established and server is running at port');
})}).catch((error) => {
    console.error('Database connection failed in index  of src:', error);
});
