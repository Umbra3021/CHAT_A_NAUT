import {createContext, useContext,useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContent = createContext();


const ChatProvider = ({children}) =>{

  const [user,userState] = useState();
  const [selectedChats,setSelectedChats] =useState();
  const [chats,setChats] = useState();
  const [notification,setNotification] = useState([]);

  const nav = useNavigate();

  useEffect(() =>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    userState(userInfo);

    if(!userInfo){
        nav('/');
    }
  },[nav]);

  return (<ChatContent.Provider value={{user,userState,selectedChats,setSelectedChats,chats,setChats,notification,setNotification}}>{children}</ChatContent.Provider> )
};

export const ChatState = () =>{

  return useContext(ChatContent)
} 



export default ChatProvider;
 