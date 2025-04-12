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

app.post('/project/file/create', async (req, res) => {
    const data = req.body;
    
    // Validate input
    if (!data.filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }
    
    // Ensure path is within allowed directory
    const fullPath = path.join(FILE_ROOT, data.filePath);
    const normalizedPath = path.normalize(fullPath);
    
    // Security check to prevent path traversal attacks
    if (!normalizedPath.startsWith(path.normalize(FILE_ROOT))) {
        return res.status(403).json({ error: 'Access denied: Cannot create files outside the project directory' });
    }
    
    try {
        // Check if parent directory exists
        const directory = path.dirname(normalizedPath);
        const dirStat = await fs.stat(directory).catch(() => null);
        
        if (!dirStat || !dirStat.isDirectory()) {
            return res.status(404).json({ 
                error: 'Parent directory does not exist',
                directory: path.relative(FILE_ROOT, directory)
            });
        }
        
        // Create empty file
        await fs.writeFile(normalizedPath, '');
        
        // Return success with file info
        res.status(201).json({
            success: true,
            filePath: data.filePath,
            fullPath: normalizedPath
        });
    } catch (err) {
        console.error('Error creating file:', err);
        res.status(500).json({ 
            error: 'Failed to create file',
            details: err.message 
        });
    }
});

app.post('/project/folder/create', async (req, res) => {
    const data = req.body;
    
    // Validate input
    if (!data.folderPath) {
        return res.status(400).json({ error: 'Folder path is required' });
    }
    
    // Ensure path is within allowed directory
    const fullPath = path.join(FILE_ROOT, data.folderPath);
    const normalizedPath = path.normalize(fullPath);
    
    // Security check to prevent path traversal attacks
    if (!normalizedPath.startsWith(path.normalize(FILE_ROOT))) {
        return res.status(403).json({ error: 'Access denied: Cannot create folders outside the project directory' });
    }
    
    try {
        // Check if folder already exists
        const folderStat = await fs.stat(normalizedPath).catch(() => null);
        if (folderStat) {
            return res.status(409).json({ 
                error: 'Folder already exists',
                folderPath: data.folderPath
            });
        }

        // Create the folder with recursive option to create parent directories if they don't exist
        await fs.mkdir(normalizedPath, { recursive: true });
        
        // Return success
        res.status(201).json({
            success: true,
            folderPath: data.folderPath,
            fullPath: normalizedPath
        });
    } catch (err) {
        console.error('Error creating folder:', err);
        res.status(500).json({ 
            error: 'Failed to create folder',
            details: err.message 
        });
    }
});

app.delete('/project/file/delete', async (req, res) => {
    const data = req.body;
    
    // Validate input
    if (!data.filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }
    
    // Ensure path is within allowed directory
    const fullPath = path.join(FILE_ROOT, data.filePath);
    const normalizedPath = path.normalize(fullPath);
    
    // Security check to prevent path traversal attacks
    if (!normalizedPath.startsWith(path.normalize(FILE_ROOT))) {
        return res.status(403).json({ error: 'Access denied: Cannot delete files outside the project directory' });
    }
    
    try {
        // Check if file exists and is actually a file
        const fileStat = await fs.stat(normalizedPath).catch(() => null);
        
        if (!fileStat) {
            return res.status(404).json({ 
                error: 'File does not exist',
                filePath: data.filePath
            });
        }
        
        if (!fileStat.isFile()) {
            return res.status(400).json({ 
                error: 'Path exists but is not a file',
                filePath: data.filePath
            });
        }
        
        // Delete the file
        await fs.unlink(normalizedPath);
        
        // Return success
        res.status(200).json({
            success: true,
            filePath: data.filePath,
            fullPath: normalizedPath
        });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).json({ 
            error: 'Failed to delete file',
            details: err.message 
        });
    }
});

app.delete('/project/folder/delete', async (req, res) => {
    const { folderPath } = req.body;

    if (!folderPath) {
        return res.status(400).json({ error: 'Folder path is required' });
    }

    const fullPath = path.join(FILE_ROOT, folderPath);
    const normalizedPath = path.normalize(fullPath);

    if (!normalizedPath.startsWith(path.normalize(FILE_ROOT))) {
        return res.status(403).json({ error: 'Access denied: Cannot delete folders outside the project directory' });
    }

    try {
        const folderStat = await fs.stat(normalizedPath).catch((err) => {
            console.error('Error checking folder:', err);
            return null;
        });

        if (!folderStat) {
            console.log('Folder not found:', normalizedPath);
            return res.status(404).json({ 
                error: 'Folder does not exist',
                folderPath
            });
        }

        if (!folderStat.isDirectory()) {
            return res.status(400).json({ 
                error: 'Path exists but is not a folder',
                folderPath
            });
        }

        // Delete the folder recursively
        await fs.rm(normalizedPath, { recursive: true, force: true });

        res.status(200).json({
            success: true,
            message: 'Folder deleted successfully',
            folderPath,
            fullPath: normalizedPath
        });
    } catch (err) {
        console.error('Error deleting folder:', err);
        res.status(500).json({ 
            error: 'Failed to delete folder',
            details: err.message 
        });
    }
});

app.patch('/project/file/rename', async (req, res) => {
    const data = req.body;
    
    // Validate input
    if (!data.oldPath || !data.newPath) {
        return res.status(400).json({ error: 'Both old and new file paths are required' });
    }
    
    // Ensure paths are within allowed directory
    const oldFullPath = path.join(FILE_ROOT, data.oldPath);
    const newFullPath = path.join(FILE_ROOT, data.newPath);
    const normalizedOldPath = path.normalize(oldFullPath);
    const normalizedNewPath = path.normalize(newFullPath);
    
    // Security check to prevent path traversal attacks
    if (!normalizedOldPath.startsWith(path.normalize(FILE_ROOT)) || 
        !normalizedNewPath.startsWith(path.normalize(FILE_ROOT))) {
        return res.status(403).json({ error: 'Access denied: Cannot rename files outside the project directory' });
    }
    
    try {
        // Check if source file exists and is actually a file
        const oldFileStat = await fs.stat(normalizedOldPath).catch(() => null);
        
        if (!oldFileStat) {
            return res.status(404).json({ 
                error: 'Source file does not exist',
                filePath: data.oldPath
            });
        }
        
        if (!oldFileStat.isFile()) {
            return res.status(400).json({ 
                error: 'Source path exists but is not a file',
                filePath: data.oldPath
            });
        }

        // Check if destination already exists
        const newFileStat = await fs.stat(normalizedNewPath).catch(() => null);
        if (newFileStat) {
            return res.status(409).json({ 
                error: 'Destination file already exists',
                filePath: data.newPath
            });
        }

        // Ensure the destination directory exists
        const destDir = path.dirname(normalizedNewPath);
        const destDirStat = await fs.stat(destDir).catch(() => null);
        if (!destDirStat || !destDirStat.isDirectory()) {
            return res.status(404).json({ 
                error: 'Destination directory does not exist',
                directory: path.relative(FILE_ROOT, destDir)
            });
        }
        
        // Rename the file
        await fs.rename(normalizedOldPath, normalizedNewPath);
        
        // Return success
        res.status(200).json({
            success: true,
            oldPath: data.oldPath,
            newPath: data.newPath,
            oldFullPath: normalizedOldPath,
            newFullPath: normalizedNewPath
        });
    } catch (err) {
        console.error('Error renaming file:', err);
        res.status(500).json({ 
            error: 'Failed to rename file',
            details: err.message 
        });
    }
});

// Route to find file path by filename
app.get('/project/file/find/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const rootDir = path.join(__dirname, FILE_ROOT);
        let filePath = null;

        // Function to search for file recursively
        async function findFile(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    const result = await findFile(fullPath);
                    if (result) return result;
                } else if (entry.name === filename) {
                    return fullPath;
                }
            }
            return null;
        }

        filePath = await findFile(rootDir);

        if (!filePath) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Return relative path from FILE_ROOT
        const relativePath = path.relative(rootDir, filePath);
        res.json({ path: relativePath });
    } catch (error) {
        console.error('Error finding file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DOCKER SERVER LOGIC

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const currentDir = path.dirname(require.main.filename);

const spawnPath = path.join(currentDir, "../user");

const io = new socketServer({
    cors: '*'
})

// Attach the socket server to the HTTP server
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

// Start the server
const main = async () => {
    try {
        server.listen(4000);
    }
    catch (error) {
        throw error;
    }
}
main();
