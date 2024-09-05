import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = ({ roomId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const socket = io('http://localhost:5000'); // Connect to your backend server

  useEffect(() => {
    // Emit typing and stopTyping events
    const handleTyping = () => socket.emit('typing', { roomId, userId });
    const handleStopTyping = () => socket.emit('stopTyping', { roomId });

    // Listen for typing and stopTyping events from other users
    socket.on('displayTyping', ({ userId }) => {
      setTypingUser(userId);  // Set the user who is typing
    });

    socket.on('hideTyping', () => {
      setTypingUser(null);  // Clear typing indicator when the user stops typing
    });

    return () => {
      // Clean up event listeners when component unmounts
      socket.off('displayTyping');
      socket.off('hideTyping');
    };
  }, [roomId, userId, socket]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value) {
      handleTyping();  // Start typing
    } else {
      handleStopTyping();  // Stop typing when input is cleared
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit('message', { roomId, userId, content: message });  // Emit the message
    setMessage('');
    handleStopTyping();  // Stop typing when the message is sent
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>

      {/* Typing Indicator */}
      {typingUser && <p>{typingUser} is typing...</p>}

      {/* Message Input */}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
