const express = require('express');
const router = express.Router();

const { allUsers } = require('../models/user');
const { allContainers } = require('../models/containers');
const { allAuth } = require('../models/auth');



router.get('/getAllUsers',async (req,res) => {
    const data=await allUsers();
    console.log(data);
    if(!data){
        res.status(500);
        res.send();
    }
    res.json(data);
})

router.get('/getAllContainers',async (req,res) => {
    const data=await allContainers();
    console.log(data);
    if(!data){
        res.status(500);
        res.send();
    }
    res.json(data);
})

router.get('/getAllAuth',async (req,res) => {
    const data=await allAuth();
    console.log(data);
    res.json(data);
})




exports.adminRouter = router