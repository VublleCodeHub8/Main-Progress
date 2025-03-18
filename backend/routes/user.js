const express = require('express');
const router = express.Router();
const { getUserData, addMoreData } = require('../controllers/user');
const multer = require("multer");
const { isUser } = require('../middlewares/auth');
const { addBugReportController, addContactUsController } = require('../controllers/user');

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


router.get('/getuserdata', getUserData);
router.post('/addbugreport', addBugReportController);
router.post('/addcontactus', addContactUsController);

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