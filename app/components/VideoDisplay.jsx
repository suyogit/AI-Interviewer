// import React from 'react';
// import { CameraOff } from 'lucide-react';


// export function VideoDisplay(props) {
//   const { videoRef, isCameraOn } = props;

//   return (
//     <div className="h-full flex items-center justify-center">
//       {isCameraOn ? (
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           className="h-full w-full object-cover"
//         />
//       ) : (
//         <div className="text-gray-500 text-center">
//           <CameraOff size={48} className="mx-auto mb-2" />
//           <p>Camera is turned off</p>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect } from 'react';
import { CameraOff } from 'lucide-react';

export function VideoDisplay(props) {
  const { videoRef, isCameraOn } = props;

  useEffect(() => {
    if (videoRef.current) {
      // Detailed logging for video element
      console.log('Video Element Properties:', {
        srcObject: videoRef.current.srcObject,
        readyState: videoRef.current.readyState,
        networkState: videoRef.current.networkState,
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight
      });
    }
  }, [videoRef]);

  return (
    <div className="h-full flex items-center justify-center">
      {isCameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
          onError={(e) => {
            console.error('Video Error:', e);
          }}
          onCanPlay={() => {
            console.log('Video can play');
          }}
          onLoadedMetadata={(e) => {
            console.log('Loaded Metadata:', e);
          }}
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