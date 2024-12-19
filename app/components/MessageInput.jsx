import React from 'react';
import { Send } from 'lucide-react';

export function MessageInput({ value, onChange, onSubmit }) {
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
          type="submit"
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
