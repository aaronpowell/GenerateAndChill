import { useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = () => {
  const recognition = useRef(new SpeechRecognition());
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  recognition.current.interimResults = true;

  recognition.current.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");

    setTranscript(() => transcript);
  });

  recognition.current.addEventListener("end", () => {
    setIsListening(false);
  });

  const start = () => {
    setIsListening(true);
    recognition.current.start();
  };

  const stop = () => {
    setIsListening(false);
    recognition.current.stop();
  };

  return { isListening, start, stop, transcript };
};
