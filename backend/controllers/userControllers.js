const expressAsyncHandler = require("express-async-handler");
const User = require("../schema/userModel");
const generateToken = require("../config/generateToken");



const registerUser = expressAsyncHandler(async (req,res) =>{
    const {Name,email,Password,Pic} =req.body;

    if(!Name || !email || !Password){
        res.status(400);
        throw new Error("Please Enter details");    
    }

    const exists = await User.findOne({email});
    
    if(exists){
        res.status(400);
        throw new Error("Email exists");
    }

    const name =Name;
    const password = Password;
    const picture = Pic;
       

    const user = await User.create({
        name,
        email,
        password,
        picture
    });

   

    if(user){
        res.status(201).json({
            _id:user._id,
            Name:user.name,
            email:user.email,
            picture:user.picture,
            token:generateToken(user._id),
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to create User");
    }
});




const authUser = expressAsyncHandler(async(req,res) =>{
    const {Email,Password} = req.body;

    const email = Email;
    const password = Password;

    const user = await User.findOne({email});

   

    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id:user._id,
            Name:user.name,
            email:user.email,
            picture:user.picture,
            token:generateToken(user._id),
        })
    }
    else{
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
});



const getUser = expressAsyncHandler(async (req,res) =>{
    const keyword = req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:'i'}},
            {email:{$regex:req.query.search,$options:'i'}},
        ]
    }
    : {};

    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
     

    
});

module.exports = {registerUser,authUser,getUser};