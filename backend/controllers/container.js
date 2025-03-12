const Docker = require('dockerode')
const net = require('net');
const { getContainerById, getContainerByPort, getContainersByEmail, createNewContainer, deleteOneContainer } = require('../models/containers')

const docker = new Docker();

const mappingOfImages = {
    "node": "project-server"
}


const createContainer = async (req, res) => {
    const cont_Name = req.headers['title'];
    const cont_Image = req.headers['template'];
    // console.log("my tera ", req.headers['template']);
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

    // let image;
    // image = mappingOfImages[template];
    // console.log(template, image);

    const container = await docker.createContainer({
        Image: cont_Image,
        name: `${cont_Name}_${thePort}`,
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
    // console.log(container);
    const contName = (await docker.getContainer(container.id).inspect()).Name.substring(1);
    const contId = container.id;
    const contPort = thePort;
    const contEmail = req.userData.email;
    const contUserId = req.userData.userId;

    const saveRes = await createNewContainer(contEmail, contUserId, contId, contName, contPort, cont_Image);
    if (saveRes) {
        res.json({ containerId: contId, containerName: contName, containerPort: contPort, containerTemplate: cont_Image });
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
        // console.log(contId, " started");

        const doc = await getContainerById(contId);
        res.json({
            port: doc.port,
            name: containerDetails.Name,
            createdAt: doc.createdAt
        });
    } catch (err) {
        // console.log(err);
        res.status(500);
        res.send();
    }

}

const listAllContainers = async (req, res) => {
    try {
        const email = req.userData.email;
        const containers = await getContainersByEmail(email);
        // console.log(containers);
        res.json(containers);
    } catch (err) {
        // console.log(err);
        res.status(500);
        res.send();
    }

}

// container inspects
const continerInspects = async (req, res) => {
    try {
        const contId = req.params.containerId;
        const containerDetails = await docker.getContainer(contId).inspect();
        res.json({
            status: containerDetails.State.Status
        });
    }
    catch (err) {
        // console.log(err);
        res.status(500);
        res.send();
    }
}

const stopContainer = async (req, res) => {
    try {
        const contId = req.params.containerId;
        const container = docker.getContainer(contId);
        const containerDetails = await docker.getContainer(contId).inspect();
        if (containerDetails.State.Running) {
            await container.stop();
            res.json({
                status: "stopped"
            });
        } else {
            res.json({
                status: "already stopped"
            });
        }
    } catch (err) {
        // console.log(err);
        res.status(500);
        res.send();
    }
}

const restartContainer = async (req, res) => {
    try {
        const contId = req.params.containerId;
        const container = docker.getContainer(contId);
        const containerDetails = await docker.getContainer(contId).inspect();
        if (containerDetails.State.Running) {
            await container.restart();
            res.json({
                status: "restarted"
            });
        } else {
            res.json({
                status: "already stopped"
            });
        }
    } catch (err) {
        // console.log(err);
        res.status(500);
        res.send();
    }
}

const startContainer = async (req, res) => {
    try {
        const contId = req.params.containerId;
        const container = docker.getContainer(contId);
        const containerDetails = await docker.getContainer(contId).inspect();
        if (containerDetails.State.Running) {
            res.json({
                status: "already running"
            });
        } else {
            await container.start();
            res.json({
                status: "started"
            });
        }
    } catch (err) {
        // console.log(err);
        res.status(500);
        res.send();
    }
}

const deleteContainer = async (req, res) => {
    // it should delete the container from the database as well, there is also a route in '../models/containers' to delete the container from the database
    const contId = req.params.containerId;
    // console.log(contId);
    try {
        const container = docker.getContainer(contId);
        const containerDetails = await docker.getContainer(contId).inspect();
        if (containerDetails.State.Running) {
            await container.stop();
        }
        await container.remove();

        await deleteOneContainer(contId);
        res.json({
            status: "deleted"
        });
    } catch (err) {
        // console.log(err);
        res.status(500);
    }
}

const getContainerCPUandMemoryStats = async (req, res) => {
    const { containerId } = req.params;

    try {
        // Fetch the container
        const container = docker.getContainer(containerId);

        // Fetch container statistics (stream=false to get a single snapshot)
        const stats = await container.stats({ stream: false });

        // Calculate CPU usage percentage
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemCpuDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const numberCpus = stats.cpu_stats.online_cpus || 1; // Default to 1 if not defined
        const cpuUsagePercentage = ((cpuDelta / systemCpuDelta) * 100) / numberCpus;

        // Calculate memory usage percentage
        const memoryUsage = stats.memory_stats.usage;
        const memoryLimit = stats.memory_stats.limit;
        const memoryUsagePercentage = (memoryUsage / memoryLimit) * 100;

        // Respond with the metrics
        res.json({
            cpuUsagePercentage: cpuUsagePercentage.toFixed(2) + '%',
            memoryUsagePercentage: memoryUsagePercentage.toFixed(2) + '%'
        });
    } catch (error) {
        console.error('Error fetching container stats:', error);
        res.status(500).json({ error: 'Unable to fetch container stats' });
    }
}

const getContainerDetails = async (req, res) => {
    const { containerId } = req.params;

    try {
        const container = docker.getContainer(containerId);
        const containerDetails = await container.inspect();
        const stats = await container.stats({ stream: false });
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemCpuDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const numberCpus = stats.cpu_stats.online_cpus || 1; // Default to 1 if not defined
        const cpuUsagePercentage = ((cpuDelta / systemCpuDelta) * 100) / numberCpus;
        const memoryUsage = stats.memory_stats.usage;
        const memoryLimit = stats.memory_stats.limit;
        const memoryUsagePercentage = (memoryUsage / memoryLimit) * 100;
        res.json({
            status: containerDetails.State.Status,
            cpuUsagePercentage: cpuUsagePercentage.toFixed(2) + '%',
            memoryUsagePercentage: memoryUsagePercentage.toFixed(2) + '%'
        });
    } catch (error) {
        console.error('Error fetching container details:', error);
        res.status(500).json({ error: 'Unable to fetch container details' });
    }
}



// const listAllTemplates=async (req,res) => {
//     try{
//         const userEmail=req.userData.email;
//         const containers = await getContainersByEmail(userEmail);
//         console.log(containers);
//         res.json(containers);
//         }catch(err){
//             console.log(err);
//             res.status(500);
//             res.send();
//         }
// }


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
exports.listAllContainers = listAllContainers;
exports.continerInspects = continerInspects;
exports.stopContainer = stopContainer;
exports.restartContainer = restartContainer;
exports.startContainer = startContainer;
exports.deleteContainer = deleteContainer;
exports.getContainerCPUandMemoryStats = getContainerCPUandMemoryStats;
exports.getContainerDetails = getContainerDetails;