// "use client"
// import React, { useRef, useEffect, useState } from "react";
// import * as faceapi from "face-api.js";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const FaceDetectionProctoring = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [warningCount, setWarningCount] = useState(0);
//   const detectionInterval = useRef(null);

//   useEffect(() => {
//     const loadModelsAndStartVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }

//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//           faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//         ]);

//         setIsLoading(false);
//         startFaceDetection();
//       } catch (err) {
//         toast.error("Unable to access webcam or load models");
//         console.error("Error:", err);
//       }
//     };

//     loadModelsAndStartVideo();

//     return () => {
//       if (detectionInterval.current) {
//         clearInterval(detectionInterval.current);
//       }
//     };
//   }, []);

//   const startFaceDetection = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     detectionInterval.current = setInterval(async () => {
//       try {
//         const detections = await faceapi
//           .detectSingleFace(
//             videoRef.current, 
//             new faceapi.TinyFaceDetectorOptions()
//           )
//           .withFaceLandmarks();

//         if (detections) {
//           const { _positions } = detections.landmarks;
//           const leftEye = _positions[36];
//           const rightEye = _positions[45];

//           const faceCenterX = (leftEye.x + rightEye.x) / 2;
//           const faceCenterY = (leftEye.y + rightEye.y) / 2;
//           const videoCenterX = videoRef.current.videoWidth / 2;
//           const videoCenterY = videoRef.current.videoHeight / 2;

//           // Detect face direction and position
//           const horizontalOffset = Math.abs(faceCenterX - videoCenterX);
//           const verticalOffset = Math.abs(faceCenterY - videoCenterY);

//           if (horizontalOffset > 100 || verticalOffset > 100) {
//             setWarningCount(prev => {
//               const newCount = prev + 1;
//               if (newCount <= 3) {
//                 toast.warning(`Please focus on the screen! (Warning ${newCount}/3)`);
//               }
//               if (newCount === 3) {
//                 toast.error("Multiple focus violations detected!");
//               }
//               return newCount;
//             });
//           }
//         } else {
//           // No face detected
//           toast.warning("No face detected. Please ensure you are in view of the camera.");
//         }
//       } catch (err) {
//         console.error("Face detection error:", err);
//       }
//     }, 2000);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <ToastContainer />
//       <h1 className="text-2xl text-black font-bold mb-4">Proctoring System</h1>
//       {isLoading && (
//         <div className="text-lg text-black">Loading face detection...</div>
//       )}
//       <div className="relative w-[640px] h-[480px] border-2 border-gray-300 rounded-lg shadow-lg">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           crossOrigin="anonymous"
//           className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
//         />
//         <canvas
//           ref={canvasRef}
//           className="absolute top-0 left-0 w-full h-full pointer-events-none"
//           width={640}
//           height={480}
//         />
//       </div>
//     </div>
//   );
// };

// export default FaceDetectionProctoring;


// "use client"
// import React, { useRef, useEffect, useState } from "react";
// import * as faceapi from "face-api.js";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const FaceDetectionProctoring = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [warningCount, setWarningCount] = useState(0);
//   const detectionInterval = useRef(null);
//   const toastId = useRef(null); // Ref to track the current toast ID

//   useEffect(() => {
//     const loadModelsAndStartVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }

//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//           faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//         ]);

//         setIsLoading(false);
//         startFaceDetection();
//       } catch (err) {
//         toast.error("Unable to access webcam or load models");
//         console.error("Error:", err);
//       }
//     };

//     loadModelsAndStartVideo();

//     return () => {
//       if (detectionInterval.current) {
//         clearInterval(detectionInterval.current);
//       }
//     };
//   }, []);

//   const startFaceDetection = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     detectionInterval.current = setInterval(async () => {
//       try {
//         const detections = await faceapi
//           .detectSingleFace(
//             videoRef.current, 
//             new faceapi.TinyFaceDetectorOptions()
//           )
//           .withFaceLandmarks();

//         if (detections) {
//           const { _positions } = detections.landmarks;
//           const leftEye = _positions[36];
//           const rightEye = _positions[45];

//           const faceCenterX = (leftEye.x + rightEye.x) / 2;
//           const faceCenterY = (leftEye.y + rightEye.y) / 2;
//           const videoCenterX = videoRef.current.videoWidth / 2;
//           const videoCenterY = videoRef.current.videoHeight / 2;

//           // Detect face direction and position
//           const horizontalOffset = Math.abs(faceCenterX - videoCenterX);
//           const verticalOffset = Math.abs(faceCenterY - videoCenterY);

//           if (horizontalOffset > 100 || verticalOffset > 100) {
//             setWarningCount(prev => {
//               const newCount = prev + 1;
//               if (newCount <= 3) {
//                 // Show toast only if no other toast is active
//                 if (!toast.isActive(toastId.current)) {
//                   toastId.current = toast.warning(
//                     `Please focus on the screen! (Warning ${newCount}/3)`,
//                     { autoClose: 2000 } // Set toast duration to 2 seconds
//                   );
//                 }
//               }
//               if (newCount === 3) {
//                 toast.error("Multiple focus violations detected!", { autoClose: 2000 });
//               }
//               return newCount;
//             });
//           }
//         } else {
//           // No face detected
//           if (!toast.isActive(toastId.current)) {
//             toastId.current = toast.warning(
//               "No face detected. Please ensure you are in view of the camera.",
//               { autoClose: 2000 }
//             );
//           }
//         }
//       } catch (err) {
//         console.error("Face detection error:", err);
//       }
//     }, 2000);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <ToastContainer />
//       <h1 className="text-2xl text-black font-bold mb-4">Proctoring System</h1>
//       {isLoading && (
//         <div className="text-lg text-black">Loading face detection...</div>
//       )}
//       <div className="relative w-[640px] h-[480px] border-2 border-gray-300 rounded-lg shadow-lg">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           crossOrigin="anonymous"
//           className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
//         />
//         <canvas
//           ref={canvasRef}
//           className="absolute top-0 left-0 w-full h-full pointer-events-none"
//           width={640}
//           height={480}
//         />
//       </div>
//     </div>
//   );
// };

// export default FaceDetectionProctoring;




"use client"
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Video, VideoOff } from "lucide-react"; // Import icons for video on/off

const FaceDetectionProctoring = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true); // State to track video on/off
  const detectionInterval = useRef(null);
  const toastId = useRef(null); // Ref to track the current toast ID
  const streamRef = useRef(null); // Ref to store the video stream

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Store the stream in a ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);

        setIsLoading(false);
        startFaceDetection();
      } catch (err) {
        toast.error("Unable to access webcam or load models");
        console.error("Error:", err);
      }
    };

    if (isVideoOn) {
      loadModelsAndStartVideo();
    }

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop()); // Clean up the stream
      }
    };
  }, [isVideoOn]); // Re-run effect when isVideoOn changes

  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    detectionInterval.current = setInterval(async () => {
      try {
        const detections = await faceapi
          .detectSingleFace(
            videoRef.current, 
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks();

        if (detections) {
          const { _positions } = detections.landmarks;
          const leftEye = _positions[36];
          const rightEye = _positions[45];

          const faceCenterX = (leftEye.x + rightEye.x) / 2;
          const faceCenterY = (leftEye.y + rightEye.y) / 2;
          const videoCenterX = videoRef.current.videoWidth / 2;
          const videoCenterY = videoRef.current.videoHeight / 2;

          // Detect face direction and position
          const horizontalOffset = Math.abs(faceCenterX - videoCenterX);
          const verticalOffset = Math.abs(faceCenterY - videoCenterY);

          if (horizontalOffset > 100 || verticalOffset > 100) {
            setWarningCount(prev => {
              const newCount = prev + 1;
              if (newCount <= 3) {
                // Show toast only if no other toast is active
                if (!toast.isActive(toastId.current)) {
                  toastId.current = toast.warning(
                    `Please focus on the screen! (Warning ${newCount}/3)`,
                    { autoClose: 2000 } // Set toast duration to 2 seconds
                  );
                }
              }
              if (newCount === 3) {
                toast.error("Multiple focus violations detected!", { autoClose: 2000 });
              }
              return newCount;
            });
          }
        } else {
          // No face detected
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.warning(
              "No face detected. Please ensure you are in view of the camera.",
              { autoClose: 2000 }
            );
          }
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    }, 2000);
  };

  const toggleVideo = () => {
    if (isVideoOn) {
      // Turn off video
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop()); // Stop the video stream
      }
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current); // Stop face detection
      }
      setIsVideoOn(false);
    } else {
      // Turn on video
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsVideoOn(true);
          startFaceDetection(); // Restart face detection
        })
        .catch(err => {
          toast.error("Unable to restart video");
          console.error("Error restarting video:", err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <h1 className="text-2xl text-black font-bold mb-4">Proctoring Section</h1>
      {isLoading && isVideoOn && ( // Show loading only if video is on
        <div className="text-lg text-black">Loading face detection...</div>
      )}
      <div className="relative w-[640px] h-[480px] border-2 border-gray-300 rounded-lg shadow-lg">
        {isVideoOn ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              crossOrigin="anonymous"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              width={640}
              height={480}
            />
          </>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <p className="text-black">Video is turned off</p>
          </div>
        )}
      </div>
      {/* Video Toggle Button */}
      <button
        onClick={toggleVideo}
        className="mt-4 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center gap-2"
      >
        {isVideoOn ? <VideoOff size={20} /> : <Video size={20} />}
        {isVideoOn ? "Turn Off Video" : "Turn On Video"}
      </button>
    </div>
  );
};

export default FaceDetectionProctoring;