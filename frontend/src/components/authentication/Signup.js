import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack ,useToast} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Signup = () => {

    const [Show1,setShow1] = useState(false);
    const [Show2,setShow2] = useState(false);
    const [Name,setName] =useState();
    const [email,setEmail] =useState();
    const [Password,setPassword] =useState();
    const [ConfirmPassword,setConfirmPassword] =useState();
    const [Pic,setPic] =useState();
    const [loading,isLoading] = useState(false);
    const toast = useToast()


    const event1= () =>{
        setShow1(!Show1);
    }
    const event2= () =>{
        setShow2(!Show2);
    }

    const Details = (pics) =>{
        isLoading(true);

        if(pics===undefined){
            toast({
              title: 'Please Select an Image',
              description: "No Image provided",
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
        }


        if(pics.type === 'image/jpeg' || pics.type ==='image/png'){
            const data =  new FormData();
            data.append("file",pics);
            data.append("upload_preset","chatApp");
            data.append("cloud_name","dqum3vq5z");
            fetch("https://api.cloudinary.com/v1_1/dqum3vq5z/image/upload",{
              method:"post",
              body:data,
            }).then((res) => res.json())
            .then(data =>{
              setPic(data.url.toString());
              console.log(data.url.toString());
              isLoading(false);
            })
            .catch((Err) =>{
              console.log(Err);
              isLoading(false);
            })
      }
      else{
          toast({
              title: 'Please Select an Image',
              description: "Wrong Format",
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            isLoading(false);
            return;
      }
    }

     const submit = async (e) =>{
        e.preventDefault()
      
        isLoading(true);

        if(!Name || !email || !Password || !ConfirmPassword){
            toast({
              title: 'Please Provide Details',
              description: "No Details Provided",
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            isLoading(false);
            return;
        }

        if(Password !== ConfirmPassword){
            toast({
              title: 'Please Same Password',
              description: "Password do not match",
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            isLoading(false);
            return;
        }



        try{
          const config ={
            headers:{
              "Content-type": "application/json"
            },
          };

          const {data} = await axios.post('/api/user',{Name,email,Password,Pic});
           toast({
              title: 'Signup SucessFull',
              description: "Signed up",
              status: 'success',
              duration: 5000,
              isClosable: true,
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            isLoading(false);

            

           
        }catch(err){
           toast({
              title: 'Error',
              description: "Details not Saved",
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
        
           isLoading(false)
        }
    }


  return (
    <VStack spacing={'5px'}>
      <FormControl id="first-name" isRequired >
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter your Name'  onChange={(e) =>setName(e.target.value)}/>
      </FormControl>

      <FormControl id="email" isRequired >
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your Email'  onChange={(e) =>setEmail(e.target.value)}/>
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

       <FormControl id="confirm-password" isRequired >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input type={Show2? "text" :"password"} placeholder='Confirm your Password'  onChange={(e) =>setConfirmPassword(e.target.value)}/>
            <InputRightElement width={'4.5rem'}>
                <Button h={'1.75rem'} size="sm" onClick={event2} >
                    {Show2 ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>
      
      <FormControl id="pic" >
        <FormLabel>Upload your Picture</FormLabel>
        <InputGroup>
            <Input type={'file'} p='1.5' accept='image/' onChange={(e) =>Details(e.target.files[0])}/>
        </InputGroup>
      </FormControl>


      <Button colorScheme={"blue"} width="100%" style={{marginTop:15}} onClick={submit} isLoading={loading} > 
            Sign Up
      </Button>
      
    </VStack>
  )
}

export default Signup;
