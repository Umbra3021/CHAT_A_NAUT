const jwt = require('jsonwebtoken');
const User = require('../schema/userModel.js');
const expressAsyncHandler = require('express-async-handler');

const protect = expressAsyncHandler(async (req,res,next) =>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token,process.env.SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            next();

        } catch (error) {
            console.log(error);
            res.status(411);
            throw new Error("Not authorized sorry");
            
        }
    }

    if(!token){
        console.log(error);
        res.status(412);
        throw new Error("Not authorized sorry");
    }
});

module.exports = protect;