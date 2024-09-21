const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut, logIn } = require('../controllers/auth');

router.post('/signup', signUp)

router.post('/signin', signIn)

router.get('/signout', signOut)

router.get('/login', logIn)




exports.authRouter = router