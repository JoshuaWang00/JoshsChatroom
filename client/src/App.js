
import './App.css';
import {useState, useEffect} from "react";
import Axios from "axios";
import io from 'socket.io-client';
import logoImg from './Octicons-mark-github.svg.png';
const socket = io.connect("http://localhost:3001");
function App() {
  const [listOfMessages, setListOfMessages] = useState([]);
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [nameReceived, setNameReceived] = useState("");
  const [listOfWSMessages, setListOfWSMessages] = useState([]);

  socket.on('connect', function() {
    setUid(socket.id); 
  });
 



  useEffect(()=>{
Axios.get("http://localhost:3001/getMessages").then((response)=>{
  setListOfMessages(response.data);
  console.log("new get called");
});
  },[]);

  

  useEffect(()=>{
   socket.on("receive_message", (data) => {
    setMessageReceived(data.message);
    setNameReceived(data.name);
setListOfWSMessages(listOfWSMessages=>[...listOfWSMessages, data]);
console.log("hi");


   });
      },[socket]);

      useEffect(()=>{
        if (document.getElementById("chatView").scrollTop + 1000 >= document.getElementById("chatView").scrollHeight){scrollDown();}
      
    },[listOfWSMessages]);

    //automatically scroll down once on load
    useEffect(()=>{
      scrollDown();
    },[listOfMessages]);

      

const createMessage = () => {
//first socket part interacts with websocket
if (name.trim().length == 0 || message.trim().length == 0){
  document.getElementById("alertMSG").innerHTML = "All inputs must be filled!"
}
else{
  document.getElementById("alertMSG").innerHTML = ""
socket.emit("send_message", {name:name,message:message});
//then we send to backend
Axios.post("http://localhost:3001/createMessage",{uid, name, message,}).then((response)=>{ })
}
}


const scrollDown = () =>{
  var objDiv = document.getElementById("chatView");
objDiv.scrollTop = objDiv.scrollHeight;
}
  return (
    <div className="App bg-dark text-white">


<nav class="navbar navbar-expand justify-content-center bg-success">
  <div class="d-flex">
<h2 class="p-2">Josh's Chatroom</h2>
<div class="p-2">
<a href="https://github.com/JoshuaWang00/JoshsChatroom"><img src={logoImg} alt="Github" style={{width:42,height:42}}/></a>
  
</div>
</div>
</nav>



      <div id="chatView"className="container-fluid border shadow-lg border-secondary p-2 h-75 w-75 d-inline-flex-column word-wrap" style={{overflowY:"scroll", overflowX:"hidden"}}>
<div className='messagesDisplay w-100'>{listOfMessages.map((message)=>
{return(

<div className ="container m-3 w-75 word-wrap">
  <p className ="word-wrap" style={{display: 'flex'}}>{message.name}: {message.message}</p>
 
</div>

);
})}
</div>

<div className='messagesDisplay w-100'>{listOfWSMessages.map((messages)=>
{return(

<div className ="container m-3 w-75 word-wrap">
  <p className ="word-wrap" style={{display: 'flex'}}>{messages.name}: {messages.message} </p>
</div>

);
})}
</div>



</div>


<div>
 <h1>ID: {uid}</h1>
  <input type="text" class="" placeholder="Name"onChange={(event)=>{setName(event.target.value);
  }}/>
  <input type="text" class="" placeholder="Message"onChange={(event)=>{setMessage(event.target.value);
  }}/>
  <button onClick={createMessage} class="btn btn-success">Send Message</button>
</div>

<div id="alertMSG" class="pt-3"></div>


    </div>
  );
}

export default App;
