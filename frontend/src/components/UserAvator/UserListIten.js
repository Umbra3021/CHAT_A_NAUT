import { Avatar, Box ,Text} from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../Context/ChatProvider'

const UserListIten = ({user,handleFunction}) => {
    
   
    return (
        <Box onClick={handleFunction} cursor={'pointer'} bg='#E8E8E8' _hover={{background:'#38B2AC',color:'white'}} width='100%' display={'flex'} 
        alignItems='center' color={'black'} paddingY={2} marginTop={2} marginBottom={2} paddingX={3} borderRadius='lg'>

            <Avatar mr={2} size='sm' cursor={'pointer'} name={user.name} src={user.picture}/>

            <Box>
                <Text>{user.name}</Text>
                <Text fontSize ='xs' >
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
  )
}

export default UserListIten
