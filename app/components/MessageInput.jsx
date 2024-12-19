import React, { useState } from "react";
import { Send, Mic } from "lucide-react";
import { AzureSpeechService } from "../utils/azure-speech";

export function MessageInput({ value, onChange, onSubmit }) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const azureSpeech = new AzureSpeechService();

  const handleSpeechToText = async () => {
    try {
      setIsListening(true);
      const recognizedText = await azureSpeech.speechToText();
      onChange(value + recognizedText); // Append recognized text to the current input
    } catch (err) {
      setError("Error in speech-to-text conversion");
      console.error(err);
    } finally {
      setIsListening(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 border focus:outline-none focus:border-blue-500 text-black"
        />
        <button
          type="button"
          onClick={handleSpeechToText}
          disabled={isListening}
          className={`bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors ${isListening ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Activate microphone"
        >
          {isListening ? "..." : <Mic size={20} />}
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
          title="Send message"
        >
          <Send size={20} />
        </button>
      </div>
      {error && (
        <div className="text-red-500 mt-2 text-sm">{error}</div>
      )}
    </form>
  );
}
