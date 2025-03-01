"use client";
import React, { useState } from "react";
import { EnhancedChatBox } from "./ChatBox";
import { Camera } from "lucide-react";
import FaceDetectionProctoring from "./FaceDetectionProctoring";

export function VideoInterview() {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(true);

  const handleEndInterview = () => {
    setIsInterviewActive(false);
    // Turn off camera when interview ends
    if (isCameraVisible) {
      setIsCameraVisible(false);
    }
  };

  return (
    <div className="container mx-auto h-[calc(100vh-6rem)]">
      <div className={`flex ${isInterviewActive ? 'gap-4' : ''} h-full`}>
        {/* Left Section - Video or Camera Button - Only shown during active interview */}
        {isInterviewActive && (
          isCameraVisible ? (
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <FaceDetectionProctoring />
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
          )
        )}

        {/* Right Section - Chat or Report Card */}
        <div
          className={isInterviewActive && isCameraVisible ? "w-[800px]" : "flex-1 max-w-4xl mx-auto"}
        >
          <EnhancedChatBox 
            onEndInterview={handleEndInterview}
          />
        </div>
      </div>
    </div>
  );
}
