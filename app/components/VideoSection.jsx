
// import React from 'react';
// import { VideoDisplay } from './VideoDisplay';
// import { VideoControls } from './VideoControls';
// import { useVideoStream } from '../hooks/useVideoStream';

// export function VideoSection(props) {
//   const { isCameraOn, onToggleCamera, onEndCall } = props;

//   const { videoRef, stream, isMuted, handleMuteToggle, handleEndCall } = useVideoStream({
//     isCameraOn,
//     onEndCall,
//   });

//   return (
//     <div className="relative h-full bg-gray-900">
//       <VideoDisplay 
//         videoRef={videoRef}
//         isCameraOn={isCameraOn}
//       />
//       <VideoControls
//         isCameraOn={isCameraOn}
//         isMuted={isMuted}
//         onToggleCamera={onToggleCamera}
//         onToggleMute={handleMuteToggle}
//         onEndCall={handleEndCall}
//       />
//     </div>
//   );
// }
"use client";
import React, { useRef } from 'react';
import { VideoDisplay } from './VideoDisplay';
import { VideoControls } from './VideoControls';
import { useVideoStream } from '../hooks/useVideoStream';
import { useFaceProctoring } from '../hooks/useFaceProctoring';
import { Toaster } from 'sonner';

export function VideoSection(props) {
  const { isCameraOn, onToggleCamera, onEndCall } = props;

  const videoRef = useRef(null);

  const { stream, isMuted, handleMuteToggle, handleEndCall } = useVideoStream({
    isCameraOn,
    onEndCall,
  });

  const { startProctoring, stopProctoring, isProctoring } = useFaceProctoring(videoRef);

  const handleStartProctoring = () => {
    if (isCameraOn) {
      startProctoring();
    }
  };

  return (
    <div className="relative h-full bg-gray-900">
      <Toaster />
      <VideoDisplay 
        videoRef={videoRef}
        isCameraOn={isCameraOn}
      />
      <VideoControls
        isCameraOn={isCameraOn}
        isMuted={isMuted}
        isProctoring={isProctoring}
        onToggleCamera={onToggleCamera}
        onToggleMute={handleMuteToggle}
        onEndCall={handleEndCall}
        onStartProctoring={handleStartProctoring}
        onStopProctoring={stopProctoring}
      />
    </div>
  );
}
