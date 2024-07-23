import { IconButton, useDisclosure,Modal,ModalOverlay,ModalHeader,ModalCloseButton,ModalBody,Button,ModalFooter,ModalContent, Image, Text } from '@chakra-ui/react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import React from 'react'

const ProfileModal = ({user,children}) => {

    const {isOpen,onOpen,onClose} = useDisclosure();

  return <>
    {children?(
        <span onClick={onOpen}>{children}</span>
    ):(
            <IconButton display={'flex'} icon={<VisibilityIcon />} onClick={onOpen}/>
        )}

        <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={'410px'}>
          <ModalHeader fontSize={'30px'} display='flex' justifyContent={'center'}>{user.Name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir='column' alignItems={'center'} justifyContent='space-between' >
           <Image borderRadius={'full'} boxSize='150px' src={user.picture} alt={user.name}/>
           <Text fontSize={'25px'} marginTop='1.5rem'>Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
} 

export default ProfileModal
