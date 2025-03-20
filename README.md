# Development Environment Platform

A modern platform for managing development environments using Docker containers. This project provides a user-friendly interface for creating, managing, and deploying containerized development environments.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/downloads)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Clone the Repository

```bash
git clone https://github.com/VublleCodeHub8/Main-Progress.git
cd Main-Progress
```

### Setting Up the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Setting Up the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run start
```
The backend server will run on `http://localhost:3000`

## 🛠️ Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Redux for state management
- React Router for navigation

### Backend
- Node.js
- Express.js
- Docker API
- JWT Authentication

## 🌟 Features

- **User Authentication**: Secure login and signup system
- **Container Management**: Create, start, stop, and delete containers
- **Template System**: Pre-configured development environments
- **Real-time Logs**: Monitor container logs in real-time
- **Resource Management**: Track container resource usage

## 🐛 Known Issues

### Login Page
- Trailing spaces in input fields are currently included
- Direct navigation from root to signup needs fixing

### User Dashboard
- Template selection in container creation needs improvement
- Container logs may show inconsistencies
- UI responsiveness needs enhancement

## 🔧 Development Setup Tips

1. Ensure Docker daemon is running before starting the backend
2. Use `.env` files for environment variables (templates provided)
3. Make sure ports 5173 (frontend) and 3000 (backend) are available

## 📝 Environment Variables

### Frontend (.env)

