import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box paddingX={2} paddingY={1} borderRadius={'lg'} margin={1} marginBottom={2} variant ={'solid'}
        fontSize={12} bgColor='pink' cursor={'pointer'} onClick={handleFunction} 
    >

        {user.name}

        <CloseIcon padding={1} />

    </Box>
  )
}

export default UserBadgeItem;