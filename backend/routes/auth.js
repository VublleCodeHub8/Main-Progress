const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut, logIn, changePass } = require('../controllers/auth');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [B2C, Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: User's full name
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input or email already exists
 *       500:
 *         description: Server error
 */
router.post('/signup', signUp)

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags: [B2C, Authentication]
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successfully signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/signin', signIn)

/**
 * @swagger
 * /auth/signout:
 *   get:
 *     tags: [B2C, Authentication]
 *     summary: Sign out the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully signed out
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/signout', signOut)

/**
 * @swagger
 * /auth/login:
 *   get:
 *     tags: [B2C, Authentication]
 *     summary: Check if user is logged in
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/login', logIn)

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags: [B2C, Authentication]
 *     summary: Change user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPass
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               newPass:
 *                 type: string
 *                 format: password
 *                 description: User's new password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Failed to update password
 *       500:
 *         description: Server error
 */
router.post('/changepass', changePass);

exports.authRouter = router;