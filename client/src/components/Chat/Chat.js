import React,{useState,useEffect} from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom';
import {io} from 'socket.io-client'
import InfoBar from '../InfoBar/InfoBar';
import './chat.css'
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

const socket=io.connect('https://serverchatv1.herokuapp.com')


const Chat=() =>{
  const {search}=useLocation()

  const [name,setName]=useState('');
  const [room,setRoom]=useState('');
  const [users, setUsers] = useState('');
  const [message,setMessage]=useState('');
  const [messages,setMessages]=useState([]);

  useEffect(()=>{
    const {name , room }=queryString.parse(search);
    setName(name);
    setRoom(room);


    socket.emit('join',{name,room},(error)=>{
      console.log(error)
    })

    return ()=>{
      socket.emit('disconnet');
      socket.off();
    }

  },[search]);

  useEffect(()=>{
    socket.on('message',(message)=>{
      setMessages([...messages,message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

  },[messages])

  //send message funtion
  const sendMessage=(e)=>{
    e.preventDefault();
    if(message){
      socket.emit('sendMessage',message,()=>setMessage(''));
    }

    // console.log(message,messages);
  }

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />

        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
         
        {/* <input value={message} onChange={(e)=>setMessage(e.target.value)} onKeyPress={e => e.key==='Enter' ? sendMessage(e):null}/> */}
      </div>
    </div>
  )
}
export default Chat;
