// "use client";
// import { useRef, useEffect } from "react";
// import "./check.css";
// import * as faceapi from "face-api.js";

// function App() {
//   const videoRef = useRef();
//   const canvasRef = useRef();

//   // LOAD FROM USEEFFECT
//   useEffect(() => {
//     startVideo();
//     videoRef && loadModels();
//   }, []);

//   // OPEN YOU FACE WEBCAM
//   const startVideo = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((currentStream) => {
//         videoRef.current.srcObject = currentStream;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   // LOAD MODELS FROM FACE API

//   const loadModels = () => {
//     Promise.all([
//       // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
//       faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//       faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//     ]).then(() => {
//       faceMyDetect();
//     });
//   };

//   const faceMyDetect = () => {
//     setInterval(async () => {
//       const detections = await faceapi
//         .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceExpressions();

//       // DRAW YOU FACE IN WEBCAM
//       canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
//         videoRef.current
//       );
//       faceapi.matchDimensions(canvasRef.current, {
//         width: 940,
//         height: 650,
//       });

//       const resized = faceapi.resizeResults(detections, {
//         width: 940,
//         height: 650,
//       });

//       faceapi.draw.drawDetections(canvasRef.current, resized);
//       faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
//       faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
//     }, 1000);
//   };

//   return (
//     <div className="myapp">
//       <h1>FAce Detection</h1>
//       <div className="appvide relative">
//         <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
//       </div>
//       <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
//     </div>
//   );
// }

// export default App;

//below code is working fine
"use client";
// import React, { useRef, useEffect, useState } from 'react';
// import * as faceapi from 'face-api.js';

// const FaceDetectionApp = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const detectionInterval = useRef(null);

//   // Load video and models on component mount
//   useEffect(() => {
//     const loadModelsAndStartVideo = async () => {
//       try {
//         // Start video stream
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }

//         // Load face-api.js models
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//           faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//           faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//           faceapi.nets.faceExpressionNet.loadFromUri('/models')
//         ]);

//         setIsLoading(false);
//         startFaceDetection();
//       } catch (err) {
//         setError(err.message);
//         console.error('Error loading models or accessing webcam:', err);
//       }
//     };

//     loadModelsAndStartVideo();

//     // Cleanup function
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
//         // Detect faces
//         const detections = await faceapi
//           .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks()
//           .withFaceExpressions();

//         // Clear previous canvas
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height);

//         // Resize and draw detections
//         const resizedDetections = faceapi.resizeResults(detections, {
//           width: canvas.width,
//           height: canvas.height
//         });

//         // Draw face detections
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//       } catch (err) {
//         console.error('Face detection error:', err);
//       }
//     }, 1000);
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="face-detection-container">
//       <h1>Face Detection</h1>
//       {isLoading && <div>Loading models...</div>}
//       <div className="video-container flex h-screen items-center">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           crossOrigin="anonymous"
//           className='relative'
//         />
//         <canvas
//           ref={canvasRef}
//           className="detection-canvas absolute"
//           width={640}
//           height={480}

//         />
//       </div>
//     </div>
//   );
// };

// export default FaceDetectionApp;

//test
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FaceDetectionProctoring = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const detectionInterval = useRef(null);

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

    loadModelsAndStartVideo();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

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
                toast.warning(`Please focus on the screen! (Warning ${newCount}/3)`);
              }
              if (newCount === 3) {
                toast.error("Multiple focus violations detected!");
              }
              return newCount;
            });
          }
        } else {
          // No face detected
          toast.warning("No face detected. Please ensure you are in view of the camera.");
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <h1 className="text-2xl text-black font-bold mb-4">Proctoring System</h1>
      {isLoading && (
        <div className="text-lg text-black">Loading face detection...</div>
      )}
      <div className="relative w-[640px] h-[480px] border-2 border-gray-300 rounded-lg shadow-lg">
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
      </div>
    </div>
  );
};

export default FaceDetectionProctoring;