require('dotenv').config({ path: './.env' });
const { connectDB } = require('./db/index.js');
const {app} = require('./app.js');
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
    console.log('Database connection established and server is running at port');
})}).catch((error) => {
    console.error('Database connection failed in index  of src:', error);
});

app.get('/', (req, res) => {
    res.send('Hello from Nexplay API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
