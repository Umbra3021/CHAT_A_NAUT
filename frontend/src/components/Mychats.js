import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider'
import axios from 'axios';
import {AddIcon} from '@chakra-ui/icons'
import ChatLoading from "./ChatLoading.js"
import GroupChatModal from './miscellaneous/GroupChatModal';
import { getSender } from "../components/Config/ChatLogics"


const Mychats = ({fetchAgain}) => {

  const [loggedUser,setloggedUser] = useState();
  const{selectedChats,setSelectedChats,chats,setChats,user} = ChatState();

  const breakpoints = {
    base: '0em', // 0px
    sm: '30em', // ~480px. em is a relative unit and is dependant on the font size.
    md: '48em', // ~768px
    lg: '62em', // ~992px
    xl: '80em', // ~1280px
    '2xl': '96em', // ~1536px
  }
  const toast = useToast();

  

  const fetchChats = async() =>{

    try{

      const config = {
        headers:{
          Authorization: `Bearer ${user.token}`,
        }
      };

      const {data} = await axios.get("/api/chat/fetch",config);
      setChats(data);
     
    }
    catch(err){
       toast({
        title: 'Failed to fetch chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

    }
  };

  useEffect(() =>{
    setloggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  },[fetchAgain])


  return (
   <Box
      display={{ base: selectedChats ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      padding={3}
      bg="#7469B6"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
     
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          color={'#31363F'}
          fontWeight={'bold'}
        >
          Mychats
          <GroupChatModal>
            <Button display={'flex'} fontSize={{base:'17px',md:'10px',lg:'17px'}} rightIcon={ <AddIcon /> }>
              Group Chat
            </Button>
          </GroupChatModal>
        </Box>
  
      <Box display={"flex"} flexDir='column' padding={'3'} bg='#F8F8F8' width={'100%'} height={'100%'}
        borderRadius='lg' overflowY={'hidden'}
      >
        {chats ? (
          <Stack overflowY={'scroll'} >
            {chats.map((chat) =>(
              <Box onClick={() =>setSelectedChats(chat)}
                cursor='pointer'
                bg={selectedChats === chat ? '#38B2AC':'#e8e8e8'}
                color={selectedChats === chat? 'white' :'black'}
                paddingX = '3'
                paddingY='2'
                borderRadius={'lg'}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat?(getSender(loggedUser,chat.users)):chat.chatName}
                </Text>

                
              </Box>
            ))}
            
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default Mychats
