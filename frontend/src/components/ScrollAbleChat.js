import { Avatar, Tooltip } from '@chakra-ui/react'
import { borderRadius, maxWidth } from '@mui/system'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, IsSameSender, IsSameSenderAlign, isSameUser } from './Config/ChatLogics'
import { ChatState } from './Context/ChatProvider'

const ScrollAbleChat = ({messages}) => {

   const {user} = ChatState();
    return(
    <ScrollableFeed>
        {messages && messages.map((m,i) =>(
        <div style = {{display:'flex'}}
        key={m._id}>

            {
                (IsSameSender(messages,m,i,user._id) || isLastMessage(messages,i,user._id)) 
                && (
                    <Tooltip label={m.sender.name} placement="bottom-start" hasArrow >
                        <Avatar marginTop={7} marginRight={1} size='sm' cursor={'pointer'} name={m.sender.name} src={m.sender.picture} />
                    </Tooltip>
                )}
                <span style={{ backgroundColor:`${m.sender._id === user._id ? "#BEE3F8":"#B9f5d0"}`,
                    borderRadius:"20px", padding:"5px 15px" ,maxWidth:"75%", marginLeft:IsSameSenderAlign(messages,m,i,user._id),
                    marginTop:isSameUser(messages,m,i,user._id) ? 3:10
                }}>
                    {m.content}
                </span>

        </div>

        ))}
    </ScrollableFeed>
    )


}
export default ScrollAbleChat
