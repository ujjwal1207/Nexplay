require('dotenv').config({ path: './.env' });
const express = require('express');
const { connectDB } = require('./db/index.js');

const app = express();
connectDB();

app.get('/', (req, res) => {
    res.send('Hello from Nexplay API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
