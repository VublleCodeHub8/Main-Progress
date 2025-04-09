const express = require('express');
const router = express.Router();
const { getUserData, addMoreData } = require('../controllers/user');
const multer = require("multer");
const { isUser } = require('../middlewares/auth');
const { addBugReportController, addContactUsController, getTop5NotificationsController, getProfileData, updateAdditionalInfo } = require('../controllers/user');

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