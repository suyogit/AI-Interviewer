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

  async speechToText() {
    return new Promise((resolve, reject) => {
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(this.speechConfig, audioConfig);

      recognizer.recognizeOnceAsync(
        result => {
          if (result.text) {
            resolve(result.text);
          }
          recognizer.close();
        },
        error => {
          recognizer.close();
          reject(error);
        }
      );
    });
  }
}
