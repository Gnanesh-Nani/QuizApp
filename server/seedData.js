const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
require('dotenv').config();

const sampleQuizzes = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    timeLimit: 15,
    questions: [
      {
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: [
          'var myVariable;',
          'variable myVariable;',
          'v myVariable;',
          'declare myVariable;'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which method is used to add an element to the end of an array?',
        options: [
          'push()',
          'pop()',
          'shift()',
          'unshift()'
        ],
        correctAnswer: 0
      },
      {
        question: 'What does the "===" operator check for?',
        options: [
          'Value equality only',
          'Value and type equality',
          'Type equality only',
          'Reference equality'
        ],
        correctAnswer: 1
      },
      {
        question: 'How do you create a function in JavaScript?',
        options: [
          'function myFunction() {}',
          'function = myFunction() {}',
          'function: myFunction() {}',
          'def myFunction() {}'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the output of console.log(typeof null)?',
        options: [
          'null',
          'undefined',
          'object',
          'number'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    title: 'React Basics',
    description: 'Test your understanding of React fundamentals including components, props, and state.',
    timeLimit: 20,
    questions: [
      {
        question: 'What is a React component?',
        options: [
          'A JavaScript function that returns HTML',
          'A CSS class',
          'A database table',
          'An API endpoint'
        ],
        correctAnswer: 0
      },
      {
        question: 'How do you pass data to a child component?',
        options: [
          'Using state',
          'Using props',
          'Using context',
          'Using refs'
        ],
        correctAnswer: 1
      },
      {
        question: 'What hook is used to manage state in functional components?',
        options: [
          'useEffect',
          'useState',
          'useContext',
          'useReducer'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the correct way to render a list in React?',
        options: [
          'Using a for loop',
          'Using map() with a key prop',
          'Using forEach()',
          'Using while loop'
        ],
        correctAnswer: 1
      },
      {
        question: 'What does JSX stand for?',
        options: [
          'JavaScript XML',
          'JavaScript Extension',
          'JavaScript Syntax',
          'JavaScript Expression'
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    title: 'Node.js and Express',
    description: 'Test your knowledge of Node.js and Express.js framework.',
    timeLimit: 25,
    questions: [
      {
        question: 'What is Node.js?',
        options: [
          'A frontend framework',
          'A JavaScript runtime environment',
          'A database',
          'A web browser'
        ],
        correctAnswer: 1
      },
      {
        question: 'How do you create an Express server?',
        options: [
          'express.createServer()',
          'express()',
          'new Express()',
          'Express.create()'
        ],
        correctAnswer: 1
      },
      {
        question: 'What middleware is used to parse JSON requests?',
        options: [
          'express.json()',
          'express.urlencoded()',
          'express.static()',
          'express.cors()'
        ],
        correctAnswer: 0
      },
      {
        question: 'How do you define a GET route in Express?',
        options: [
          'app.get(path, handler)',
          'app.route(path, handler)',
          'app.define(path, handler)',
          'app.create(path, handler)'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is middleware in Express?',
        options: [
          'A database',
          'Functions that have access to request and response objects',
          'A template engine',
          'A testing framework'
        ],
        correctAnswer: 1
      }
    ]
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Insert sample quizzes
    const insertedQuizzes = await Quiz.insertMany(sampleQuizzes);
    console.log(`Inserted ${insertedQuizzes.length} quizzes`);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 