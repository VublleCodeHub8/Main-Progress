const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
require('dotenv').config();
const cors = require('cors')

const { Server: socketServer } = require('socket.io');
const chokidar = require('chokidar')
const os = require('os');
const pty = require('node-pty');

const app = express();
const bodyParser = require('body-parser');
const server = http.createServer(app)

const { getFileStruct } = require('./util/project')
const FILE_ROOT = '../user'

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors());

app.get('/project/files', async (req, res) => {
    const fileTree = await getFileStruct(FILE_ROOT);
    console.log("final")
    res.json(fileTree);
})

app.post('/project/file', (req, res) => {
    const data = req.body;
    console.log(data);
    fs.readFile(data.fullPath).then((code) => {
        const result = code.toString("utf8");
        console.log(code, result);
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.status(501).send();
    })

})



// DOCKER SERVER LOGIC

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const currentDir = path.dirname(require.main.filename);

const spawnPath = path.join(currentDir, "../user");

const io = new socketServer({
    cors: '*'
})


io.attach(server);
io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id, io.sockets.sockets.size);

    let ptyProc;
    const spawnTerminal = () => {
        const ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30,
            cwd: spawnPath,
            env: process.env
        });

        ptyProc = ptyProcess;

        ptyProcess.onData((data) => {
            io.emit('terminal:data', data);
        });

        ptyProcess.onExit(() => {
            io.emit('terminal:data', "forbidden command");
            spawnTerminal();
        })


    }

    spawnTerminal();

    socket.on('terminal:write', (data) => {
        console.log(data);
        ptyProc.write(data);


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
chokidar.watch(FILE_ROOT).on('all', (event, path) => {
    io.emit('file:refresh', path);
})


const main = async () => {
    try {
        server.listen(4000);
    }
    catch (error) {
        throw error;
    }
}
main();