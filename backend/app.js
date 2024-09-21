const express = require('express');
const path = require('path');
const { connectToDB } = require('./util/database');
require('dotenv').config();
const cors = require('cors')

const { isAuth } = require('./middlewares/auth')

const { authRouter } = require("./routes/auth");

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors());

app.use('/auth', authRouter)

app.use(isAuth);







const main = async () => {
    try {
        await connectToDB();
        console.log("Connection Established")
        app.listen(3000);
    }
    catch (error) {
        throw error;
    }
}
main();