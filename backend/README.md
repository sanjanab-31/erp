# ERP Backend API

Backend API for the ERP Management System built with Node.js and Express.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── .env.example        # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file)

## 📡 API Endpoints

### Health Check
- `GET /health` - Check server status

### Authentication (To be implemented)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Users (To be implemented)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔧 Technologies

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Firebase Admin** - Firebase integration
- **Nodemon** - Development auto-reload

## 📝 License

ISC
