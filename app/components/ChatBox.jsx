'use client';
import React, { useState } from 'react';
import { chatData } from '../../chatData';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
export function ChatBox() {
  const [messages, setMessages] = useState(chatData);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b">
        <img src="ai.svg" alt="" />
        {/* <div className="w-10 h-10 bg-gray-300 rounded-full"></div> */}
        <div className="ml-3">
          <h2 className="font-semibold text-black">AI Interviewer</h2>
          <div className='flex items-center gap-1 '>
            <div className='h-2 w-2 bg-green-500 rounded-full'></div>
          <p className="text-sm text-gray-500">Online</p>


          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
  {messages.map((message) => (
    <ChatMessage key={message.id} message={message} />
  ))}
</div>

      {/* Message Input */}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}
