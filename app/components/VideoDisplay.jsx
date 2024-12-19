import React from 'react';
import { CameraOff } from 'lucide-react';

export function VideoDisplay(props) {
  const { videoRef, isCameraOn } = props;

  return (
    <div className="h-full flex items-center justify-center">
      {isCameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="text-gray-500 text-center">
          <CameraOff size={48} className="mx-auto mb-2" />
          <p>Camera is turned off</p>
        </div>
      )}
    </div>
  );
}
