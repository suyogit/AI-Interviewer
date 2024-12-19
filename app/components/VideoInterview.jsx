"use client"
import React, { useState } from 'react';
import { ChatBox } from './ChatBox';
import { VideoSection } from './VideoSection';
import { Camera } from 'lucide-react';

export function VideoInterview() {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleEndCall = () => {
    setIsCameraOn(false);
    setIsCameraVisible(false);
  };

  return (
    <div className="container mx-auto h-[calc(100vh-6rem)]">
      <div className="flex gap-4 h-full">
        {/* Left Section - Video or Camera Button */}
        {isCameraVisible ? (
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <VideoSection 
              isCameraOn={isCameraOn}
              onToggleCamera={() => setIsCameraOn(!isCameraOn)}
              onEndCall={handleEndCall}
            />
          </div>
        ) : (
          <div className="w-16 flex flex-col items-center my-auto">
            <button
              onClick={() => setIsCameraVisible(true)}
              className="p-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              title="Start video interview"
            >
              <Camera size={24} />
            </button>
          </div>
        )}

        {/* Right Section - Chat */}
        <div className={isCameraVisible ? "w-[800px]" : "flex-1 max-w-4xl mx-auto"}>
          <ChatBox />
        </div>
      </div>
    </div>
  );
}