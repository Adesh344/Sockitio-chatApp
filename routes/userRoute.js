const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {isLogin , isLogout} = require("../middlewares/auth");
//const User = require("../models/user");

router.get('/login',isLogout,UserController.getLogin);
router.get('/signup',isLogout, UserController.getSignup);
router.post('/signup',UserController.postSignup);
router.post('/login',UserController.postLogin);
router.get('/logout',isLogin,UserController.Logout);
router.get('/dashboard',isLogin,UserController.getdashboard);


module.exports = router;
