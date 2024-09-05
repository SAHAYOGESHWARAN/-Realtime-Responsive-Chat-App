import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = ({ roomId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const socket = io('http://localhost:5000'); // Adjust the URL based on your server

  // Handle typing indicator and stop typing
  useEffect(() => {
    const handleTyping = () => socket.emit('typing', { roomId, userId });
    const handleStopTyping = () => socket.emit('stopTyping', { roomId });

    socket.on('displayTyping', ({ userId }) => {
      setTypingUser(userId);  // Display typing user
    });

    socket.on('hideTyping', () => {
      setTypingUser(null);  // Hide typing indicator
    });

    // Handle incoming messages
    socket.on('message', (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);  // Update messages list
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off('displayTyping');
      socket.off('hideTyping');
      socket.off('message');
    };
  }, [roomId, userId, socket]);

  // Handle message input change and send message
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value) {
      socket.emit('typing', { roomId, userId });
    } else {
      socket.emit('stopTyping', { roomId });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { roomId, userId, content: message });  // Send message to server
      setMessage('');  // Clear the message input
      socket.emit('stopTyping', { roomId });  // Stop typing
    }
  };

  return (
    <div>
      <div className="chat-window">
        {/* Messages */}
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.userId}:</strong> {msg.content}
            </div>
          ))}
        </div>

        {/* Typing Indicator */}
        {typingUser && <p className="typing-indicator">{typingUser} is typing...</p>}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import './Chat.css'; // Importing the CSS for Chat component



export default Chat;
