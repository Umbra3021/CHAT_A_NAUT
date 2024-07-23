const expressAsyncHandler = require("express-async-handler");
const Chat = require('../schema/chatModel');
const User = require("../schema/userModel");

const accessChat = expressAsyncHandler(async (req,res) =>{
    const {userID} = req.body;

    //if there is no userId to fetch chats from, userId is of the other user
    if(!userID){
        console.log("userId not sent");
        return res.sendStatus(400);
    }

    //if chat exists
    
    var isChat = await Chat.find({
        isGroupChat : false, // not a group chat
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userID}}},

        ]

    }).populate('users','-password').populate("latestMessage"); 

   

    isChat =  await User.populate(isChat,{
        path:'latestMessage.sender',
        select:"name pic email",
    });


    if(isChat.length > 0){
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName : "sender",
            isGroupChat:false,
            users:[req.user._id,userID],
        };

        try{
            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password");
            res.status(200).send(fullChat);
        }
        catch(err){
            console.log(err);
        }
    }
   
});

const fetchChats  = expressAsyncHandler(async (req,res) =>{
    console.log('here');
    try{
        
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
            .sort({updatedAt:-1})
            .then(async (results) =>{
                results = await User.populate(results,{
                    path:'latestMessage.sender',
                    select:"name pic email",
                });
              
                res.status(200).send(results);
            })
    }
    catch(err){
        console.log(err);
    }
});

const group = expressAsyncHandler(async (req,res) =>{
    
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please fill the fields"});
    }

    var Users = JSON.parse(req.body.users); //array of users to include in group

    if(Users.length < 2){
        return res.status(400).send({message:"A group requires more than 2 members"});
    }

    Users.push(req.user); // including my account 

    try{
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:Users,
            isGroupChat:true,
            groupAdmin:req.user,
        });

        const fullgroupChat = await Chat.findOne({_id:groupChat._id}).populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullgroupChat);
    }
    catch(err){
        console.log(err);
    }
});

const updateGroupName = expressAsyncHandler(async (req,res) =>{
    const {chatId,chatName} = req.body;

    const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName,
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updateChat){
        res.status(404);
        throw new Error("Chat not Found");
    }
    else{
        res.json(updateChat);
    }
});


const addGroup = expressAsyncHandler(async (req,res) =>{
    const {chatId,userId} = await req.body;

    const added = Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId},
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");



    if(!added){
        res.status(404).send({message:"No chat found"});
    }
    else{
        res.json(added);
    }

});

const removeGroup = expressAsyncHandler(async(req,res) =>{
    const { chatId ,userId} = req.body;
    const remove = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId},
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!remove){
        res.status(404).send({message:"No chat found"});
    }
    else{
        res.json(remove);
    }
    
});

module.exports = {accessChat,fetchChats,group,updateGroupName,addGroup,removeGroup};