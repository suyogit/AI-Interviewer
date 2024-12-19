export const chatData = [
  {
    id: '1',
    text: "Hi! Welcome to the interview. Let's start with a basic question. Can you explain what the MERN stack is?",
    sender: 'model',
    timestamp: '9:00 AM'
  },
  {
    id: '2',
    text: "Sure! MERN stands for MongoDB, Express.js, React, and Node.js. It's a technology stack used for building full-stack web applications.",
    sender: 'user',
    timestamp: '9:02 AM'
  },
  {
    id: '3',
    text: "That's correct! Since you mentioned full-stack web applications, can you explain the role of MongoDB in the MERN stack?",
    sender: 'model',
    timestamp: '9:03 AM'
  },
  {
    id: '4',
    text: "MongoDB is a NoSQL database that stores data in a JSON-like format. It serves as the database layer in the MERN stack.",
    sender: 'user',
    timestamp: '9:04 AM'
  },
  {
    id: '5',
    text: "Good! Since MongoDB stores data in JSON-like format, how does this format benefit the integration with the rest of the stack?",
    sender: 'model',
    timestamp: '9:06 AM'
  },
  {
    id: '6',
    text: "The JSON-like format makes it easier to integrate with Node.js and Express.js, as they natively handle JSON, ensuring seamless data flow between the server and database.",
    sender: 'user',
    timestamp: '9:07 AM'
  },
  {
    id: '7',
    text: "Great point! Moving on, you mentioned Node.js. Can you explain how Express.js complements Node.js in this stack?",
    sender: 'model',
    timestamp: '9:08 AM'
  },
  {
    id: '8',
    text: "Express.js is a framework for Node.js that simplifies handling routes, requests, and middleware, making it easier to build server-side applications.",
    sender: 'user',
    timestamp: '9:09 AM'
  },
  {
    id: '9',
    text: "Exactly! Since you mentioned handling routes, can you describe how you would organize routes in a large Express application?",
    sender: 'model',
    timestamp: '9:10 AM'
  },
  {
    id: '10',
    text: "I would use a modular approach by separating routes into different files based on features or resources, and then use Express Router to manage them.",
    sender: 'user',
    timestamp: '9:11 AM'
  },
  {
    id: '11',
    text: "Nice! Let’s talk about React now. You mentioned it's used for building user interfaces. How would you handle state management in a large React application?",
    sender: 'model',
    timestamp: '9:12 AM'
  },
  {
    id: '12',
    text: "In a large React application, I might use Context API for shared state or Redux for more complex state management. Both provide ways to handle global state efficiently.",
    sender: 'user',
    timestamp: '9:13 AM'
  },
  {
    id: '13',
    text: "Good! Since Redux is often used, can you explain how middleware like Redux Thunk or Redux Saga helps in handling side effects?",
    sender: 'model',
    timestamp: '9:14 AM'
  },
  {
    id: '14',
    text: "Redux Thunk allows you to write action creators that return functions instead of plain objects, enabling asynchronous logic. Redux Saga, on the other hand, uses generators to handle complex side effects more elegantly.",
    sender: 'user',
    timestamp: '9:15 AM'
  }
];
