import { Box, Button, Tooltip ,Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner} from '@chakra-ui/react';
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import {BellIcon} from '@chakra-ui/icons'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react'; 
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListIten from '../UserAvator/UserListIten';
import { getSender } from '../Config/ChatLogics';
import NotificationBadge from "@parthamk/notification-badge";
import { Effect } from "@parthamk/notification-badge";


const Sidewindow = () => {
  const nav = useNavigate();
  const [search,setSearch] = useState("");
  const [Result,setResult] = useState([]);
  const [loading,setLoading] = useState(false);
  const [chatLoading,setchatLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast();

  const {user,setSelectedChats,chats,setChats,notification,setNotification} = ChatState();

  const breakpoints = {
  base: '0em', // 0px
  sm: '30em', // ~480px. em is a relative unit and is dependant on the font size.
  md: '48em', // ~768px
  lg: '62em', // ~992px
  xl: '80em', // ~1280px
  '2xl': '96em', // ~1536px
}

  const logout = () =>{
    localStorage.removeItem('userInfo');
    nav('/');
  }

  const handleSearch = async () =>{
    if(!search){
      toast({
        title: 'Empty Field',

        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'top-left'
      })
    }

    try{
      setLoading(true);

      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
          
        },
      };

      const {data} = await axios.get(`/api/user/users?search=${search}`,config);
      setLoading(false);
      setResult(data);
    }
    catch(err){
      toast({
        title: 'Failed to fetch results',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.log(err);
    }

  }

  const accessChat = async (userID) =>{
  
    try{
      setchatLoading(true);

      const config = {
        headers:{
         "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post('/api/chat/access',{userID},config);

      console.log(chats);

      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);


      setSelectedChats(data);
      setchatLoading(false);
      onClose();
    }
    catch(err){
       toast({
        title: 'Failed to fetch chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.log(err);
    }
  };

  return (
    <div>
     <Box display={'flex'} justifyContent='space-between' alignItems={'center'} bg= '#AD88C6' width={'100%'} p='5px 10px 5px 10px' borderWidth={'5px'} > 
      <Tooltip label="Search users" hasArrow placement='bottom-end' >
          <Button variant={'ghost'} onClick={onOpen} bg={'#FFE6E6'}>
            <SearchIcon />
            <Text display={{base:'none' ,md:'flex'}} px='4px'>Search user</Text>
          </Button>
      </Tooltip>
      <Text fontSize={'3xl'} bg=" linear-gradient(66deg, rgba(116,105,182,1) 27%, rgba(134,70,156,1) 86%)" bgClip="text" fontWeight={'bold'} >Chat-A-Naut</Text>
      <div>
        <Menu>
          <MenuButton p={'1'} paddingRight='3rem'>
            <NotificationBadge count={notification.length} effect = {Effect.SCALE} />
              <BellIcon fontSize='2xl' />
           
            </MenuButton>
          <MenuList paddingLeft={2} >
            {!notification.length && "No New Messages"}
            {notification.map(item => (
              <MenuItem key={item._id} onClick={() => {
                setSelectedChats(item.chat);
                setNotification(notification.filter((n) => n!==item ));
              }}>
                {item.chat.isGroupChat?`New Message from ${item.chat.chatName}`:`New Message from ${getSender(user,item.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
           <MenuButton as={Button} rightIcon ={<ExpandMoreIcon />}>
            <Avatar size={'sm'} cursor='pointer' name={user.Name} src={user.picture}/>
           </MenuButton>
           <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logout}>Logout</MenuItem>
           </MenuList>
        </Menu>
      </div>
     </Box>





     <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1'}>Search Users</DrawerHeader>

          <DrawerBody>
          <Box display={'flex'} paddingBottom='2px'>
            <Input placeholder='Search by name or Email' marginRight={'2'} value={search} onChange={(e) => setSearch(e.target.value)}/>
            <Button onClick={handleSearch} >Go</Button>

          </Box>

          {loading ?(
            <ChatLoading/>
          ):(
            Result?.map((user) =>(
              <UserListIten key={user._id} user={user} handleFunction={() =>{
                accessChat(user._id)
              }}/>
            ))
          
          )}

          {chatLoading && <Spinner marginLeft={'auto'} display='flex'/>}
        </DrawerBody>
        </DrawerContent>

        
       
     </Drawer>
    </div>
  )
}

export default Sidewindow
