const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs/promises');
const { Server: SocketServer } = require("socket.io");
const cors = require('cors');
const chokidar = require('chokidar');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
const server = http.createServer(app);
const io = new SocketServer({
    cors: '*'
});
const pty = require('node-pty'); 
app.use(cors());

const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user', 
    env: process.env
});

io.attach(server);

chokidar.watch('./user').on('all', (event, path) => {
    io.emit('file:refresh', path);
});

  ptyProcess.onData(data =>{
      io.emit('terminal:data', data);
  });

io.on('connection', (socket) => {
    console.log('🚀 New client connected: ', socket.id);

    socket.on('terminal:write', (data) => {
        ptyProcess.write(data);
    });
    socket.on('file:change', async ({ path, content}) => {
        await fs.writeFile(`./user/${path}`, content);
    })
})

app.get('/files', async (req, res) => {

    const fileTree = await generateFileTree('./user');
    res.json({ tree: fileTree });
    
});

app.get('/files/content', async (req, res) => {
    const path = req.query.path;
    const content = await fs.readFile(`./user/${path}`, 'utf-8');
    return res.json({ content });
});

server.listen(3000, () => console.log('🐋 Server is running on port 3000'));

async function generateFileTree(directory){
    const tree =  {}

    async function buildTree(curDir, curTree){
        const files = await fs.readdir(curDir);

        for(const file of files){
            const filePath = path.join(curDir, file);
            const stats = await fs.stat(filePath);

            if(stats.isDirectory()){
                curTree[file] = {};
                await buildTree(filePath, curTree[file]);
            }else{
                curTree[file] = null;
            }
        }
    }
    await buildTree(directory, tree);
    return tree;
}