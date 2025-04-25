const express = require('express');
const router = express.Router();
const { getUserData, addMoreData } = require('../controllers/user');
const multer = require("multer");
const { isUser } = require('../middlewares/auth');
const { addBugReportController, addContactUsController, getTop5NotificationsController, 
    getProfileData, updateAdditionalInfo, addPublicController, getAllPublicController, 
    makePublicController, makePrivateController, deletePublicController, getPublicStatusController, 
    getPublicByContainerIdController, getPublicFlagController } = require('../controllers/user');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

const addMoreDataMiddleware = [upload.single('profilePic')];

/**
 * @swagger
 * /user/getuserdata:
 *   get:
 *     tags: [User]
 *     summary: Get user profile data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 profilePic:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getuserdata', getUserData);

/**
 * @swagger
 * /user/addpublic:
 *   post:
 *     tags: [User]
 *     summary: Add a new public entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - owner
 *               - description
 *               - port
 *               - containerId
 *             properties:
 *               title:
 *                 type: string
 *               owner:
 *                 type: string
 *               description:
 *                 type: string
 *               port:
 *                 type: integer
 *               containerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Public added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Server error
 */
router.post('/addpublic', addPublicController);

/**
 * @swagger
 * /user/getallpublic:
 *   get:
 *     tags: [User]
 *     summary: Get all public entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all public entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Failed to get all public
 */
router.get('/getallpublic', getAllPublicController);

/**
 * @swagger
 * /user/makepublic/{containerId}:
 *   patch:
 *     tags: [User]
 *     summary: Make a container public
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public made successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to make public
 */
router.put('/makepublic/:containerId', makePublicController);

/**
 * @swagger
 * /user/makeprivate/{containerId}:
 *   patch:
 *     tags: [User]
 *     summary: Make a public entry private
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public made successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to make private
 */
router.put('/makeprivate/:containerId', makePrivateController);

/**
 * @swagger
 * /user/deletepublic/{containerId}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a public entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete public
 */
router.delete('/deletepublic/:containerId', deletePublicController);

/**
 * @swagger
 * /user/getpublicstatus/{containerId}:
 *   get:
 *     tags: [User]
 *     summary: Get the publish status of a public entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to get public status
 */
router.get('/getpublicstatus/:containerId', getPublicStatusController);

/**
 * @swagger
 * /user/getpublicbycontainerid/{containerId}:
 *   get:
 *     tags: [User]
 *     summary: Get public entry by containerId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to get public by containerId
 */
router.get('/getpublicbycontainerid/:containerId', getPublicByContainerIdController)

/**
 * @swagger
 * /user/getpublicflag/{containerId}:
 *   get:
 *     tags: [User]
 *     summary: Get the public flag (visibility) status of a container
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public flag retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flag:
 *                   type: boolean
 *                   description: Indicates if the container is public (true) or private (false)
 *       404:
 *         description: Public flag not found
 *       500:
 *         description: Failed to get public flag
 */
router.get('/getpublicflag/:containerId', getPublicFlagController)

/**
 * @swagger
 * /user/addbugreport:
 *   post:
 *     tags: [User]
 *     summary: Submit a bug report
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bug report submitted successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/addbugreport', addBugReportController);

/**
 * @swagger
 * /user/addcontactus:
 *   post:
 *     tags: [User]
 *     summary: Submit a contact form
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/addcontactus', addContactUsController);

/**
 * @swagger
 * /user/updateadditionalinfo:
 *   put:
 *     tags: [User]
 *     summary: Update user additional information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - occupation
 *               - socialLinks
 *             properties:
 *               location:
 *                 type: string
 *               occupation:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   github:
 *                     type: string
 *                   twitter:
 *                     type: string
 *                   linkedin:
 *                     type: string
 *                   website:
 *                     type: string
 *     responses:
 *       200:
 *         description: Additional info updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 additionalInfo:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: string
 *                     occupation:
 *                       type: string
 *                     socialLinks:
 *                       type: object
 *                       properties:
 *                         github:
 *                           type: string
 *                         twitter:
 *                           type: string
 *                         linkedin:
 *                           type: string
 *                         website:
 *                           type: string
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put('/updateadditionalinfo', updateAdditionalInfo);

/**
 * @swagger
 * /user/topnotification:
 *   get:
 *     tags: [User]
 *     summary: Get top 5 notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/topnotification', getTop5NotificationsController);

/**
 * @swagger
 * /user/getprofiledata:
 *   get:
 *     tags: [User]
 *     summary: Get user profile data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 profilePic:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/getprofiledata', getProfileData);

/**
 * @swagger
 * /user/addmoredata:
 *   put:
 *     tags: [User]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */



router.put('/addmoredata',
    addMoreDataMiddleware[0], 
    async (req, res) => {
        try {
            const { username, bio } = req.body;
            const file = req.file;
            const email = req.userData.email;

            const result = await addMoreData({ email, username, bio, file });
            res.status(200).json({ message: 'Profile updated successfully', result });
        } catch (error) {
            console.error('Error in addmoredata route:', error);
            res.status(500).json({ 
                message: 'Internal server error', 
                error: error.message 
            });
        }
    }
);



// router.get('/getbilldetails', getBillDetails);

exports.userRouter = router;

exports.userRouter = router;