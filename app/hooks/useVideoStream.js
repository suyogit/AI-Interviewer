import { useRef, useEffect, useState } from 'react';

export function useVideoStream(props) {
    const { isCameraOn, onEndCall } = props;
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
  
    useEffect(() => {
      let mounted = true;
  
      if (isCameraOn) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((mediaStream) => {
            if (!mounted) {
              mediaStream.getTracks().forEach((track) => track.stop());
              return;
            }
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
          })
          .catch((err) => {
            console.error("Error accessing camera:", err);
            alert("Unable to access camera. Please check permissions.");
          });
      } else {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
          setStream(null);
        }
      }
  
      return () => {
        mounted = false;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [isCameraOn]);
  
    const handleMuteToggle = () => {
      if (stream) {
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = isMuted;
          setIsMuted(!isMuted);
        }
      }
    };
  
    const handleEndCall = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setStream(null);
      }
      onEndCall();
    };
  
    return {
      videoRef,
      stream,
      isMuted,
      handleMuteToggle,
      handleEndCall,
    };
  }
  