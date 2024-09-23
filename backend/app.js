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

app.use(isAuth);

app.use('/project', projectRouter)


// DOCKER SERVER LOGIC

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const spawnPath=path.join(process.env.INIT_CWD,"servers");

const io = new socketServer({
    cors: '*'
})

io.attach(server);
io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id, io.sockets.sockets.size);
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-256color',
        cols: 80,
        rows: 30,
        cwd: spawnPath,
        env: process.env
    });
    
    ptyProcess.onData((data) => {
        io.emit('terminal:data', data);
    });
    socket.on('terminal:write', (data) => {
        console.log(data);
        ptyProcess.write(data);
    })

    // File Save
    socket.on('file:save', (data, filePath) => {
        console.log(data, filePath);
        const realPath = path.resolve(filePath);
        fs.writeFile(realPath, data).then((res) => {
            console.log(res);
            socket.emit('file:saveStatus', "success");
        }).catch((err) => {
            console.log(err);
            socket.emit('file:saveStatus', 'fail');
        })
    })
})


// File System Update
chokidar.watch(process.env.FILE_ROOT).on('all', (event, path) => {
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