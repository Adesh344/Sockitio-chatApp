const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const Chatcontroller = require("../controllers/ChatController");

router.get('/privateChat/:name',Chatcontroller.getprivatechat);
router.get('/groupchat/:groupName',Chatcontroller.getgroupchat);
router.post('/createGroup',Chatcontroller.postcreateGroup);
module.exports = router;