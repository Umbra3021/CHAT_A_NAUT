const expressAsyncHandler = require("express-async-handler");
const Message = require("../schema/messageModel");
const User = require("../schema/userModel");
const Chat = require("../schema/chatModel");




const sendMessage = expressAsyncHandler(async(req,res) =>{
    
    const {content,chatId} = req.body;

   

    if(!content || !chatId){
        console.log("Invalid data");
        res.status(400);
    }

    var Newmessage ={
        sender:req.user._id,
        content:content,
        chat:chatId
    };

   

    
    try{
        var message = await Message.create(Newmessage);

        message = await message.populate("sender","name picture");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:'chat.users',
            select:'name picture email',
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message,
        });

        res.json(message);

    }
    catch(err){
        console.log('in messageControllers');
        res.status(400); 
        throw new Error(err.message);
    }
});


const allMessages = expressAsyncHandler(async(req,res) =>{
    try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name picture email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

});



module.exports={sendMessage,allMessages};