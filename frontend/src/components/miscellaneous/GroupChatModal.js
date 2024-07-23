import React, { useState } from 'react'
import {
    Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input

} from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import UserListIten from '../UserAvator/UserListIten';
import UserBadgeItem from '../UserAvator/UserBadgeItem';

const GroupChatModal = ({children}) => {
  
const { isOpen, onOpen, onClose } = useDisclosure();
const [groupName,setGroupName] = useState();
const [selectedUser,setSelectUsers] = useState([]);
const [search,setSearch] = useState("");
const [searchResult,setSearchResult] = useState([]);
const [loading,setLoading] = useState(false);

const toast = useToast();

const {user,chats,setChats} = ChatState();

const handleSearch = async (addUser) =>{
    setSearch(addUser);

    if(!addUser){
        return;
    }
    
    try {
        setLoading(true);

        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        }

        const {data} = await axios.get(`/api/user/users?search=${search}`,config);
        
        setLoading(false);
        setSearchResult(data);
        
    } catch (error) {
        toast({
        title: 'Failed to fetch results',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
        console.log(error)
    }
}


const handleSubmit = async() =>{
  if(!groupName || !selectedUser){
     toast({
        title: 'Please fill in the details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
  }

  try { 
    
    const config = {
      headers:{
        Authorization:`Bearer ${user.token}`
      },
    };

    const {data} = await axios.post('/api/chat/group',{
      name:groupName,
      users:JSON.stringify(selectedUser.map((u) => u._id))
    },config);

    setChats([data,...chats]);
    onClose();
     toast({
        title: 'New Group chat created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    
  } catch (error) {
     toast({
        title: 'Failed to create',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.log(error);
  }
}

const handleDelete = (userDelete) =>{
  setSelectUsers(selectedUser.filter((sel) => sel._id !== userDelete._id))
}

const handleGroup = (usertoAdd) =>{
    if(selectedUser.includes(usertoAdd)){
         toast({
        title: 'User already added',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    else{
        setSelectUsers([...selectedUser,usertoAdd]);
    }
}

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} justifyContent={'center'}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
            <ModalBody display={'flex'} flexDir={'column'} alignItems='center'>
                <FormControl>
                    <Input placeholder='Group Name' marginBottom={'3'}  onChange={(e) => setGroupName(e.target.value)} />
                    <Input placeholder='Add Users' marginBottom={'1'}  onChange={(e) => handleSearch(e.target.value)} />
                </FormControl>

                <Box width={'100%'} display={'flex'} flexWrap={'wrap'} >
                    {selectedUser.map(user =>(
                        <UserBadgeItem key={user._id} user={user} handleFunction={() =>handleDelete(user)} />
                    ))}
                </Box>

                {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListIten
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}

            </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
