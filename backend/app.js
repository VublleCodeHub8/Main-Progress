const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { connectToDB } = require('./util/database');
require('dotenv').config();
const cors = require('cors')

const { Server: socketServer } = require('socket.io');
const chokidar = require('chokidar')
const os = require('os');
const pty = require('node-pty');

const { isAuth } = require('./middlewares/auth')

const { authRouter } = require("./routes/auth");
const { projectRouter } = require('./routes/project')

const app = express();
const bodyParser = require('body-parser');
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors());

app.use('/auth', authRouter)

// app.use(isAuth);

app.use('/project', projectRouter)


// DOCKER SERVER LOGIC

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
// console.log(shell, process.env.INIT_CWD + '\\servers');

const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD,
    env: process.env
});

ptyProcess.onData((data) => {
    let newData = data;
    // newData.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
    //     .replace(/\x1b\[\?25[hl]/g, '') // Matches cursor visibility control
    //     .replace(/\x1b=\x1b>/g, '');
    // async function stripAnsi() {
    //     try {
    //         const module = (await import('strip-ansi')).default;
    //         newData = module(data);
    //     } catch (error) {
    //         console.error("Error loading module:", error);
    //     }
    // }

    // stripAnsi();
    // if (newData === data) {
    //     console.log("loda");
    // } else {
    //     console.log("chut");
    // }
    console.log(newData);

    io.emit('terminal:data', newData);
});

const io = new socketServer({
    cors: '*'
})

io.attach(server);
io.on('connection', (socket) => {
    // console.log(socket);
    console.log('Socket Connected', socket.id, io.sockets.sockets.size);

    socket.on('terminal:write', (data) => {
        console.log(data);
        ptyProcess.write(data);
    })
    // socket.on('disconnect', () => {
    //     console.log(`Disconnected: ${socket.id}`);
    //     console.log(`Total connections: ${io.sockets.sockets.size}`);
    // });
})


// File System Update
chokidar.watch('./').on('all', (event, path) => {
    io.emit('file:refresh', path);
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