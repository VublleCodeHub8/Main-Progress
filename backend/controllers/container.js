const Docker = require('dockerode')
const net = require('net');
const { getContainerById, getContainerByPort, getContainersByEmail, createNewContainer } = require('../models/containers')

const docker = new Docker();

const mappingOfImages = {
    "node": "project-server"
}


const createContainer = async (req, res) => {
    const template = req.body.template;
    let thePort;
    for (let i = 5000; i <= 8000; ++i) {
        const doc = await getContainerByPort(i);
        if (!doc) {
            const status = await isPortAvailable(i);
            if (status) {
                thePort = i;
                break;
            }
        }
    }

    let image;
    image = mappingOfImages[template];
    console.log(template, image);

    const container = await docker.createContainer({
        Image: image,
        ExposedPorts: {
            '4000/tcp': {}
        },
        HostConfig: {
            PortBindings: {
                '4000/tcp': [
                    {
                        HostPort: `${thePort}`
                    }
                ]
            }
        }
    })
    console.log(container);
    const contName = (await docker.getContainer(container.id).inspect()).Name.substring(1);
    const contId = container.id;
    const contPort = thePort;
    const contEmail = req.userData.email;
    const contUserId = req.userData.userId;

    const saveRes = await createNewContainer(contEmail, contUserId, contId, contName, contPort, image);
    if (saveRes) {
        res.json({ containerId: contId, containerName: contName, containerPort: contPort, containerTemplate: image });
    } else {
        res.status(500);
        res.send();
    }
}

const runContainer = async (req, res) => {
    try {
        const contId = req.params.containerId;
        const container = docker.getContainer(contId);
        const containerDetails = await docker.getContainer(contId).inspect();
        if (containerDetails.State.Running) {
            const doc = await getContainerById(contId);
            return res.json({
                port: doc.port,
                name: containerDetails.Name,
                createdAt: doc.createdAt
            });
        }

        await container.start();
        console.log(contId, " started");

        const doc = await getContainerById(contId);
        res.json({
            port: doc.port,
            name: containerDetails.Name,
            createdAt: doc.createdAt
        });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send();
    }

}

async function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.listen(port, () => {
            server.close(() => {
                resolve(true);
            });
        });

        server.on('error', () => {
            resolve(false);
        });
    });
}

exports.createContainer = createContainer;
exports.runContainer = runContainer;