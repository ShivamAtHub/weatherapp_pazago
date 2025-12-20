# Weather Agent Chat Interface

A frontend-only Weather Agent chat application built using React, Vite, and Tailwind CSS.
The application allows users to ask natural language questions about weather conditions and receive responses from an AI-powered weather agent.

This project was developed as part of a frontend engineering assignment and focuses on UI clarity, clean state handling, and real-world API integration considerations.


## FEATURES

- Single-page chat interface
- Conversational UI with user and agent messages
- Empty-state landing view with contextual copy
- Loading and error handling
- Dark and light mode support
- Responsive layout for mobile and desktop
- Clean separation between routing and page logic
- Agent responses are rendered using Markdown to preserve headings, lists, and readability for long-form weather outputs.


## TECH STACK

- React (Hooks)
- Vite
- Tailwind CSS
- React Router
- Fetch API
- Vitest


## PROJECT STRUCTURE

src/\
├── components/\
│ └── WeatherChat.jsx       - Main chat page (all UI + logic)\
├── App.jsx                 - Routing\
├── main.jsx                - App entry point\
├── vite.config.js\
└── package.json\

App.jsx is intentionally kept minimal and handles routing only, while WeatherChat.jsx contains all chat-related logic and UI.
> Basic UI-level tests are included alongside components using Vitest.


**Design decision:**
This is a single-screen assignment with one API interaction. All chat-related logic (state, API calls, UI rendering) is intentionally kept inside WeatherChat.jsx to avoid unnecessary abstraction and overengineering.


## API INTEGRATION

POST https://api-dev.provue.ai/api/webapp/agent/test-agent

REQUEST BODY
```
{
  "prompt": "What's the weather in Mumbai?",
  "stream": false
}
```

- No authentication or API key is required
- The API returns a non-streaming JSON response
- This endpoint works correctly when tested via Postman


## TESTING

Basic automated tests are included to verify core UI behavior:
- Chat input renders correctly
- Send button is disabled for empty messages

Tests are implemented using Vitest and React Testing Library.


## RUNNING THE PROJECT LOCALLY

**Prerequisites:**
- Node.js (v18 or higher recommended)
- npm or yarn

**Steps:**
```
git clone https://github.com/ShivamAtHub/weatherapp_pazago.git
cd weatherapp_pazago
npm install
npm run dev
```

The application will be available at:
```
http://localhost:5173
```

## DEPLOYMENT

This project is deployed at: 
```
https://weatheragentchat-eta.vercel.app/
```


## SUMMARY

This project demonstrates:
- Clean frontend architecture
- Proper handling of unstable or ambiguous APIs
- Real-world understanding of CORS and browser security
- UI and UX decisions appropriate for a scoped engineering assignment
- Includes optional enhancements such as chat export, sound effects, message search, and basic UI testing.

The implementation prioritizes clarity, correctness, and professionalism over unnecessary complexity.


## AUTHOR

[GitHub](https://github.com/ShivamAtHub)  
[LinkedIn](https://www.linkedin.com/in/shivamdarekar2206/)