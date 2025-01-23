import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

export class AzureSpeechService {
  constructor() {
    this.speechConfig = speechsdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
    );
    // Set speech synthesis language
    this.speechConfig.speechSynthesisLanguage = "en-US";
  }

  async textToSpeech(text) {
    return new Promise((resolve, reject) => {
      const synthesizer = new speechsdk.SpeechSynthesizer(this.speechConfig);

      synthesizer.speakTextAsync(
        text,
        result => {
          if (result) {
            resolve(result);
          }
          synthesizer.close();
        },
        error => {
          synthesizer.close();
          reject(error);
        }
      );
    });
  }

  // async speechToText() {
  //   return new Promise((resolve, reject) => {
  //     const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
  //     const recognizer = new speechsdk.SpeechRecognizer(this.speechConfig, audioConfig);

  //     recognizer.recognizeOnceAsync(
  //       result => {
  //         if (result.text) {
  //           resolve(result.text);
  //         }
  //         recognizer.close();
  //       },
  //       error => {
  //         recognizer.close();
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  stopRecognition() {
    if (this.recognizer) {
      this.recognizer.stopContinuousRecognitionAsync(() => {
        this.recognizer.close();
        this.recognizer = null;
      });
    }
  }
  
  // async speechToText(onIntermediateResult) {
  //   return new Promise((resolve, reject) => {
  //     const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
  //     const recognizer = new speechsdk.SpeechRecognizer(this.speechConfig, audioConfig);
  
  //     let finalText = "";
  
  //     // Capture intermediate results
  //     recognizer.recognizing = (s, e) => {
  //       if (onIntermediateResult) {
  //         onIntermediateResult(e.result.text);
  //       }
  //     };
  
  //     // Capture final results
  //     recognizer.recognized = (s, e) => {
  //       if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
  //         finalText += e.result.text;
  //       }
  //     };
  
  //     // Handle session completion
  //     recognizer.sessionStopped = () => {
  //       recognizer.close();
  //       resolve(finalText);
  //     };
  
  //     recognizer.canceled = (s, e) => {
  //       recognizer.close();
  //       reject(e.errorDetails);
  //     };
  
  //     recognizer.startContinuousRecognitionAsync();
  //   });
  // }
  async speechToText(onIntermediateResult) {
    return new Promise((resolve, reject) => {
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      this.recognizer = new speechsdk.SpeechRecognizer(this.speechConfig, audioConfig);
  
      let finalText = "";
  
      this.recognizer.recognizing = (s, e) => {
        if (onIntermediateResult) {
          onIntermediateResult(e.result.text);
        }
      };
  
      this.recognizer.recognized = (s, e) => {
        if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
          finalText += e.result.text;
        }
      };
  
      this.recognizer.sessionStopped = () => {
        this.recognizer.close();
        this.recognizer = null;
        resolve(finalText);
      };
  
      this.recognizer.canceled = (s, e) => {
        this.recognizer.close();
        this.recognizer = null;
        reject(e.errorDetails);
      };
  
      this.recognizer.startContinuousRecognitionAsync();
    });
  }
  
  
}
