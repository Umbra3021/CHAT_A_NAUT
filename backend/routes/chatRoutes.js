const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

const {accessChat} = require('../controllers/chatControllers');
const {fetchChats , group,updateGroupName ,addGroup,removeGroup} = require('../controllers/chatControllers'); 

router.post('/access',protect,accessChat);
router.get('/fetch',protect,fetchChats);
router.post('/group',protect,group);
router.put('/rename',protect,updateGroupName);
router.put('/removeGroup',protect,removeGroup);
router.put('/addGroup',protect,addGroup);

 module.exports = router;