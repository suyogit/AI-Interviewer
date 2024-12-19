"use client"
import { useState, useCallback } from 'react';
import { AzureSpeechService } from '../utils/azure-speech';

const SpeechServices = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');

  const azureSpeech = new AzureSpeechService();

  const handleTextToSpeech = async () => {
    if (!text) return;

    try {
      setIsSpeaking(true);
      await azureSpeech.textToSpeech(text);
    } catch (err) {
      setError('Error in text-to-speech conversion');
      console.error(err);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSpeechToText = async () => {
    try {
      setIsListening(true);
      const recognizedText = await azureSpeech.speechToText();
      setText(recognizedText);
    } catch (err) {
      setError('Error in speech-to-text conversion');
      console.error(err);
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Azure Speech Services Demo</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded text-black"
            rows="4"
            placeholder="Enter text here or use speech-to-text..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleTextToSpeech}
            disabled={isSpeaking || !text}
            className={`px-4 py-2 rounded ${isSpeaking ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
          >
            {isSpeaking ? 'Speaking...' : 'Speak Text'}
          </button>

          <button
            onClick={handleSpeechToText}
            disabled={isListening}
            className={`px-4 py-2 rounded ${isListening ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
          >
            {isListening ? 'Listening...' : 'Start Listening'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechServices;
