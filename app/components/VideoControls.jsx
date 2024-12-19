import { Camera, CameraOff, Mic, MicOff, PhoneOff } from 'lucide-react';

export function VideoControls(props) {
    const { isCameraOn, isMuted, onToggleCamera, onToggleMute, onEndCall } = props;
  
    return (
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-center gap-4">
          <button
            onClick={onToggleCamera}
            className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            title={isCameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {isCameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
          </button>
          <button
            onClick={onToggleMute}
            className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
            title="End call"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    );
  }
  