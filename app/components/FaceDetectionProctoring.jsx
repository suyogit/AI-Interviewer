"use client"
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Video, VideoOff } from "lucide-react";

const FaceDetectionProctoring = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const detectionInterval = useRef(null);
  const streamRef = useRef(null);
  const toastId = useRef(null);

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
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
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn]);

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

        // Clear previous toast if face is detected
        if (detections && toast.isActive(toastId.current)) {
          toast.dismiss(toastId.current);
          toastId.current = null;
        }
        
        // Only show toast if NO face is detected and no toast is currently active
        if (!detections && !toast.isActive(toastId.current)) {
          toastId.current = toast.error("No face detected. Please ensure you are in view of the camera.", {
            toastId: 'no-face-warning',
            autoClose: 3000, // Toast will automatically close after 3 seconds
            pauseOnHover: true
          });
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    }, 2000);
  };

  const toggleVideo = () => {
    if (isVideoOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      setIsVideoOn(false);
    } else {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsVideoOn(true);
          startFaceDetection();
        })
        .catch(err => {
          toast.error("Unable to restart video");
          console.error("Error restarting video:", err);
        });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-200">
      <ToastContainer />
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="ml-3 font-semibold text-gray-800 dark:text-white">
            Proctoring System
          </h2>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {isLoading && isVideoOn && (
          <div className="text-gray-600 dark:text-gray-300">Loading face detection...</div>
        )}
        <div className="relative w-full h-full max-w-[640px] max-h-[480px] mx-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
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
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">Video is turned off</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={toggleVideo}
          className="w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-2"
        >
          {isVideoOn ? <VideoOff size={20} /> : <Video size={20} />}
          {isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      </div>
    </div>
  );
};

export default FaceDetectionProctoring;