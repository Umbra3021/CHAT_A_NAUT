import { Box,Spinner, IconButton, Text, FormControl, Input, useToast } from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import {ChatState} from '../components/Context/ChatProvider';
import {getSender,getSenderDetails} from '../components/Config/ChatLogics'
import ProfileModal from '../components/miscellaneous/ProfileModal'
import UpdateGroupModal from '../components/miscellaneous/UpdateGroupModal'
import axios from 'axios';
import ScrollAbleChat from './ScrollAbleChat';
import '../components/style.css';
import {io} from 'socket.io-client';
const ENDPOINT = "http://localhost:5000";
var socket,selectChatCompare;

const SingleChat = ({fetchAgain,setfetchAgain}) => {

    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setnewMessage] = useState("");
    const [socketConnected,setsocketConnected] = useState(false);

    const toast = useToast();

    const {user,selectedChats,setSelectedChats,notification,setNotification} = ChatState();

    const fetchMessages = async () =>{
      if(!selectedChats) return;

      try {

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        setLoading(true);

        const {data} = await axios.get(`/api/message/${selectedChats._id}`,config);
  
        setMessages(data);
        setLoading(false);
        socket.emit('join chat',selectedChats._id);
        
      } catch (error) {
        toast({
              title: "Error Occured!",
              description: "Failed to fetch messages",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
        });
      }
    }

    useEffect(() =>{
      socket = io(ENDPOINT);
      socket.emit("setup",user);
      socket.on('connection',() => 
        setsocketConnected(true)
      )
    },[]);

    useEffect(() => {
      fetchMessages();
       selectChatCompare = selectedChats // to store the previous selected chat , if new chat then fetch else no need to fetch
  }, [selectedChats]); // messages are fetched when this changes


  // console.log(notification,'---------------------');

    useEffect(() => {
      socket.on('message recieved',(MessageRecieved) => {
        if(!selectChatCompare || selectChatCompare._id !== MessageRecieved.chat._id){
            if(!notification.includes(MessageRecieved)){
              setNotification([MessageRecieved,...notification]);
              setfetchAgain(!fetchAgain);
            }
        }
        else{
          setMessages([...messages,MessageRecieved]);
        } 
      }) 
    })

    const sendMessage = async (event) =>{
      if(event.key === "Enter" && newMessage ){
        try {

          const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
          
          const {data} = await axios.post('/api/message/',{
            content:newMessage,
            chatId:selectedChats._id,
          },config);
       
          setnewMessage("");
          socket.emit('new message',data);  
          setMessages([...messages,data]);
          
        } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to send message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });

        }
      } 
        
    }

   

    const typing = (e) =>{
      setnewMessage(e.target.value);
    }



    
    

  return (
    <>
      {selectedChats ? ( 
      <>
        <Text fontSize={{base:"28px",md:"30px"}} 
            paddingBottom={3}
            paddingX={2}
            width='100%'
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={{base:"space-between"}}
            alignItems="center"
            fontWeight={'bold'}
        >
            <IconButton display={{base:"flex",md:"none"}} icon={<ArrowBackIcon />} onClick={() => setSelectedChats("")} />
            {messages && !selectedChats.isGroupChat?(
                <>
                    {getSender(user ,selectedChats.users)}
                    <ProfileModal user={getSenderDetails(user,selectedChats.users)} />
                </>
            ):(
                <>
                    {selectedChats.chatName.toUpperCase()}
                    <UpdateGroupModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchMessages={fetchMessages} />
                    
                </>
            )}
        </Text>

        <Box display={'flex'} flexDir='column' justifyContent={'flex-end'} p={3} bg='white' width={'100%'} height={'100%'} borderRadius='lg' overflowY={'hidden'} >
            
            {loading ? (
              <Spinner size={'xl'} width='20' height={'20'} alignSelf='center' margin={'auto'} />
            )
              :(
                <div className='messages'>
                  <ScrollAbleChat messages={messages} />
                </div>
              )
            }

            <FormControl onKeyDown={sendMessage} isRequired marginTop={3} >
              <Input variant={'filled'} bg='#FFCDEA' placeholder='Type here' value={newMessage} onChange={typing} focus />
            </FormControl>
        </Box>
      </>
      ):(
        <Box display={'flex'} alignItems='center' justifyContent={'center'} height='100%'> 
            <Text fontSize={'3xl'} paddingBottom={3} fontFamily='Work sans' >
                Click on a chat to get started
            </Text>
        </Box>
      )
      }
    </>
  )
}

export default SingleChat
