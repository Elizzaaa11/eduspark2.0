# EduSpark 2.0 Backend

EduSpark 2.0 is a backend API for a hybrid extracurricular learning platform that connects students, mentors, learning centres, and administrators. The system supports online and offline learning, attendance, assignments, payments, progress tracking, and course discovery.

## Features

- User authentication with JWT
- Role-based access control
- Student, mentor, centre, and admin roles
- Course management and discovery
- Mentor and centre verification flow
- Enrollment and scheduling logic
- Online and offline class support
- Assignment creation and student submissions
- Mock monthly payment flow
- Progress tracking
- Admin dashboard statistics

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- Helmet
- CORS
- express-rate-limit

## Project Structure

```text
eduspark-backend/
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── validators/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Installation

1. Open the project folder:
   ```bash
   cd eduspark-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file if needed:
   ```bash
   cp .env.example .env
   ```
4. Update the values in `.env`.

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/eduspark
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Health Check

```http
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "EduSpark API is running"
}
```

## Phase 1 Status

This phase includes:
- Project setup
- Express server initialization
- MongoDB connection
- Environment variables
- Health endpoint

## Next Phases

The project will continue with the remaining user, mentor, centre, course, enrollment, and admin features in the order specified in the implementation plan.
