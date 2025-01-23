import { useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'sonner'; // Assuming you're using sonner for toasts

export function useFaceProctoring(videoRef) {
  const [isProctoring, setIsProctoring] = useState(false);
  const [detectionInterval, setDetectionInterval] = useState(null);

  // Load face-api.js models
  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);
  };

  // Detect face position and direction
  const detectFace = useCallback(async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detections) {
      toast.error('No face detected! Please face the camera.', {
        position: 'top-center',
        duration: 3000
      });
      return;
    }

    // Check face position (simplified example)
    const landmarks = detections.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    // Calculate eye centers
    const leftEyeCenter = {
      x: leftEye.reduce((acc, pt) => acc + pt.x, 0) / leftEye.length,
      y: leftEye.reduce((acc, pt) => acc + pt.y, 0) / leftEye.length
    };

    const rightEyeCenter = {
      x: rightEye.reduce((acc, pt) => acc + pt.x, 0) / rightEye.length,
      y: rightEye.reduce((acc, pt) => acc + pt.y, 0) / rightEye.length
    };

    // Simple head turn detection
    const eyeDistance = Math.abs(leftEyeCenter.x - rightEyeCenter.x);
    const videoWidth = videoRef.current.videoWidth;
    const turnThreshold = videoWidth * 0.2; // 20% of video width

    if (eyeDistance > turnThreshold) {
      toast.warning('Please face the camera directly!', {
        position: 'top-center',
        duration: 3000
      });
    }
  }, [videoRef]);

  // Start proctoring
  const startProctoring = useCallback(async () => {
    await loadModels();
    setIsProctoring(true);
    
    const interval = setInterval(detectFace, 3000); // Check every 3 seconds
    setDetectionInterval(interval);
  }, [detectFace]);

  // Stop proctoring
  const stopProctoring = useCallback(() => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
    setIsProctoring(false);
  }, [detectionInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [detectionInterval]);

  return {
    startProctoring,
    stopProctoring,
    isProctoring
  };
}
