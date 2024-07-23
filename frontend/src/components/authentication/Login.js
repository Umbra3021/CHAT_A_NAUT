import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const nav = useNavigate();
    const [Show1,setShow1] = useState(false);

    const [Email,setEmail] = useState();
    const [Password,setPassword] = useState();
    const [Loading,setLoading] = useState(false);
        const toast = useToast();

    const event1= () =>{
        setShow1(!Show1);
    }

    const submit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        
        if(!Password || !Email){
           toast({
              title: 'Enter Details',
              description: "Empty Fields",
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          setLoading(false);
          return;
        }
        try {

          const {data} = await axios.post('/api/user/login',{Email,Password});
          console.log(data);
          
           toast({
              title: 'Login SucessFull',
              description: "Logged in",
              status: 'success',
              duration: 5000,
              isClosable: true,
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            nav('/chats');
          
          
        } catch (error) {
          toast({
              title: 'Error',
              description: "Refresh and try again",
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            setLoading(false);
          console.log(error);
        }
        
    }

  return (
    <VStack spacing={"5px"}>
      <FormControl id="Email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>


       <FormControl id="password" isRequired >
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input type={Show1? "text" :"password"} placeholder='Enter your Password'  onChange={(e) =>setPassword(e.target.value)}/>
            <InputRightElement width={'4.5rem'}>
                <Button h={'1.75rem'} size="sm" onClick={event1} >
                    {Show1 ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>


      
      <Button colorScheme={"blue"} width="100%" style={{marginTop:15}} onClick={submit}> 
            Login Up
      </Button>
    </VStack>
  );
};

export default Login;
