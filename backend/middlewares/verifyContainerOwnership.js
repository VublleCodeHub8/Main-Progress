const { getContainerById } = require('../models/containers');

const verifyContainerOwnership = async (req, res, next) => {
    try {
        const containerId = req.params.containerId;
        const container = await getContainerById(containerId);
        
        if (!container) {
            return res.status(404).json({ error: "Container not found" });
        }
        
        const isOwner = container.email === req.userData.email;
        const isAdmin = req.userData.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "Unauthorized access: You don't have permission to access this container" });
        }
        
        req.container = container;
        next();
    } catch (error) {
        console.error("Error verifying container ownership:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = verifyContainerOwnership;
