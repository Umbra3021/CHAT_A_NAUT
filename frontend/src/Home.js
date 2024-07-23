import './App.css';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import { Box,Container,Text,Tab,Tabs,TabList,TabPanel,TabPanels } from '@chakra-ui/react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Home() {

   const nav = useNavigate();

  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if(user){
      nav('/chats');
    }
  },[nav])




  return (
    <Container maxW={'full'} centerContent className="App" >
      <Box d="flex" justifyContent="center" p={3}  w="100%" m="40px 0 15px 0" >
        <Text fontSize="5xl" textAlign={"center"}  bg="linear-gradient(66deg, rgba(134,70,156,1) 15%, rgba(255,205,234,1) 74%)"  bgClip="text" fontWeight={'bold'}>
          Chat-A-Naut
        </Text>
      </Box>

      <Box maxW={'md'} bg={"white"} w="100%" p={4} borderRadius="lg"  borderWidth={"1px"}>
        <Tabs isManual variant="soft-rounded"  >
          <TabList mb="1em">
            <Tab  width="50%" >Login</Tab>
            <Tab  width="50%" >Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
             <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
