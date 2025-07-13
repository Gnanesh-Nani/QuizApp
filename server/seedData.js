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
  },
  {
    title: 'AdTech Essentials',
    description: 'A comprehensive quiz covering foundational and advanced AdTech concepts.',
    timeLimit: 30,
    questions: [
      {
        question: 'What is the primary goal of an advertiser in digital advertising?',
        options: [
          'To create content for publishers',
          'To get its product/service in front of its target audience',
          'To develop mobile apps',
          'To manage publisher websites'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which pricing model charges advertisers for every 1,000 impressions?',
        options: [
          'CPC (Cost Per Click)',
          'CPA (Cost Per Action)',
          'CPM (Cost Per Mille)',
          'CPI (Cost Per Install)'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is a "viewable impression" according to the IAB standard?',
        options: [
          'An impression counted when an ad loads on a page',
          'An impression where at least 50% of the ad is visible for at least 1 second',
          'An impression that results in a click',
          'An impression that leads to a conversion'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is NOT a common monetization method for publishers?',
        options: [
          'Digital ads',
          'Paywalls',
          'Selling user passwords',
          'Affiliate marketing'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the main function of a Demand-Side Platform (DSP)?',
        options: [
          'To help publishers sell ad inventory',
          'To allow advertisers to buy ad inventory programmatically',
          'To block fraudulent ads',
          'To create ad creatives'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which platform helps publishers sell their inventory to multiple ad exchanges?',
        options: [
          'DSP (Demand-Side Platform)',
          'DMP (Data Management Platform)',
          'SSP (Supply-Side Platform)',
          'CDN (Content Delivery Network)'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the role of a Data Management Platform (DMP)?',
        options: [
          'To serve ads to users',
          'To collect, store, and organize audience data for targeting',
          'To verify ad viewability',
          'To design ad creatives'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is a "walled garden" in digital advertising?',
        options: [
          'Google',
          'An independent ad exchange',
          'A small publisher blog',
          'A niche ad network'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the key difference between programmatic direct and RTB?',
        options: [
          'Programmatic direct uses auctions, while RTB does not',
          'RTB uses auctions, while programmatic direct has fixed prices',
          'Programmatic direct is only for mobile ads',
          'RTB is manual, while programmatic direct is automated'
        ],
        correctAnswer: 1
      },
      {
        question: 'In a second-price auction, what does the winning bidder pay?',
        options: [
          'Their full bid amount',
          'The second-highest bid plus $0.01',
          'A fixed CPM rate',
          'The average of all bids'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the main advantage of header bidding for publishers?',
        options: [
          'It guarantees 100% fill rates',
          'It allows multiple demand sources to compete simultaneously',
          'It eliminates the need for ad servers',
          'It reduces the need for advertisers'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is a drawback of waterfalling?',
        options: [
          'It increases transparency in pricing',
          'It causes latency due to sequential passbacks',
          'It only works with Google Ad Exchange',
          'It requires no technical setup'
        ],
        correctAnswer: 1
      },
      {
        question: 'What does the OpenRTB protocol facilitate?',
        options: [
          'Direct deals between advertisers and publishers',
          'Real-time bidding between AdTech platforms',
          'Manual insertion orders',
          'Creative design automation'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which pricing model is most commonly used in affiliate marketing?',
        options: [
          'CPM',
          'CPC',
          'CPA',
          'Flat fee'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the purpose of a "floor price" in programmatic auctions?',
        options: [
          'To set the maximum bid an advertiser can place',
          'To ensure publishers don’t sell inventory below a minimum CPM',
          'To cap advertiser spending',
          'To block low-quality ads'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which entity typically provides ad verification services?',
        options: [
          'DSPs',
          'Advertisers',
          'Third-party vendors like DoubleVerify or IAS',
          'Publishers'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is "bid shading" in programmatic advertising?',
        options: [
          'A tactic to hide bids from competitors',
          'An algorithm that helps advertisers optimize bids in first-price auctions',
          'A way to reduce ad fraud',
          'A method to block non-viewable impressions'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is NOT a common ad format?',
        options: [
          '300x250 (Medium Rectangle)',
          '728x90 (Leaderboard)',
          '1920x1080 (Full HD)',
          '160x600 (Wide Skyscraper)'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the primary benefit of private marketplace (PMP) deals?',
        options: [
          'They are always cheaper than open auctions',
          'They provide access to premium inventory for select advertisers',
          'They eliminate the need for DSPs',
          'They only work for mobile apps'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which organization sets standards for digital advertising, such as ad formats?',
        options: [
          'FTC (Federal Trade Commission)',
          'IAB (Interactive Advertising Bureau)',
          'W3C (World Wide Web Consortium)',
          'FCC (Federal Communications Commission)'
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