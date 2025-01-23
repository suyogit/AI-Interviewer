// 'use client';
// import React, { useState } from 'react';
// import { chatData } from '../../chatData';
// import { ChatMessage } from './ChatMessage';
// import { MessageInput } from './MessageInput';
// export function ChatBox() {
//   const [messages, setMessages] = useState(chatData);
//   const [newMessage, setNewMessage] = useState('');

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       id: Date.now().toString(),
//       text: newMessage,
//       sender: 'user',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setMessages([...messages, message]);
//     setNewMessage('');
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       {/* Chat Header */}
//       <div className="flex items-center p-4 border-b">
//         <img src="ai.svg" alt="" />
//         {/* <div className="w-10 h-10 bg-gray-300 rounded-full"></div> */}
//         <div className="ml-3">
//           <h2 className="font-semibold text-black">AI Interviewer</h2>
//           <div className='flex items-center gap-1 '>
//             <div className='h-2 w-2 bg-green-500 rounded-full'></div>
//           <p className="text-sm text-gray-500">Online</p>

//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//   {messages.map((message) => (
//     <ChatMessage key={message.id} message={message} />
//   ))}
// </div>

//       {/* Message Input */}
//       <MessageInput
//         value={newMessage}
//         onChange={setNewMessage}
//         onSubmit={handleSendMessage}
//       />
//     </div>
//   );
// }

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { ChatMessage } from './ChatMessage';
// import { MessageInput } from './MessageInput';

// export function ChatBox() {
//   const [messages, setMessages] = useState([]); // Initialize with an empty array
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Fetch chat history from API
//   useEffect(() => {
//     async function fetchMessages() {
//       try {
//         const response = await fetch('http://localhost:8080/api/interview/start', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const data = await response.json();
//         setMessages(data.asked_questions || []);
//       } catch (error) {
//         console.error('Failed to fetch messages:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchMessages();
//   }, []);

//   // Send a new message to the API
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       text: newMessage,
//       sender: 'user',
//     };

//     // Optimistically update UI
//     setMessages([...messages, { ...message, id: Date.now().toString(), timestamp: new Date().toLocaleTimeString() }]);
//     setNewMessage('');

//     try {
//       const response = await fetch('http://localhost:8080/api/interview/answer', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           state: {
//             current_category: 'HTML',
//             current_difficulty: 'Easy',
//             start_time: Date.now(),
//             last_answer: message.text,
//             asked_questions: messages,
//             total_score: 0.0,
//             category_scores: {},
//             remaining_time: 2700,
//           },
//           answer: { text: message.text },
//         }),
//       });

//       const data = await response.json();
//       setMessages((prev) => [...prev, { ...data, sender: 'AI', id: Date.now().toString(), timestamp: new Date().toLocaleTimeString() }]);
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       {/* Chat Header */}
//       <div className="flex items-center p-4 border-b">
//         <img src="ai.svg" alt="" />
//         <div className="ml-3">
//           <h2 className="font-semibold text-black">AI Interviewer</h2>
//           <div className="flex items-center gap-1">
//             <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//             <p className="text-sm text-gray-500">Online</p>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           messages.map((message) => (
//             <ChatMessage key={message.id} message={message} />
//           ))
//         )}
//       </div>

//       {/* Message Input */}
//       <MessageInput
//         value={newMessage}
//         onChange={setNewMessage}
//         onSubmit={handleSendMessage}
//       />
//     </div>
//   );
// }

// cloude
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { ChatMessage } from './ChatMessage';
// import { MessageInput } from './MessageInput';

// export function ChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [interviewState, setInterviewState] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Initialize interview when component mounts
//   useEffect(() => {
//     initializeInterview();
//   }, []);

//   // Initialize interview session
//   const initializeInterview = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/interview/start', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       setInterviewState(data);

//       // Get first question
//       fetchNextQuestion(data);
//     } catch (error) {
//       console.error('Error initializing interview:', error);
//       addSystemMessage('Sorry, there was an error starting the interview. Please try again.');
//     }
//   };

//   // Fetch next question
//   const fetchNextQuestion = async (currentState) => {
//     try {
//       const response = await fetch('http://localhost:8080/api/interview/question', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           current_category: currentState.current_category,
//           current_difficulty: currentState.current_difficulty,
//           last_answer: currentState.last_answer,
//           asked_questions: currentState.asked_questions,
//           remaining_time: currentState.remaining_time,
//         }),
//       });

//       const data = await response.json();
//       addSystemMessage(data.question);
//     } catch (error) {
//       console.error('Error fetching question:', error);
//       addSystemMessage('Sorry, there was an error getting the next question. Please try again.');
//     }
//   };

//   // Submit answer
//   const submitAnswer = async (answerText) => {
//     try {
//       const response = await fetch('http://localhost:8080/api/interview/answer', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           state: interviewState,
//           answer: {
//             text: answerText
//           }
//         }),
//       });

//       const newState = await response.json();
//       setInterviewState(newState);

//       // Get next question
//       fetchNextQuestion(newState);
//     } catch (error) {
//       console.error('Error submitting answer:', error);
//       addSystemMessage('Sorry, there was an error processing your answer. Please try again.');
//     }
//   };

//   // Helper to add a system message
//   const addSystemMessage = (text) => {
//     const message = {
//       id: Date.now().toString(),
//       text,
//       sender: 'model',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };
//     setMessages(prev => [...prev, message]);
//   };

//   // Handle sending a message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       id: Date.now().toString(),
//       text: newMessage,
//       sender: 'user',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setMessages(prev => [...prev, message]);
//     setNewMessage('');
//     setIsLoading(true);

//     // Submit answer to API
//     await submitAnswer(newMessage);
//     setIsLoading(false);
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       {/* Chat Header */}
//       <div className="flex items-center p-4 border-b">
//         <img src="ai.svg" alt="" />
//         <div className="ml-3">
//           <h2 className="font-semibold text-black">AI Interviewer</h2>
//           <div className="flex items-center gap-1">
//             <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//             <p className="text-sm text-gray-500">Online</p>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         {messages.map((message) => (
//           <ChatMessage key={message.id} message={message} />
//         ))}
//         {isLoading && (
//           <div className="text-gray-500 italic">AI is typing...</div>
//         )}
//       </div>

//       {/* Message Input */}
//       <MessageInput
//         value={newMessage}
//         onChange={setNewMessage}
//         onSubmit={handleSendMessage}
//         disabled={isLoading}
//       />
//     </div>
//   );
// }

//cloude 2
// "use client";
// import React, { useState, useEffect } from "react";
// import { ChatMessage } from "./ChatMessage";
// import { MessageInput } from "./MessageInput";

// export function EnhancedChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [interviewState, setInterviewState] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);

//   useEffect(() => {
//     initializeInterview();
//   }, []);

//   const initializeInterview = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/interview/start",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await response.json();
//       setInterviewState(data);

//       // Welcome message
//       addSystemMessage(
//         "Hello! I'll be conducting your MERN stack technical interview today. We'll start with some basic concepts and progressively move to more complex topics based on your responses. Are you ready to begin?"
//       );

//       // Get first question after user confirms
//     } catch (error) {
//       console.error("Error initializing interview:", error);
//       addSystemMessage(
//         "There was an error starting the interview. Please refresh to try again."
//       );
//     }
//   };

//   const fetchNextQuestion = async (currentState, previousAnswer) => {
//     try {
//       // Enhance the request body with more context
//       const requestBody = {
//         current_category: currentState.current_category,
//         current_difficulty: currentState.current_difficulty,
//         last_answer: previousAnswer,
//         asked_questions: currentState.asked_questions,
//         remaining_time: currentState.remaining_time,
//         category_scores: currentState.category_scores,
//         total_score: currentState.total_score,
//       };

//       const response = await fetch(
//         "http://localhost:8080/api/interview/question",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       const data = await response.json();

//       // Add contextual introduction based on category switch or difficulty change
//       if (currentState.current_category !== interviewState?.current_category) {
//         addSystemMessage(
//           `Great! Let's switch gears and talk about ${currentState.current_category}. ${data.question}`
//         );
//       } else if (
//         currentState.current_difficulty !== interviewState?.current_difficulty
//       ) {
//         addSystemMessage(
//           `You're doing well! Let's try some ${currentState.current_difficulty} level questions. ${data.question}`
//         );
//       } else {
//         addSystemMessage(data.question);
//       }

//       setInterviewState(currentState);
//     } catch (error) {
//       console.error("Error fetching question:", error);
//       addSystemMessage(
//         "There was an error getting the next question. Please try again."
//       );
//     }
//   };

//   const evaluateAnswer = async (answerText) => {
//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/interview/answer",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             state: interviewState,
//             answer: {
//               text: answerText,
//               category: interviewState.current_category,
//               difficulty: interviewState.current_difficulty,
//             },
//           }),
//         }
//       );

//       const newState = await response.json();

//       // Calculate score change
//       const previousScore =
//         interviewState.category_scores[interviewState.current_category] || 0;
//       const newScore =
//         newState.category_scores[interviewState.current_category] || 0;
//       const scoreImproved = newScore > previousScore;

//       // Provide contextual feedback
//       if (scoreImproved) {
//         addSystemMessage(
//           "Good answer! You've demonstrated solid understanding. Let me ask a follow-up question..."
//         );
//       } else {
//         addSystemMessage(
//           "That's a start, but let me help you understand this better. Consider also mentioning key concepts like [related topics]. Now, let me ask..."
//         );
//       }

//       // Fetch next question with the new state
//       await fetchNextQuestion(newState, answerText);
//     } catch (error) {
//       console.error("Error submitting answer:", error);
//       addSystemMessage(
//         "There was an error processing your answer. Please try again."
//       );
//     }
//   };

//   const addSystemMessage = (text) => {
//     const message = {
//       id: Date.now().toString(),
//       text,
//       sender: "model",
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//     setMessages((prev) => [...prev, message]);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       id: Date.now().toString(),
//       text: newMessage,
//       sender: "user",
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages((prev) => [...prev, message]);
//     setNewMessage("");
//     setIsLoading(true);

//     await evaluateAnswer(newMessage);
//     setIsLoading(false);
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       <div className="flex items-center p-4 border-b">
//         <div className="ml-3">
//           <h2 className="font-semibold text-black">
//             MERN Stack Technical Interview
//           </h2>
//           <div className="flex items-center gap-1">
//             <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//             <p className="text-sm text-gray-500">AI Interviewer Active</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         {messages.map((message) => (
//           <ChatMessage key={message.id} message={message} />
//         ))}
//         {isLoading && (
//           <div className="text-gray-500 italic">Evaluating response...</div>
//         )}
//       </div>

//       <MessageInput
//         value={newMessage}
//         onChange={setNewMessage}
//         onSubmit={handleSendMessage}
//         disabled={isLoading}
//         placeholder="Type your answer here..."
//       />
//     </div>
//   );
// }

//cloude 3

// "use client";
// import React, { useState, useEffect } from "react";
// import { ChatMessage } from "./ChatMessage";
// import { MessageInput } from "./MessageInput";

// export function EnhancedChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [interviewState, setInterviewState] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [askedQuestions, setAskedQuestions] = useState([]);

//   useEffect(() => {
//     initializeInterview();
//   }, []);

//   const initializeInterview = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/interview/start",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await response.json();
//       setInterviewState(data);

//       addSystemMessage(
//         "Hello! I'm your MERN stack interviewer today. We'll explore your knowledge through a conversation, starting with fundamentals and adapting based on your responses. Let's begin with some basics - what's your experience with the MERN stack?"
//       );
//     } catch (error) {
//       console.error("Error initializing interview:", error);
//       addSystemMessage(
//         "There was an error starting the interview. Please refresh to try again."
//       );
//     }
//   };

//   // Function to extract keywords from answer
//   const extractKeywords = (answer) => {
//     const keywords = answer
//       .toLowerCase()
//       .match(
//         /\b(react|node|express|mongodb|html|css|javascript|api|database|component|state|props|routing|async|promise|rest|crud|hooks|middleware|authentication)\b/g
//       );
//     return [...new Set(keywords || [])];
//   };

//   const fetchNextQuestion = async (currentState, previousAnswer) => {
//     try {
//       // Extract keywords from previous answer
//       const keywords = extractKeywords(previousAnswer || "");

//       // Update asked questions array
//       const updatedAskedQuestions = [...askedQuestions];
//       if (currentState.current_question) {
//         updatedAskedQuestions.push({
//           question: currentState.current_question,
//           category: currentState.current_category,
//           difficulty: currentState.current_difficulty,
//         });
//       }
//       setAskedQuestions(updatedAskedQuestions);

//       const requestBody = {
//         current_category: currentState.current_category,
//         current_difficulty: currentState.current_difficulty,
//         last_answer: previousAnswer,
//         asked_questions: updatedAskedQuestions,
//         remaining_time: currentState.remaining_time,
//         keywords: keywords, // Send extracted keywords to help API choose related questions
//       };

//       const response = await fetch(
//         "http://localhost:8080/api/interview/question",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       const data = await response.json();

//       // Generate contextual follow-up based on previous answer
//       let followUpMessage = "";
//       if (previousAnswer) {
//         if (keywords.length > 0) {
//           followUpMessage = `I see you mentioned ${keywords.join(
//             ", "
//           )}. Let's dig deeper. `;
//         }

//         if (
//           currentState.current_difficulty !== interviewState?.current_difficulty
//         ) {
//           followUpMessage += `Since you're showing good understanding, let's try some ${currentState.current_difficulty} level questions. `;
//         }
//       }

//       addSystemMessage(followUpMessage + data.question);
//       setInterviewState(currentState);
//     } catch (error) {
//       console.error("Error fetching question:", error);
//       addSystemMessage(
//         "There was an error getting the next question. Please try again."
//       );
//     }
//   };

//   const evaluateAnswer = async (answerText) => {
//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/interview/answer",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             state: {
//               ...interviewState,
//               asked_questions: askedQuestions,
//             },
//             answer: {
//               text: answerText,
//               keywords: extractKeywords(answerText),
//               category: interviewState.current_category,
//               difficulty: interviewState.current_difficulty,
//             },
//           }),
//         }
//       );

//       const newState = await response.json();

//       // Generate contextual feedback based on answer
//       const keywords = extractKeywords(answerText);
//       let feedback = "";

//       if (keywords.length > 0) {
//         feedback = `You've shown good knowledge about ${keywords.join(", ")}. `;

//         // Suggest related concepts that weren't mentioned
//         const relatedConcepts = {
//           react: ["hooks", "components", "props"],
//           node: ["express", "middleware", "async"],
//           mongodb: ["database", "crud", "schema"],
//           // Add more related concept mappings
//         };

//         const mentionedTopics = new Set(keywords);
//         const suggestions = keywords.flatMap((keyword) =>
//           (relatedConcepts[keyword] || []).filter(
//             (concept) => !mentionedTopics.has(concept)
//           )
//         );

//         if (suggestions.length > 0) {
//           feedback += `Consider also exploring related concepts like ${suggestions
//             .slice(0, 2)
//             .join(", ")}. `;
//         }
//       }

//       addSystemMessage(feedback);
//       await fetchNextQuestion(newState, answerText);
//     } catch (error) {
//       console.error("Error submitting answer:", error);
//       addSystemMessage(
//         "There was an error processing your answer. Please try again."
//       );
//     }
//   };

// const addSystemMessage = (text) => {
//   const message = {
//     id: Date.now().toString(),
//     text,
//     sender: "model",
//     timestamp: new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     }),
//   };
//   setMessages((prev) => [...prev, message]);
// };

// const handleSendMessage = async (e) => {
//   e.preventDefault();
//   if (!newMessage.trim()) return;

//   const message = {
//     id: Date.now().toString(),
//     text: newMessage,
//     sender: "user",
//     timestamp: new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     }),
//   };

//   setMessages((prev) => [...prev, message]);
//   setNewMessage("");
//   setIsLoading(true);

//   await evaluateAnswer(newMessage);
//   setIsLoading(false);
// };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       <div className="flex items-center p-4 border-b">
//         <div className="ml-3">
//           <h2 className="font-semibold text-black">
//             MERN Stack Technical Interview
//           </h2>
//           <div className="flex items-center gap-1">
//             <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//             <p className="text-sm text-gray-500">AI Interviewer Active</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         {messages.map((message) => (
//           <ChatMessage key={message.id} message={message} />
//         ))}
//         {isLoading && (
//           <div className="text-gray-500 italic">Analyzing your response...</div>
//         )}
//       </div>

//       <MessageInput
//         value={newMessage}
//         onChange={setNewMessage}
//         onSubmit={handleSendMessage}
//         disabled={isLoading}
//         placeholder="Type your answer here..."
//       />
//     </div>
//   );
// }

//cloude 4
// "use client";
// import React, { useState, useEffect } from "react";
// import { ChatMessage } from "./ChatMessage";
// import { MessageInput } from "./MessageInput";

// export function EnhancedChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [interviewState, setInterviewState] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [askedQuestions, setAskedQuestions] = useState([]);
//   const [topicProgress, setTopicProgress] = useState({
//     currentTopic: 0,
//     consecutiveGoodAnswers: 0,
//   });

//   // Define MERN stack topic progression
//   const topicSequence = [
//     { name: "HTML", minQuestions: 3 },
//     { name: "CSS", minQuestions: 3 },
//     { name: "JavaScript", minQuestions: 4 },
//     { name: "React", minQuestions: 4 },
//     { name: "Node.js", minQuestions: 4 },
//     { name: "Express", minQuestions: 3 },
//     { name: "MongoDB", minQuestions: 4 },
//     { name: "APIs", minQuestions: 3 },
//   ];

//   useEffect(() => {
//     initializeInterview();
//   }, []);

//   const initializeInterview = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/interview/start",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await response.json();
//       setInterviewState({
//         ...data,
//         current_category: topicSequence[0].name,
//         current_difficulty: "Easy",
//       });

//       addSystemMessage(
//         "Hello! I'm your MERN stack interviewer today. We'll have a comprehensive discussion covering HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and APIs. I'll adapt the difficulty based on your responses. Let's begin - what's your experience with web development?"
//       );
//     } catch (error) {
//       console.error("Error initializing interview:", error);
//       addSystemMessage(
//         "There was an error starting the interview. Please refresh to try again."
//       );
//     }
//   };

//   const shouldAdvanceTopic = (currentTopic, questionsAsked) => {
//     const topicQuestions = questionsAsked.filter(
//       (q) => q.category.toLowerCase() === currentTopic.toLowerCase()
//     );

//     return (
//       topicQuestions.length >=
//         topicSequence[topicProgress.currentTopic].minQuestions &&
//       topicProgress.consecutiveGoodAnswers >= 2
//     );
//   };

//   const determineNextTopic = () => {
//     if (shouldAdvanceTopic(interviewState.current_category, askedQuestions)) {
//       const nextTopicIndex = topicProgress.currentTopic + 1;
//       if (nextTopicIndex < topicSequence.length) {
//         setTopicProgress({
//           currentTopic: nextTopicIndex,
//           consecutiveGoodAnswers: 0,
//         });
//         return topicSequence[nextTopicIndex].name;
//       }
//     }
//     return interviewState.current_category;
//   };

//   const extractKeywords = (answer) => {
//     const keywords = answer
//       .toLowerCase()
//       .match(
//         /\b(react|node|express|mongodb|html|css|javascript|api|database|component|state|props|routing|async|promise|rest|crud|hooks|middleware|authentication)\b/g
//       );
//     return [...new Set(keywords || [])];
//   };

//   const fetchNextQuestion = async (currentState, previousAnswer) => {
//     try {
//       const keywords = extractKeywords(previousAnswer || "");
//       const nextTopic = determineNextTopic();

//       const updatedAskedQuestions = [...askedQuestions];
//       if (currentState.current_question) {
//         updatedAskedQuestions.push({
//           question: currentState.current_question,
//           category: currentState.current_category,
//           difficulty: currentState.current_difficulty,
//         });
//       }
//       setAskedQuestions(updatedAskedQuestions);

//       const requestBody = {
//         current_category: nextTopic,
//         current_difficulty: currentState.current_difficulty,
//         last_answer: previousAnswer,
//         asked_questions: updatedAskedQuestions,
//         remaining_time: currentState.remaining_time,
//         keywords: keywords,
//       };

//       const response = await fetch(
//         "http://localhost:8080/api/interview/question",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       const data = await response.json();

//       let transitionMessage = "";
//       if (nextTopic !== currentState.current_category) {
//         transitionMessage = `Great work on ${currentState.current_category}! Let's move on to ${nextTopic}. `;
//       }

//       const contextMessage =
//         keywords.length > 0
//           ? `I notice you're familiar with ${keywords.join(", ")}. `
//           : "";

//       addSystemMessage(transitionMessage + contextMessage + data.question);

//       setInterviewState({
//         ...currentState,
//         current_category: nextTopic,
//       });
//     } catch (error) {
//       console.error("Error fetching question:", error);
//       addSystemMessage(
//         "There was an error getting the next question. Please try again."
//       );
//     }
//   };

//   const evaluateAnswer = async (answerText) => {
//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/interview/answer",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             state: {
//               ...interviewState,
//               asked_questions: askedQuestions,
//             },
//             answer: {
//               text: answerText,
//               keywords: extractKeywords(answerText),
//               category: interviewState.current_category,
//               difficulty: interviewState.current_difficulty,
//             },
//           }),
//         }
//       );

//       const newState = await response.json();

//       // Update consecutive good answers based on score change
//       const previousScore =
//         interviewState.category_scores?.[interviewState.current_category] || 0;
//       const newScore =
//         newState.category_scores?.[interviewState.current_category] || 0;

//       if (newScore > previousScore) {
//         setTopicProgress((prev) => ({
//           ...prev,
//           consecutiveGoodAnswers: prev.consecutiveGoodAnswers + 1,
//         }));
//       } else {
//         setTopicProgress((prev) => ({
//           ...prev,
//           consecutiveGoodAnswers: 0,
//         }));
//       }

//       await fetchNextQuestion(newState, answerText);
//     } catch (error) {
//       console.error("Error submitting answer:", error);
//       addSystemMessage(
//         "There was an error processing your answer. Please try again."
//       );
//     }
//   };

//   // ... rest of the component (addSystemMessage, handleSendMessage, and render methods) remains the same

//   const addSystemMessage = (text) => {
//     const message = {
//       id: Date.now().toString(),
//       text,
//       sender: "model",
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//     setMessages((prev) => [...prev, message]);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       id: Date.now().toString(),
//       text: newMessage,
//       sender: "user",
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages((prev) => [...prev, message]);
//     setNewMessage("");
//     setIsLoading(true);

//     await evaluateAnswer(newMessage);
//     setIsLoading(false);
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       <div className="flex items-center p-4 border-b">
//         <div className="ml-3">
//           <h2 className="font-semibold text-black">
//             MERN Stack Technical Interview
//           </h2>
//           <div className="flex items-center gap-1">
//             <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//             <p className="text-sm text-gray-500">AI Interviewer Active</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         {messages.map((message) => (
//           <ChatMessage key={message.id} message={message} />
//         ))}
//         {isLoading && (
//           <div className="text-gray-500 italic">Analyzing your response...</div>
//         )}
//       </div>

//       <MessageInput
//         value={newMessage}
//         onChange={setNewMessage}
//         onSubmit={handleSendMessage}
//         disabled={isLoading}
//         placeholder="Type your answer here..."
//       />
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";

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
      const response = await fetch(
        "http://localhost:8080/api/interview/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setInterviewState({
        ...data,
        current_category: topicSequence[0].name,
        current_difficulty: "Easy",
      });

      addSystemMessage(
        "Hello! I'm your MERN stack interviewer today. Let's start with a few questions about HTML."
      );
    } catch (error) {
      console.error("Error initializing interview:", error);
      addSystemMessage(
        "There was an error starting the interview. Please refresh to try again."
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

  const fetchNextQuestion = async (previousAnswer) => {
    try {
      const keywords = extractKeywords(previousAnswer || "");
      const nextTopic = determineNextTopic();

      const updatedAskedQuestions = [...askedQuestions];
      if (interviewState.current_question) {
        updatedAskedQuestions.push({
          question: interviewState.current_question,
          category: interviewState.current_category,
          difficulty: interviewState.current_difficulty,
        });
      }
      setAskedQuestions(updatedAskedQuestions);

      const requestBody = {
        current_category: nextTopic,
        current_difficulty: interviewState.current_difficulty,
        last_answer: previousAnswer,
        asked_questions: updatedAskedQuestions,
        remaining_time: interviewState.remaining_time,
        keywords: keywords,
      };

      const response = await fetch(
        "http://localhost:8080/api/interview/question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      let transitionMessage = "";
      if (nextTopic !== interviewState.current_category) {
        transitionMessage = `Good job on ${interviewState.current_category}! Let's move on to ${nextTopic}. `;
      }

      const contextMessage =
        keywords.length > 0
          ? `You seem knowledgeable about ${keywords.join(", ")}. `
          : "";

      addSystemMessage(transitionMessage + contextMessage + data.question);

      setInterviewState({
        ...interviewState,
        current_category: nextTopic,
      });
    } catch (error) {
      console.error("Error fetching question:", error);
      addSystemMessage(
        "There was an error getting the next question. Please try again."
      );
    }
  };

  const evaluateAnswer = async (answerText) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/interview/answer",
        {
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
        }
      );

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

    await evaluateAnswer(newMessage);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex items-center p-4 border-b">
        <div className="ml-3">
          <h2 className="font-semibold text-black">MERN Stack Interview</h2>
        </div>
      </div>

      <div
        ref={messageContainerRef} // Attach the ref to the message container
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <div className="italic">Analyzing your response...</div>}
        <div ref={messagesEndRef} />{" "}
        {/* Empty div to act as the scroll target */}
      </div>

      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        disabled={isLoading}
        placeholder="Type your answer..."
      />
    </div>
  );
}
