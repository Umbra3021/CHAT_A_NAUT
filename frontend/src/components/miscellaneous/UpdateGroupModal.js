import { ViewIcon } from '@chakra-ui/icons';
import { Spinner,FormControl,Input ,useDisclosure,Modal,Button, IconButton, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast, Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import {ChatState} from '../Context/ChatProvider';
import UserListIten from '../UserAvator/UserListIten'
import UserBadgeItem from '../UserAvator/UserBadgeItem'
import axios from 'axios';


const UpdateGroupModal = ({fetchAgain,setfetchAgain,fetchMessages}) => {

    const {isOpen,onOpen,onClose} = useDisclosure();
    const {user,selectedChats,setSelectedChats} = ChatState();
    const [search,setSearch] = useState("");
    const [groupChatName, setGroupChatName] = useState();
    const [searchResult,setSearchResult] = useState([]);
    const [Loading,setLoading] = useState(false);
    const [renameLoading,setRenameLoading] = useState(false);
    const toast = useToast();

    
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/users?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName){
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChats._id,
          chatName: groupChatName,
        },
        config
      );

      // setSelectedChat("");
      setSelectedChats(data);
      setfetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => { 
    if (selectedChats.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChats.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/addGroup`,
        {
          chatId: selectedChats._id,
          userId: user1._id,
        },
        config
      );
      
      console.log("hi");
      setSelectedChats(data);
      setfetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChats._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChats(data);
      setfetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  return (
    <>
      <IconButton display={{base:'flex'}} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'25px'} display={'flex'}justifyContent='center' >{selectedChats.chatName}</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Box width={'100%'} display={'flex'} flexWrap={'wrap'} paddingBottom={3} >
                {selectedChats.users.map(u=>(
                    <UserBadgeItem key={user._id} user={u} />
                ))}
            </Box>
              
              <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                marginBottom={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                marginLeft={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                marginBottom={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            
            {Loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((index,user) => (
                <UserListIten
                  key={index}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupModal