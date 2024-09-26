const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { connectToDB } = require('./util/database');
require('dotenv').config();
const cors = require('cors')

const { isAuth } = require('./middlewares/auth')

const { authRouter } = require("./routes/auth");
const { containerRouter } = require('./routes/container');
const {adminRouter} = require('./routes/admin')
const {devRouter} = require('./routes/dev')


const app = express();
const bodyParser = require('body-parser');
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors());

app.use('/auth', authRouter)

app.use(isAuth);

app.use('/container', containerRouter)

app.use('/admin', adminRouter)

app.use('/dev', devRouter)




app.use((req, res) => {
    res.status(404);
    res.send();
})



const main = async () => {
    try {
        await connectToDB();
        console.log("Connection Established")
        server.listen(3000);
    }
    catch (error) {
        throw error;
    }
}
main();