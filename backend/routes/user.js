const express = require('express');
const router = express.Router();
const { getUserData, addMoreData } = require('../controllers/user');


router.get('/getuserdata', getUserData);

router.put('/addmoredata', addMoreData);



exports.userRouter = router;