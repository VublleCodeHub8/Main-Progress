const Docker = require('dockerode')
const net = require('net');
const { getContainerById, getContainerByPort, getContainersByEmail, createNewContainer, deleteOneContainer, setStartedAt } = require('../models/containers')
const { addContainerHistory } = require('../models/containerHistory');
const { findUserByEmail, billIncrement, containerUsageIncrement } = require('../models/user');
const { findTemplateByImage } = require('../models/template');
const docker = new Docker();


const createContainer = async (req, res) => {
    const cont_Name = req.headers['title'];
    const cont_Image = req.headers['template'];
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
        await containerUsageIncrement(contEmail, cont_Image );
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
        await setStartedAt(contId);
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
        const contDetails = await getContainerById(contId);
        const container = docker.getContainer(contId);
        const containerDetails = await docker.getContainer(contId).inspect();
        if (containerDetails.State.Running) {
            const user = await findUserByEmail(contDetails.email);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const timeDiff = Date.now() - contDetails.startedAt;
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            const template = await findTemplateByImage(contDetails.template);
            const amount = hours * template.price + minutes * (template.price / 60) + seconds * (template.price / 3600);
            await billIncrement(user.email, amount);
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
            await setStartedAt(contId);
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
    const contId = req.params.containerId;
    try {
        const contDetails = await getContainerById(contId);
        if (!contDetails) {
            return res.status(404).json({ error: "Container details not found" });
        }
        const user = await findUserByEmail(contDetails.email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let containerExists = true;
        try {
            const container = docker.getContainer(contId);
            await container.inspect();
        } catch (dockerErr) {
            containerExists = false;
        }
        if (containerExists) {
            const container = docker.getContainer(contId);
            const containerDetails = await container.inspect();
            
            if (containerDetails.State.Running) {
                await container.stop();
            }
            await container.remove();
        }
        const deletedAt = new Date();
        try {
            await addContainerHistory(
                contDetails.name,
                contId,
                contDetails.port,
                contDetails.createdAt,
                deletedAt,
                user.username,
                user.email,
                contDetails.template
            );
        } catch (historyErr) {
            console.error("Error adding container history:", historyErr);
        }
        if (containerExists && contDetails.startedAt) {
            const timeDiff = Date.now() - contDetails.startedAt;
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            const template = await findTemplateByImage(contDetails.template);
            const amount = hours * template.price + minutes * (template.price / 60) + seconds * (template.price / 3600);
            await billIncrement(user.email, amount);
        }
        await deleteOneContainer(contId);
        res.json({ 
            status: "deleted",
            containerExistedInDocker: containerExists
        });

    } catch (err) {
        console.error("Error deleting container:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


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
        // console.log(stats);
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
            memoryUsagePercentage: memoryUsagePercentage.toFixed(2) + '%',
            memoryUsage: memoryUsage,
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

const editContainer = async (req, res) => {
    try {
        const { containerId } = req.params;
        const { title } = req.body;

        // Validate inputs
        if (!containerId || !title) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Get container
        const container = docker.getContainer(containerId);
        if (!container) {
            return res.status(404).json({ error: 'Container not found' });
        }

        // Get container info to validate it exists
        await container.inspect();

        // Update container name if changed
        const containerInfo = await container.inspect();
        const currentName = containerInfo.Name.slice(1); // Remove leading slash
        if (currentName !== title) {
            await container.rename({name: title});
        }

        // Update container in database
        const updated = await getContainerById(containerId);
        if (!updated) {
            return res.status(404).json({ error: 'Container not found in database' });
        }

        updated.name = title;
        await updated.save();

        res.json({ 
            status: "success",
            message: "Container updated successfully",
            container: {
                id: containerId,
                title: title,
            }
        });

    } catch (error) {
        console.error('Error updating container:', error);
        res.status(500).json({ 
            error: 'Failed to update container',
            message: error.message 
        });
    }
}

const getContainerRuntime = async (req, res) => {
    try {
        const contId = req.params.containerId;
        const contDetails = await getContainerById(contId);
        
        if (!contDetails) {
            return res.status(404).json({ error: "Container not found" });
        }

        const containerDetails = await docker.getContainer(contId).inspect();
        
        if (!containerDetails.State.Running && !contDetails.startedAt) {
            // Container never ran
            return res.json({
                runtime: {
                    hours: 0,
                    minutes: 0, 
                    seconds: 0
                }
            });
        }

        const startTime = contDetails.startedAt;
        const endTime = containerDetails.State.Running ? Date.now() : containerDetails.State.FinishedAt;
        
        const timeDiff = new Date(endTime) - new Date(startTime);
        
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        res.json({
            runtime: {
                hours,
                minutes,
                seconds
            }
        });

    } catch (err) {
        console.error('Error getting container runtime:', err);
        res.status(500).json({ 
            error: 'Failed to get container runtime',
            message: err.message 
        });
    }
}

const getTemplateNameFromContainerId = async (req, res) => {
    try {
        const contId = req.params.containerId;
        const container = await getContainerById(contId);
        if (!container) {
            return res.status(404).json({ error: "Container not found" });
        }
        const template = await findTemplateByImage(container.template);
        res.json({ templateName: template.name });
    } catch (err) {
        console.error('Error getting template name:', err);
        res.status(500).json({ 
            error: 'Failed to get template name',
            message: err.message 
        });
    }
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
exports.editContainer = editContainer;
exports.getTemplateNameFromContainerId = getTemplateNameFromContainerId;