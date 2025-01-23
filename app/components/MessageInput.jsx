// import React, { useState } from "react";
// import { Send, Mic } from "lucide-react";
// import { AzureSpeechService } from "../utils/azure-speech";

// export function MessageInput({ value, onChange, onSubmit }) {
//   const [isListening, setIsListening] = useState(false);
//   const [error, setError] = useState("");
//   const azureSpeech = new AzureSpeechService();

//   // const handleSpeechToText = async () => {
//   //   try {
//   //     setIsListening(true);
//   //     const recognizedText = await azureSpeech.speechToText();
//   //     onChange(value + recognizedText); // Append recognized text to the current input
//   //   } catch (err) {
//   //     setError("Error in speech-to-text conversion");
//   //     console.error(err);
//   //   } finally {
//   //     setIsListening(false);
//   //   }
//   // };
//   // const handleSpeechToText = async () => {
//   //   try {
//   //     setIsListening(true);
//   //     azureSpeech.speechToText((intermediateText) => {
//   //       onChange(value + intermediateText);
//   //     }).then((finalText) => {
//   //       onChange(value + finalText);
//   //     });
//   //   } catch (err) {
//   //     setError("Error in speech-to-text conversion");
//   //     console.error(err);
//   //   } finally {
//   //     setIsListening(false);
//   //   }
//   // };
//   const handleSpeechToText = async () => {
//     if (isListening) {
//       // If already listening, stop and reset
//       azureSpeech.stopRecognition(); // Stop the recognizer
//       setIsListening(false);
//       return; // Exit the function
//     }
  
//     try {
//       setIsListening(true);
//       azureSpeech.speechToText((intermediateText) => {
//         onChange(value + intermediateText);
//       }).then((finalText) => {
//         onChange(value + finalText);
//       });
//     } catch (err) {
//       setError("Error in speech-to-text conversion");
//       console.error(err);
//       setIsListening(false);
//     }
//   };
  
  

//   return (
//     <form onSubmit={onSubmit} className="border-t p-4">
//       <div className="flex items-center gap-2">
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 rounded-full px-4 py-2 border focus:outline-none focus:border-blue-500 text-black"
//         />
//         <button
//           type="button"
//           onClick={handleSpeechToText}
//           disabled={isListening}
//           className={`bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors ${isListening ? "opacity-50 cursor-not-allowed" : ""}`}
//           title="Activate microphone"
//         >
//           {isListening ? "..." : <Mic size={20} />}
//         </button>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
//           title="Send message"
//         >
//           <Send size={20} />
//         </button>
//       </div>
//       {error && (
//         <div className="text-red-500 mt-2 text-sm">{error}</div>
//       )}
//     </form>
//   );
// }

// import React, { useState } from "react";
// import { Send, Mic } from "lucide-react";
// import { AzureSpeechService } from "../utils/azure-speech";

// export function MessageInput({ value, onChange, onSubmit }) {
//   const [isListening, setIsListening] = useState(false);
//   const [error, setError] = useState("");
//   const [azureSpeech] = useState(() => new AzureSpeechService());

//   const handleSpeechToText = async () => {
//     if (isListening) {
//       // If already listening, stop recognition
//       azureSpeech.stopRecognition();
//       setIsListening(false);
//       return;
//     }

//     try {
//       setIsListening(true);
//       // Store initial value to prevent duplicate text
//       const initialValue = value;
      
//       azureSpeech.speechToText(
//         // Handle intermediate results
//         (intermediateText) => {
//           onChange(initialValue + intermediateText);
//         }
//       ).then(
//         // Handle final result
//         (finalText) => {
//           onChange(initialValue + finalText);
//           setIsListening(false);
//         }
//       ).catch((err) => {
//         setError("Error in speech-to-text conversion");
//         console.error(err);
//         setIsListening(false);
//       });
//     } catch (err) {
//       setError("Error in speech-to-text conversion");
//       console.error(err);
//       setIsListening(false);
//     }
//   };

//   return (
//     <form onSubmit={onSubmit} className="border-t p-4">
//       <div className="flex items-center gap-2">
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 rounded-full px-4 py-2 border focus:outline-none focus:border-blue-500 text-black"
//         />
//         <button
//           type="button"
//           onClick={handleSpeechToText}
//           className={`bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors ${
//             isListening ? "bg-red-500 hover:bg-red-600" : ""
//           }`}
//           title={isListening ? "Stop recording" : "Start recording"}
//         >
//           <Mic size={20} />
//         </button>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
//           title="Send message"
//         >
//           <Send size={20} />
//         </button>
//       </div>
//       {error && (
//         <div className="text-red-500 mt-2 text-sm">{error}</div>
//       )}
//     </form>
//   );
// }



//cloude
import React, { useState } from "react";
import { Send, Mic } from "lucide-react";
import { AzureSpeechService } from "../utils/azure-speech";

export function MessageInput({ value, onChange, onSubmit, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [azureSpeech] = useState(() => new AzureSpeechService());

  const handleSpeechToText = async () => {
    if (isListening) {
      // If already listening, stop recognition
      azureSpeech.stopRecognition();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      // Store initial value to prevent duplicate text
      const initialValue = value;
      
      azureSpeech.speechToText(
        // Handle intermediate results
        (intermediateText) => {
          onChange(initialValue + intermediateText);
        }
      ).then(
        // Handle final result
        (finalText) => {
          onChange(initialValue + finalText);
          setIsListening(false);
        }
      ).catch((err) => {
        setError("Error in speech-to-text conversion");
        console.error(err);
        setIsListening(false);
      });
    } catch (err) {
      setError("Error in speech-to-text conversion");
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 border focus:outline-none focus:border-blue-500 text-black disabled:bg-gray-100 disabled:text-gray-500"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleSpeechToText}
          className={`bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors ${
            isListening ? "bg-red-500 hover:bg-red-600" : ""
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          title={isListening ? "Stop recording" : "Start recording"}
          disabled={disabled}
        >
          <Mic size={20} />
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          title="Send message"
          disabled={disabled}
        >
          <Send size={20} />
        </button>
      </div>
      {error && (
        <div className="text-red-500 mt-2 text-sm">{error}</div>
      )}
    </form>
  );
}