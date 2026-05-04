// src/components/MessageBubble.jsx

import React from 'react';
import './MessageBubble.css';

// MessageBubble.jsx

const MessageBubble = ({ role, text }) => {
  const isUser = role === 'user';

  const bubbleStyle = {
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  background: isUser ? '#007bff' : undefined,
  color: isUser ? '#fff' : undefined,
  border: isUser ? 'none' : undefined,
  padding: '12px 18px',
  margin: '6px 0',
  maxWidth: '70%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  borderRadius: isUser
    ? '16px 16px 4px 16px'
    : '16px 16px 16px 4px',
};


  return (
    <div
      className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}
        style={bubbleStyle}
    >
      {text.split('\n').map((line, index) => (
        <div key={index} style={{ marginBottom: '4px' }}>{line}</div>
      ))}
    </div>
  );
};

export default MessageBubble;











