import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from '../utils/api';

const Chat = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/chat/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages', err);
      }
    };

    fetchMessages();
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.disconnect();
  }, [roomId, socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit('message', { roomId, content: message });
    await axios.post('/chat', { roomId, sender: 'user_id', content: message });
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
