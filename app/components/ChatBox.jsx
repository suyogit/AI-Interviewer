"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { Timer } from "./Timer";
import { ReportCard } from "./ReportCard";
import { XCircle } from "lucide-react";

export function EnhancedChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [interviewState, setInterviewState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [topicProgress, setTopicProgress] = useState({
    currentTopic: 0,
    consecutiveGoodAnswers: 0,
  });
  const messagesEndRef = useRef(null); // Reference for scrolling to bottom
  const messageContainerRef = useRef(null); // Reference for message container
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    // Scroll to the bottom of the message container whenever messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]); // Runs when the 'messages' state changes (new message)

  const topicSequence = [
    { name: "HTML", minQuestions: 3 },
    { name: "CSS", minQuestions: 3 },
    { name: "JavaScript", minQuestions: 4 },
    { name: "React", minQuestions: 4 },
    { name: "Node.js", minQuestions: 4 },
    { name: "Express", minQuestions: 3 },
    { name: "MongoDB", minQuestions: 4 },
    { name: "APIs", minQuestions: 3 },
  ];

  useEffect(() => {
    initializeInterview();
  }, []);

  const initializeInterview = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/start-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selected_categories: ["HTML", "CSS", "JavaScript"]
        })
      });

      const data = await response.json();
      
      // First set the interview state
      const initialState = {
        ...data,
        current_category: "HTML",
        current_difficulty: "Easy",
      };
      setInterviewState(initialState);

      // Then fetch the first question using the initial state
      await fetchFirstQuestion(initialState);

    } catch (error) {
      console.error("Error initializing interview:", error);
      addSystemMessage(
        "There was an error starting the interview. Please refresh to try again."
      );
    }
  };

  const fetchFirstQuestion = async (initialState) => {
    try {
      const response = await fetch("http://localhost:5000/api/get-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: initialState.current_category,
          difficulty: initialState.current_difficulty,
          previous_answer: ""
        }),
      });

      const data = await response.json();
      addSystemMessage(data.question);

      setInterviewState(prev => ({
        ...prev,
        current_question: data.question,
        current_category: data.category,
        current_difficulty: data.difficulty,
      }));
    } catch (error) {
      console.error("Error fetching first question:", error);
      addSystemMessage(
        "There was an error getting the first question. Please refresh to try again."
      );
    }
  };

  const shouldAdvanceTopic = (currentTopic, questionsAsked) => {
    const topicQuestions = questionsAsked.filter(
      (q) => q.category.toLowerCase() === currentTopic.toLowerCase()
    );
    return (
      topicQuestions.length >=
        topicSequence[topicProgress.currentTopic].minQuestions &&
      topicProgress.consecutiveGoodAnswers >= 2
    );
  };

  const determineNextTopic = () => {
    if (shouldAdvanceTopic(interviewState.current_category, askedQuestions)) {
      const nextTopicIndex = topicProgress.currentTopic + 1;
      if (nextTopicIndex < topicSequence.length) {
        setTopicProgress({
          currentTopic: nextTopicIndex,
          consecutiveGoodAnswers: 0,
        });
        return topicSequence[nextTopicIndex].name;
      }
    }
    return interviewState.current_category;
  };

  const extractKeywords = (answer) => {
    const keywords = answer
      .toLowerCase()
      .match(
        /\b(react|node|express|mongodb|html|css|javascript|api|database|component|state|props|routing|async|promise|rest|crud|hooks|middleware|authentication)\b/g
      );
    return [...new Set(keywords || [])];
  };

  const fetchNextQuestion = async (previousAnswer = "") => {
    if (!interviewState) {
      console.error("Interview state not initialized");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/get-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: interviewState.current_category,
          difficulty: interviewState.current_difficulty,
          previous_answer: previousAnswer
        }),
      });

      const data = await response.json();
      addSystemMessage(data.question);

      setInterviewState(prev => ({
        ...prev,
        current_question: data.question,
        current_category: data.category,
        current_difficulty: data.difficulty,
      }));
    } catch (error) {
      console.error("Error fetching question:", error);
      addSystemMessage(
        "There was an error getting the next question. Please try again."
      );
    }
  };

  const evaluateAnswer = async (answerText) => {
    try {
      const response = await fetch("http://localhost:5000/api/next", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: {
            ...interviewState,
            asked_questions: askedQuestions,
          },
          answer: {
            text: answerText,
            keywords: extractKeywords(answerText),
            category: interviewState.current_category,
            difficulty: interviewState.current_difficulty,
          },
        }),
      });

      const newState = await response.json();

      // Update consecutive good answers based on score change
      const previousScore =
        interviewState.category_scores?.[interviewState.current_category] || 0;
      const newScore =
        newState.category_scores?.[interviewState.current_category] || 0;

      if (newScore > previousScore) {
        setTopicProgress((prev) => ({
          ...prev,
          consecutiveGoodAnswers: prev.consecutiveGoodAnswers + 1,
        }));
      } else {
        setTopicProgress((prev) => ({
          ...prev,
          consecutiveGoodAnswers: 0,
        }));
      }

      await fetchNextQuestion(answerText);
    } catch (error) {
      console.error("Error submitting answer:", error);
      addSystemMessage(
        "There was an error processing your answer. Please try again."
      );
    }
  };

  const addSystemMessage = (text) => {
    const message = {
      id: Date.now().toString(),
      text,
      sender: "model",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setIsLoading(true);

    await fetchNextQuestion(newMessage);
    setIsLoading(false);
  };

  const handleEndInterview = () => {
    setIsInterviewActive(false);
    setIsTimerRunning(false);
    // If you need to notify the parent component (VideoInterview)
    if (props.onEndInterview) {
      props.onEndInterview();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-200">
      {isInterviewActive ? (
        <>
          {/* Header with Timer and End Button */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="ml-3 font-semibold text-gray-800 dark:text-white">
                Technical Interview Assistant
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-grow w-64">
                <Timer 
                  initialTime={45 * 60} 
                  onTimeEnd={handleEndInterview} 
                  isRunning={isTimerRunning}
                />
              </div>
              <button
                onClick={handleEndInterview}
                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1"
                title="End Interview"
              >
                <XCircle size={16} />
                <span>End</span>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <MessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={handleSendMessage}
            disabled={isLoading}
            placeholder="Type your answer..."
          />
        </>
      ) : (
        /* Report Card View */
        <div className="h-full overflow-y-auto p-4">
          <ReportCard 
            categories={interviewState?.categories || ["HTML", "CSS", "JavaScript"]} 
            messageCount={messages.filter(m => m.sender === 'user').length}
            messages={messages}
          />
        </div>
      )}
    </div>
  );
}
