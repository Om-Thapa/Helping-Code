import { useState, useMemo, useEffect } from 'react'
import { io } from 'socket.io-client'

function App() {
  const socket = useMemo(() => io("http://localhost:3000", {
    withCredentials:true
  }), []);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState('');
  const [socketID, setSocketID] = useState('');
  const [roomName, setRoomName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message, room);
    setMessage('')
    setRoom('')
  }

  const joinRoomHandler = (e) => {
    console.log("Joining Room", roomName)
    socket.emit('join-room', roomName);
    setRoomName('');
  }

  useEffect(()=>{
    socket.on("connect",() => {
      console.log("Connected to Server");
      console.log("Client ID :", socket.id);
      setSocketID(socket.id);
    });

    socket.on('welcome',(s) => {
      console.log(s);
    })

    socket.on('receive-message',(data)=>{
      console.log(data);
      console.log(messages)
      setMessages(prevMessages => [...prevMessages, data])
    })

    return () => socket.disconnect();
  },[])

  return(
    <div className='bg-green-300 p-8 border-2 flex flex-col items-center justify-between text-center border-emerald-700 rounded-xl'>
        <h1 className='mb-6'>Welcome to Socket.io</h1>
        <h2>{socketID}</h2>

        <form onSubmit={handleSubmit}>
            <textarea 
            name="" id="" aria-label='Message' className='w-96 m-3 p-5 border-2 border-emerald-600 block' placeholder='Write your message' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>

            <textarea 
            name="" id="" aria-label='Room' className='w-96 m-3 p-5 border-2 border-emerald-600 block' placeholder='Write your Room ID' value={room} onChange={(e) => setRoom(e.target.value)}></textarea>

            <button type='submit' title='Submit' className='hover:pointer-fine: px-4 py-2 bg-amber-200 rounded-lg'>Send Message</button>
        </form>

        <form action={joinRoomHandler}>
            <textarea 
            name="" id="" aria-label='Room-Name' className='w-96 m-3 p-5 border-2 border-emerald-600 block' placeholder='Join your Room Name' value={roomName} onChange={(e) => setRoomName(e.target.value)}></textarea>

            <button type='submit' title='Submit' className='px-4 py-2 bg-amber-200 rounded-lg'>Join</button>
        </form>

        {messages.length > 0 ?
        <div className='bg-gray-300 mt-3 p-3 rounded-xl'>
          <h1>Messages</h1>
          <ol className='mt-3 bg-gray-100 rounded-lg p-2'>
            {messages.map((m, idx) => <li key={idx}>{m}</li>)}
          </ol>
        </div> : undefined}
    </div>
)}
export default App;