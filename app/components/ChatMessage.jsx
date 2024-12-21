import React, { useState } from 'react';
import { AzureSpeechService } from '../utils/azure-speech';

export function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const azureSpeech = new AzureSpeechService();

  const handleTextToSpeech = async () => {
    try {
      setIsSpeaking(true);
      await azureSpeech.textToSpeech(message.text);
    } catch (err) {
      setError('Error in text-to-speech conversion');
      console.error(err);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
      >
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center">
          <span className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </span>
          {!isUser && (
            <button
              className={`m-2 ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTextToSpeech}
              disabled={isSpeaking}
              title="Speak message"
            >
              {isSpeaking ? (
                '...'
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-volume-2"
                >
                  <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                  <path d="M16 9a5 5 0 0 1 0 6" />
                  <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
    </div>
  );
}
