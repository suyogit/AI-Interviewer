// import { useRef, useEffect, useState } from 'react';

// export function useVideoStream(props) {
//     const { isCameraOn, onEndCall } = props;
//     const videoRef = useRef(null);
//     const [stream, setStream] = useState(null);
//     const [isMuted, setIsMuted] = useState(false);
  
//     useEffect(() => {
//       let mounted = true;
  
//       if (isCameraOn) {
//         navigator.mediaDevices
//           .getUserMedia({ video: true, audio: true })
//           .then((mediaStream) => {
//             if (!mounted) {
//               mediaStream.getTracks().forEach((track) => track.stop());
//               return;
//             }
//             if (videoRef.current) {
//               videoRef.current.srcObject = mediaStream;
//             }
//             setStream(mediaStream);
//           })
//           .catch((err) => {
//             console.error("Error accessing camera:", err);
//             alert("Unable to access camera. Please check permissions.");
//           });
//       } else {
//         if (stream) {
//           stream.getTracks().forEach((track) => track.stop());
//           if (videoRef.current) {
//             videoRef.current.srcObject = null;
//           }
//           setStream(null);
//         }
//       }
  
//       return () => {
//         mounted = false;
//         if (stream) {
//           stream.getTracks().forEach((track) => track.stop());
//         }
//       };
//     }, [isCameraOn]);
  
//     const handleMuteToggle = () => {
//       if (stream) {
//         const audioTrack = stream.getAudioTracks()[0];
//         if (audioTrack) {
//           audioTrack.enabled = isMuted;
//           setIsMuted(!isMuted);
//         }
//       }
//     };
  
//     const handleEndCall = () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//         if (videoRef.current) {
//           videoRef.current.srcObject = null;
//         }
//         setStream(null);
//       }
//       onEndCall();
//     };
  
//     return {
//       videoRef,
//       stream,
//       isMuted,
//       handleMuteToggle,
//       handleEndCall,
//     };
//   }
// import { useRef, useEffect, useState } from 'react';

// export function useVideoStream(props) {
//     const { isCameraOn, onEndCall } = props;
//     const videoRef = useRef(null);
//     const [stream, setStream] = useState(null);
//     const [isMuted, setIsMuted] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         let currentStream = null;
//         const checkCameraPermissions = async () => {
//           try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             stream.getTracks().forEach(track => track.stop());
//             console.log("Camera permissions granted");
//           } catch (error) {
//             console.error("Camera access denied:", error);
//           }
//         };
//         checkCameraPermissions()

//         const setupStream = async () => {
//             try {
//                 // Log available devices
//                 const devices = await navigator.mediaDevices.enumerateDevices();
//                 const videoDevices = devices.filter(device => device.kind === 'videoinput');
//                 console.log('Available video devices:', videoDevices);

//                 // More specific video constraints
//                 const constraints = {
//                     video: {
//                         width: { ideal: 1280, max: 1920 },
//                         height: { ideal: 720, max: 1080 },
//                         aspectRatio: { ideal: 1.7777 } // 16:9 ratio
//                     },
//                     audio: false // Separate audio handling
//                 };

//                 currentStream = await navigator.mediaDevices.getUserMedia(constraints);

//                 if (videoRef.current) {
//                     videoRef.current.srcObject = currentStream;
                    
//                     // Ensure video starts playing
//                     videoRef.current.onloadedmetadata = () => {
//                         videoRef.current?.play().catch(playError => {
//                             console.error('Video play error:', playError);
//                             setError('Could not start video');
//                         });
//                     };
//                 }

//                 setStream(currentStream);
//                 setError(null);
//             } catch (err) {
//                 console.error("Detailed camera access error:", err);
//                 setError(err instanceof Error ? err.message : 'Unknown camera error');
//                 alert("Camera access failed. Check permissions and try again.");
//             }
//         };

//         const cleanupStream = () => {
//             if (currentStream) {
//                 currentStream.getTracks().forEach(track => track.stop());
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = null;
//                 }
//                 setStream(null);
//             }
//         };

//         if (isCameraOn) {
//             setupStream();
//         } else {
//             cleanupStream();
//         }

//         // Cleanup function
//         return () => {
//             cleanupStream();
//         };
//     }, [isCameraOn]);

//     const handleMuteToggle = () => {
//         setIsMuted(prev => !prev);
//     };

//     const handleEndCall = () => {
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop());
//         }
//         if (videoRef.current) {
//             videoRef.current.srcObject = null;
//         }
//         setStream(null);
//         onEndCall();
//     };

//     return {
//         videoRef,
//         stream,
//         isMuted,
//         error,
//         handleMuteToggle,
//         handleEndCall,
//     };
// }


import { useRef, useEffect, useState } from 'react';

export function useVideoStream(props) {
    const { isCameraOn, onEndCall } = props;
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [cameraError, setCameraError] = useState(null);

    useEffect(() => {
        async function setupVideoStream() {
            if (!isCameraOn) {
                stopStream();
                return;
            }

            try {
                // Detailed device check
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                
                console.log('Available video devices:', videoDevices);

                // More precise constraints
                const constraints = {
                    video: {
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 },
                        aspectRatio: 1.7777,
                        facingMode: 'user' // prefer front camera
                    },
                    audio: false
                };

                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch(error => {
                            console.error('Video play error:', error);
                            setCameraError('Unable to play video stream');
                        });
                    };
                }

                setStream(mediaStream);
                setCameraError(null);
            } catch (error) {
                console.error('Detailed Camera Error:', error);
                
                // Specific error handling
                if (error instanceof DOMException) {
                    switch (error.name) {
                        case 'NotAllowedError':
                            setCameraError('Camera access blocked. Check browser permissions.');
                            break;
                        case 'NotFoundError':
                            setCameraError('No camera found. Connect a camera and try again.');
                            break;
                        case 'OverconstrainedError':
                            setCameraError('Camera does not meet required constraints.');
                            break;
                        default:
                            setCameraError('Unexpected camera error occurred.');
                    }
                } else {
                    setCameraError('Unknown camera access error');
                }
            }
        }

        function stopStream() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                setStream(null);
            }
        }

        setupVideoStream();

        return () => {
            stopStream();
        };
    }, [isCameraOn]);

    const handleMuteToggle = () => setIsMuted(prev => !prev);

    const handleEndCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        onEndCall();
    };

    return {
        videoRef,
        stream,
        isMuted,
        cameraError,
        handleMuteToggle,
        handleEndCall
    };
}
