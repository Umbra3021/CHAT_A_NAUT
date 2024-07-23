import React from 'react'
import {ChatState} from '../components/Context/ChatProvider';
import {Box} from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain,setfetchAgain}) => {

  const {selectedChats} = ChatState();


  return (
   <Box display={{base:selectedChats?"flex":"none",md:"flex"}} 
      alignItems='center' flexDir={'column'} p={3} bg='#7469B6'  width={{base:"100%" ,md:"68%"}}
      borderRadius='lg' borderWidth={'1px'}
   >
    <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
      
   </Box>
  )
}

export default ChatBox
