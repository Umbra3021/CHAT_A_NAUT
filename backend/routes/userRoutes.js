const express = require('express');
const router = express.Router();
const {registerUser,getUser} = require('../controllers/userControllers');
const authUser = require('../controllers/userControllers');
const protect = require('../middleware/authMiddleware');


router.post('/login',authUser.authUser);
router.post('/',registerUser);
router.get('/users',protect,getUser);


module.exports = router;