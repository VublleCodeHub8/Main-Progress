<p align="center">
  <img src="https://img.shields.io/badge/-%F0%9F%9A%80%20TERMINAS%20IDE-000000?style=for-the-badge&logoColor=white" alt="Terminas Banner" />
</p>

<h1 align="center">🌐 Terminas - Cloud-Based Development Environment</h1>

<p align="center">
  <em>A powerful online IDE that brings containerized development environments to your browser</em>
</p>

<p align="center">
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-16+-brightgreen?style=flat-square&logo=node.js" alt="Node.js" />
  </a>
  <a href="https://www.docker.com/get-started">
    <img src="https://img.shields.io/badge/Docker-Required-2496ED?style=flat-square&logo=docker" alt="Docker" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/VublleCodeHub8/Main-Progress/stargazers">
    <img src="https://img.shields.io/github/stars/VublleCodeHub8/Main-Progress?style=flat-square" alt="Stars" />
  </a>
</p>

<p align="center">
  <b>🔥 Code Anywhere</b> &nbsp;•&nbsp;
  <b>🐳 Instant Containers</b> &nbsp;•&nbsp;
  <b>📊 Real-time Analytics</b>
</p>

<p align="center">
  <a href="#-what-is-terminas">About</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-quick-start">Getting Started</a> •
  <a href="#-how-it-works">How It Works</a>
</p>

<hr>

## 🎯 What is Terminas?

**Terminas** is a web-based Integrated Development Environment (IDE) that allows developers to write, run, and test code directly in their browser without installing anything locally. Think of it as having a complete development machine accessible from anywhere with an internet connection.

### 💡 The Problem It Solves

- **No Setup Hassles**: Skip the "works on my machine" problem - everyone gets the same environment
- **Instant Access**: Start coding in seconds, not hours of setup time
- **Resource Efficient**: Run heavy development environments without taxing your local machine
- **Collaboration Made Easy**: Share your exact development environment with teammates
- **Multi-Language Support**: Switch between Python, Node.js, C/C++, and more without configuration

### 🎓 Perfect For

| User Type | Use Case |
|-----------|----------|
| 👨‍🎓 **Students** | Learn programming without complex setup, access labs from anywhere |
| 👨‍💻 **Developers** | Quickly test code in isolated environments, collaborate with teams |
| 👨‍🏫 **Educators** | Provide consistent environments for all students, track progress |
| 🏢 **Teams** | Standardize development environments, onboard new members faster |

---

## 🌟 Key Features

### 🔥 Core Functionality

<table>
<tr>
<td width="50%">

#### 🐳 **Container Management**
- Create isolated development environments in seconds
- Pre-configured templates for Python, Node.js, GCC, and Ubuntu
- Real-time terminal access with full shell capabilities
- Automatic cleanup and resource management

#### 🔐 **User Authentication & Roles**
- Secure JWT-based authentication
- Three-tier role system: User, Developer, Admin
- Profile management with customizable settings
- Password reset with OTP verification

</td>
<td width="50%">

#### 📊 **Analytics & Monitoring**
- Real-time container usage statistics
- User activity tracking and insights
- Resource consumption monitoring
- Visual charts and graphs for data analysis

#### 🎨 **Template System**
- Pre-built environments for popular languages
- Custom template creation and sharing
- Template versioning and management
- Quick-start configurations

</td>
</tr>
</table>

### ✨ Advanced Features

<table>
<tr>
<td width="50%">

#### 👥 **Collaboration Tools**
- Share containers with team members
- Public project showcase
- Container history tracking
- Activity logs and audit trails

#### 🔔 **Notification System**
- Real-time updates on container status
- System announcements
- Developer notifications
- Email integration

</td>
<td width="50%">

#### 🛠️ **Developer Tools**
- Integrated code editor with syntax highlighting
- Terminal emulator with full shell access
- File management system
- Bug reporting and feedback system

#### 🎯 **Admin Dashboard**
- User management and role assignment
- Template approval and moderation
- System analytics and insights
- Bug report management
- Contact form submissions

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download Link |
|:-----|:--------|:--------------|
| **Node.js** | v16 or higher | [nodejs.org](https://nodejs.org/) |
| **Docker** | Latest stable | [docker.com](https://www.docker.com/get-started) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/downloads) |
| **MongoDB** | 4.0+ | [mongodb.com](https://www.mongodb.com/try/download/community) |

**System Requirements:**
- CPU: 2+ cores
- RAM: 4GB minimum (8GB recommended)
- Storage: 2GB free space
- OS: Linux, macOS, or Windows with WSL2

### 🔄 Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/VublleCodeHub8/Main-Progress.git
cd Main-Progress

# 2. Set up Redis (for caching)
docker run -d --name redis-stack -p 6380:6379 -p 8001:8001 redis/redis-stack:latest

# 3. Backend setup
cd backend
npm install

# Create .env file with your configuration
# See backend/.env.example for required variables

npm run start  # Server runs on http://localhost:3000

# 4. Frontend setup (in a new terminal)
cd ../frontend
npm install
npm run dev    # App runs on http://localhost:5173
```

### 🔑 Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/terminas

# JWT Secret
JWT_SECRET=your_secret_key_here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6380

# Email (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### ✅ Verify Installation

1. Open http://localhost:5173 in your browser
2. Create a new account
3. Log in and create your first container
4. Access the terminal and run a command

---

## 🏗️ How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │   Terminal   │  │  Code Editor │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Backend                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   REST   │  │ Socket.IO│  │   Auth   │  │  Redis   │   │
│  │   API    │  │  Server  │  │   JWT    │  │  Cache   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Docker Engine                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Python  │  │  Node.js │  │   GCC    │  │  Ubuntu  │   │
│  │Container │  │Container │  │Container │  │Container │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   MongoDB    │
                    │   Database   │
                    └──────────────┘
```

### 🔄 Workflow

1. **User Authentication**: Users sign up/login with JWT-based authentication
2. **Container Creation**: Select a template (Python, Node.js, etc.) and create a container
3. **Real-time Terminal**: Connect to the container via WebSocket for interactive shell access
4. **Code Execution**: Write and run code directly in the containerized environment
5. **Resource Management**: Containers are automatically managed and cleaned up
6. **Data Persistence**: User data, container history, and analytics stored in MongoDB

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Redux Toolkit** - State management
- **React Router 6** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Xterm.js** - Terminal emulator
- **Ace Editor** - Code editor
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **Dockerode** - Docker API integration
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **Redis (ioredis)** - Caching layer
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Swagger** - API documentation
- **Morgan** - Request logging

### DevOps & Infrastructure
- **Docker** - Containerization
- **Redis Stack** - Caching and data structures
- **PM2** - Process management
- **GitHub Actions** - CI/CD (optional)

---

## 📂 Project Structure

```
Main-Progress/
│
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── dashboard/     # User dashboard pages
│   │   │   └── dev/           # Developer tools pages
│   │   ├── store/             # Redux store configuration
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main app component
│   └── package.json
│
├── backend/                     # Express backend server
│   ├── controllers/            # Route controllers
│   ├── models/                 # MongoDB models
│   │   ├── user.js            # User model
│   │   ├── containers.js      # Container model
│   │   ├── template.js        # Template model
│   │   ├── notification.js    # Notification model
│   │   └── bugReport.js       # Bug report model
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── container.js       # Container management
│   │   ├── user.js            # User operations
│   │   ├── admin.js           # Admin operations
│   │   └── dev.js             # Developer operations
│   ├── middlewares/            # Express middlewares
│   │   └── auth.js            # Auth middleware (isAuth, isAdmin, isDev)
│   ├── util/                   # Utility modules
│   ├── app.js                  # Main server file
│   ├── swagger.js              # API documentation setup
│   └── redis-server.js         # Redis configuration
│
└── dockerBackend/               # Docker environment configurations
    ├── GCC/                    # C/C++ development environment
    ├── Node/                   # Node.js environment
    ├── Python/                 # Python environment
    ├── Ubuntu/                 # Base Ubuntu environment
    └── testing/                # Testing environment
```

---

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:

**http://localhost:3000/api-docs**

### Key API Endpoints

#### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Login
- `POST /auth/send-otp` - Request password reset OTP
- `POST /auth/changepass` - Reset password

#### Container Management
- `GET /container/all` - List user's containers
- `POST /container/create` - Create new container
- `DELETE /container/:id` - Delete container
- `GET /container/:id/logs` - Get container logs

#### User Operations
- `GET /getuser` - Get current user profile
- `PUT /user/profile` - Update profile
- `POST /user/addpublic` - Share project publicly
- `POST /user/addbugreport` - Submit bug report
- `POST /user/addcontactus` - Contact form submission

#### Admin Operations (Admin only)
- `GET /admin/users` - List all users
- `POST /admin/roleChange` - Change user role
- `POST /admin/addTemplate` - Add new template
- `GET /admin/bugreports` - View bug reports
- `GET /admin/analytics` - System analytics

#### Developer Operations (Dev/Admin only)
- `POST /dev/addNewTemplate` - Create custom template
- `PUT /dev/updateTemplate` - Update template
- `POST /dev/notification` - Send notifications
- `GET /dev/bugreports` - View bug reports

---

## 👥 User Roles

### 🔵 User (Default)
- Create and manage personal containers
- Use pre-approved templates
- Access personal analytics
- Submit bug reports and feedback

### 🟢 Developer
- All User permissions
- Create and manage custom templates
- Send notifications to users
- View and manage bug reports
- Access developer tools

### 🔴 Admin
- All Developer permissions
- Manage user accounts and roles
- Approve/reject templates
- Access system-wide analytics
- Manage all bug reports and contact submissions
- View container history across all users

---

## 🔧 Configuration & Customization

### Adding New Language Environments

1. Create a new directory in `dockerBackend/` (e.g., `dockerBackend/Go/`)
2. Add a `Dockerfile` with your environment setup
3. Create a template entry in the database via admin panel
4. Users can now select this template when creating containers

### Customizing Templates

Templates are stored in MongoDB and can be managed through:
- Admin panel UI (`/admin/templates`)
- Developer panel (`/dev` routes)
- Direct database manipulation

---

## 🐛 Troubleshooting

### Common Issues

**Docker containers not starting:**
```bash
# Check Docker is running
docker ps

# Check Docker permissions
sudo usermod -aG docker $USER
```

**Redis connection errors:**
```bash
# Restart Redis container
docker restart redis-stack

# Check Redis is accessible
docker logs redis-stack
```

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**MongoDB connection failed:**
```bash
# Ensure MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

---

## 🎯 Roadmap

### Current Features ✅
- ✅ User authentication and authorization
- ✅ Container creation and management
- ✅ Real-time terminal access
- ✅ Template system
- ✅ Admin dashboard
- ✅ Analytics and monitoring
- ✅ Bug reporting system
- ✅ Notification system

### Upcoming Features 🚀
- 📱 Mobile responsive design
- 🤝 Real-time collaboration (multiple users in same container)
- 🔒 Two-factor authentication (2FA)
- 🌐 Multi-region deployment support
- 🤖 AI-powered code completion
- 📦 Container snapshots and restore
- 🔄 Git integration
- 📊 Advanced analytics dashboard

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Docker** for containerization technology
- **Xterm.js** for the terminal emulator
- **Socket.IO** for real-time communication
- **React** and the amazing ecosystem
- All contributors and users of Terminas

---

<div align="center">

### 🌟 Support Terminas

If you find this project helpful, please consider giving it a ⭐️

[![Star on GitHub](https://img.shields.io/github/stars/VublleCodeHub8/Main-Progress.svg?style=social)](https://github.com/VublleCodeHub8/Main-Progress/stargazers)

**Made with ❤️ for developers, by developers**

</div>