import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'

import Sidewindow from '../miscellaneous/Sidewindow';
import Mychats from '../Mychats';
import ChatBox from '../chatBox'
const ChatPage = () => {
    const {user} = ChatState();
    const [fetchAgain,setfetchAgain] = useState(false);

  return (
    <div style={{width:'100%'}}> 
    {user && <Sidewindow />}
      <Box display={'flex'} justifyContent='space-between' width={'100%'} height='91.5vh' padding={'10px'}>
        {user &&<Mychats fetchAgain ={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
      </Box> 
    </div>
  )
}

export default ChatPage
