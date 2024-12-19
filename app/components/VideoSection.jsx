
import React from 'react';
import { VideoDisplay } from './VideoDisplay';
import { VideoControls } from './VideoControls';
import { useVideoStream } from '../hooks/useVideoStream';

export function VideoSection(props) {
  const { isCameraOn, onToggleCamera, onEndCall } = props;

  const { videoRef, stream, isMuted, handleMuteToggle, handleEndCall } = useVideoStream({
    isCameraOn,
    onEndCall,
  });

  return (
    <div className="relative h-full bg-gray-900">
      <VideoDisplay 
        videoRef={videoRef}
        isCameraOn={isCameraOn}
      />
      <VideoControls
        isCameraOn={isCameraOn}
        isMuted={isMuted}
        onToggleCamera={onToggleCamera}
        onToggleMute={handleMuteToggle}
        onEndCall={handleEndCall}
      />
    </div>
  );
}
