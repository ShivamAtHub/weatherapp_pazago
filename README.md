# Weather Agent Chat Interface

A frontend-only Weather Agent chat application built using React, Vite, and Tailwind CSS.
The application allows users to ask natural language questions about weather conditions and receive responses from an AI-powered weather agent.

This project was developed as part of a frontend engineering assignment and focuses on UI clarity, clean state handling, and real-world API integration considerations.

======================================================================

FEATURES

- Single-page chat interface
- Conversational UI with user and agent messages
- Empty-state landing view with contextual copy
- Loading and error handling
- Dark and light mode support
- Responsive layout for mobile and desktop
- Clean separation between routing and page logic

======================================================================

TECH STACK

- React (Hooks)
- Vite
- Tailwind CSS
- React Router
- Fetch API

======================================================================

PROJECT STRUCTURE

src/
├── components/
│ └── WeatherChat.jsx       - Main chat page (all UI + logic)
├── App.jsx                 - Routing
├── main.jsx                - App entry point
├── vite.config.js
└── package.json

Design decision:
This is a single-screen assignment with one API interaction. All chat-related logic (state, API calls, UI rendering) is intentionally kept inside WeatherChat.jsx to avoid unnecessary abstraction and overengineering.

======================================================================

API INTEGRATION

POST https://api-dev.provue.ai/api/webapp/agent/test-agent

REQUEST BODY

{
  "prompt": "What's the weather in Mumbai?",
  "stream": false
}

- No authentication or API key is required
- The API returns a non-streaming JSON response
- This endpoint works correctly when tested via Postman

======================================================================

CORS NOTE (IMPORTANT)

While the updated API works correctly in Postman, browser-based requests are blocked due to missing CORS headers on the backend.

This results in errors such as:
- Blocked by CORS policy
- 500 Internal Server Error when proxied locally

---------------------------------------------------------------------

PRODUCTION BEHAVIOR

In production deployments (Vercel, Netlify, etc.), browser CORS restrictions still apply.
The application handles this gracefully by showing an error state instead of crashing.

Proper resolution would require backend-side CORS configuration or a backend-for-frontend
layer, which is outside the scope of this assignment.

======================================================================

RUNNING THE PROJECT LOCALLY

PREREQUISITES

- Node.js (v18 or higher recommended)
- npm or yarn

STEPS

git clone [<repository-url>](https://github.com/ShivamAtHub/weatherapp_pazago.git)
cd weatherapp_pazago
npm install
npm run dev

The application will be available at:

http://localhost:5173

======================================================================

DEPLOYMENT

This project is deployed at:


Note:
The API may not respond in production due to CORS restrictions. This is a backend limitation and has been documented above.

======================================================================

UI BEHAVIOR NOTES

- The large heading and subtext are shown only when no messages exist (empty state)
- Once a message is sent, the interface transitions fully into chat mode
- The design mirrors modern conversational UIs for familiarity and usability

======================================================================

ASSUMPTIONS AND CONSTRAINTS

- No authentication flow was required or documented
- The API is assumed to be a development or test endpoint
- Error handling and user feedback are implemented for all failure cases

======================================================================

SUMMARY

This project demonstrates:
- Clean frontend architecture
- Proper handling of unstable or ambiguous APIs
- Real-world understanding of CORS and browser security
- UI and UX decisions appropriate for a scoped engineering assignment

The implementation prioritizes clarity, correctness, and professionalism over unnecessary complexity.

======================================================================

AUTHOR

https://github.com/ShivamAtHub
https://www.linkedin.com/in/shivamdarekar2206/
