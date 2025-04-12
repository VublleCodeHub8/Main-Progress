const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { connectToDB } = require('./util/database');
require('dotenv').config();
const cors = require('cors')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const Redis = require('ioredis')

const { isAuth, isAdmin, isDev, isUser } = require('./middlewares/auth')

const { authRouter } = require("./routes/auth");
const { containerRouter } = require('./routes/container');
const { adminRouter } = require('./routes/admin')
const { devRouter } = require('./routes/dev')
const { userRouter } = require('./routes/user')

const { findUserByEmail } = require("./models/user");
const { allTemplate } = require("./models/template")

const app = express();
const bodyParser = require('body-parser');
const server = http.createServer(app);

// Swagger Documentation
const { swaggerServe, swaggerSetup } = require('./swagger');
app.use('/api-docs', swaggerServe, swaggerSetup);

// CSRF Protection setup
const csrfProtection = csrf({ cookie: true });

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser()) // Required for CSRF

// Configure CORS with credentials
app.use(cors());

// Logging by morgan
const logsDir = path.join(__dirname, 'logs');
fs.mkdir(logsDir, { recursive: true }).catch(console.error);
morgan.token('custom-date', () => {
    return new Date().toISOString();
});
morgan.token('user-email', (req) => {
    return req.userData ? req.userData.email : 'anonymous';
});
const customLogFormat = ':custom-date [:method] :url :status :response-time ms - User::user-email - :res[content-length]';
const accessLogStream = rfs.createStream('access.log', {
    interval: '3h', // rotate every 3 hours
    path: logsDir,
    size: '10M', // rotate if size exceeds 10 MB
});
app.use(morgan(customLogFormat, { stream: accessLogStream }));
// app.use(morgan('dev')); // Also log to console in development

// CSRF token endpoint
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF protection to all routes except auth routes
app.use('/auth', authRouter)

app.use(isAuth);
// app.use(csrfProtection); // Apply CSRF protection after auth middleware

// Error handler for CSRF token errors
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // Handle CSRF token errors
        return res.status(403).json({
            error: 'Invalid CSRF token',
            message: 'Form submission failed. Please try again.'
        });
    }
    next(err);
});

app.get("/getuser", async (req, res) => {
    try {
        const emailOfUser = req.userData.email;
        const data = await findUserByEmail(emailOfUser);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send();
    }
});

app.get('/getAllTemplates', async (req, res) => {
    const data = await allTemplate();
    // console.log(data);
    if (!data) {
        res.status(500);
        res.send();
    }
    res.json(data);
})

app.use('/container', containerRouter)

app.use('/admin', isAdmin, adminRouter)

app.use('/dev', isDev, devRouter)

app.use('/user', userRouter);


app.use((req, res) => {
    res.status(404);
    res.send();
})

app.use((req, res, next) => {
    console.log('No Route Found');
    next(new Error('404 - No Route Found'));
})

app.use((error, req, res, next) => {
    console.log("Error Handler Reached");
    console.log(error);
    res.status(500).send();
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
