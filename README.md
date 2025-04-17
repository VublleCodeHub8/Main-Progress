<p align="center">
  <img src="https://img.shields.io/badge/-%F0%9F%9A%80%20TERMINAS%20IDE-000000?style=for-the-badge&logoColor=white" alt="Terminas Banner" />
</p>

<h1 align="center">🌐 Online IDE (Terminas)</h1>

<p align="center">
  <em>The next generation cloud development environment</em>
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
  <b>🚀 Deploy Instantly</b> &nbsp;•&nbsp;
  <b>🤝 Collaborate Seamlessly</b>
</p>

<p align="center">
  <a href="#-quick-start">Getting Started</a> •
  <a href="#-features">Features</a> •
  <a href="docs/">Documentation</a> •
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<hr>

## ⚡ Overview

Terminas is a powerful online IDE that revolutionizes the way developers work with containerized environments. Built with modern technologies, it offers:

## 📚 API Documentation

The project includes comprehensive API documentation using Swagger/OpenAPI:

- **Access**: Visit `/api-docs` endpoint after starting the server 
- **Features**:
  - Interactive API testing interface
  - Detailed endpoint descriptions
  - Request/response schemas
  - Authentication requirements
- **Endpoints Categories**:
  - 🔐 Authentication (signup, signin, etc.)
  - 👤 User Management
  - 🐳 Container Operations
  - 👨‍💼 Admin Controls

All API endpoints are secured with JWT authentication and proper error handling.

<div align="center">
<table>
<tr>
<td align="center" width="50%">

### 🎯 Key Highlights

<p align="left">
  
- 🔥 **Real-time collaboration** with zero latency
- 🐳 **Instant containers** with auto-scaling
- 🎨 **Custom workspaces** with themes
- 🔒 **Enterprise security** with SSO
- 🚀 **One-click deployment** to any cloud

</p>

</td>
<td align="center" width="50%">

### 💡 Perfect for

<p align="left">

- 👥 **Teams**
  - Real-time collaboration
  - Shared environments
- 🎓 **Education**
  - Virtual classrooms
  - Assignment tracking
- 🏢 **Enterprise**
  - Custom deployment
  - Advanced security

</p>

</td>
</tr>
</table>
</div>

## 🚀 Quick Start

### 📦 Prerequisites

<table>
<tr>
<td width="60%">

Make sure you have these essential tools installed:

| Tool | Version | Purpose |
|:-----|:--------|:---------|
| [Node.js](https://nodejs.org/) | v16+ | Runtime Environment |
| [Docker](https://www.docker.com/get-started) | Latest | Containerization |
| [Git](https://git-scm.com/downloads) | Latest | Version Control |
| [npm](https://www.npmjs.com/) | Latest | Package Manager |

</td>
<td width="40%">

### 📊 System Requirements

- **CPU**: 2+ cores
- **RAM**: 4GB minimum
- **Storage**: 1GB free space
- **OS**: Linux/macOS/Windows
- **Network**: Broadband connection

</td>
</tr>
</table>

### 🔄 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/VublleCodeHub8/Main-Progress.git
cd Main-Progress

# 2. Frontend setup
cd frontend
npm install
npm run dev    # 🌐 http://localhost:5173

# 3. Backend setup
cd ../backend
npm install
npm run start  # 🔌 http://localhost:3000
```

## 🛠️ Technology Stack

<table>
<tr>
<td width="33%">
<h3 align="center">🎨 Frontend</h3>

- ⚛️ React.js
- 🎨 Tailwind CSS
- 🎬 Framer Motion
- 📊 Redux Toolkit
- 🔄 React Router 6
</td>
<td width="33%">
<h3 align="center">⚙️ Backend</h3>

- 🟢 Node.js
- 🚂 Express.js
- 🐳 Docker API
- 🔑 JWT Auth
- 📦 Socket.IO
- 🚀 Redis Cache
</td>
<td width="33%">
<h3 align="center">🔧 DevOps</h3>

- 📦 Docker
- 🔄 GitHub Actions
- 🚀 PM2
- 📊 Prometheus
- 🔍 ELK Stack
</td>
</tr>
</table>

## 🗄️ Redis Cache Setup

```bash
# Start Redis Stack (includes Redis + RedisInsight)
docker run -d --name redis-stack -p 6380:6379 -p 8001:8001 redis/redis-stack:latest

# If container stops, restart it
docker start redis-stack

# To view Redis logs
docker logs redis-stack

# Access RedisInsight dashboard
# Open http://localhost:8001 in your browser
```

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🔥 Core Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure OAuth & JWT based auth |
| 🐳 Containers | Instant container deployment |
| 📝 Templates | Pre-configured environments |
| 📊 Monitoring | Real-time resource tracking |

</td>
<td width="50%">

### ✨ Advanced Features

| Feature | Description |
|---------|-------------|
| 🤝 Collaboration | Real-time pair programming |
| 🎯 Custom Templates | Save & share environments |
| 🔄 Auto Scaling | Dynamic resource allocation |
| 🔍 Search | Full-text code search |

</td>
</tr>
</table>

## 🐛 Known Issues & Roadmap

<table>
<tr>
<td width="50%">

### 🚧 Current Issues

- ⚠️ Template selection UX
- ⚠️ Container log consistency
- ⚠️ UI responsiveness
- ⚠️ Login page validation

</td>
<td width="50%">

### 🎯 Coming Soon

- 📱 Mobile responsive design
- 🌐 Multi-region support
- 🔒 2FA authentication
- 🤖 AI code completion

</td>
</tr>
</table>

## 🔧 Development Setup

<table>
<tr>
<td width="60%">

### 📝 Essential Steps

1. 🐳 Start Docker daemon
2. 🔌 Check ports 5173 & 3000
3. 🔒 Configure environment
4. 📦 Install dependencies
5. 🚀 Run development servers

</td>
<td width="40%">

### 🔍 Verification

```bash
# Check Docker
docker --version

# Verify ports
netstat -tuln

# Test setup
npm test
```

</td>
</tr>
</table>

## 📂 Project Structure

<pre>
📦 <b>Main-Progress/</b>
├── <span title="Frontend"><b>🖥️ frontend/</b></span>
│   ├── <b>📂 public/</b>           <i>// Static assets</i>
│   ├── <b>📂 src/</b>
│   │   ├── <b>🖼️ assets/</b>      <i>// Images and static assets</i>
│   │   ├── <b>🧩 components/</b>  <i>// Reusable UI components</i>
│   │   ├── <b>📄 pages/</b>       <i>// Route pages</i>
│   │   ├── <b>🗃️ store/</b>       <i>// Redux store setup</i>
│   │   ├── <b>🛠️ utils/</b>       <i>// Utility functions</i>
│   │   ├── <b>📚 lib/</b>         <i>// Library/helper code</i>
│   │   ├── <b>🧪 newComp/</b>     <i>// Experimental components</i>
│   │   ├── <b>📄 App.jsx</b>, ... <i>// Main app files</i>
│   ├── <b>📄 package.json</b>     <i>// Frontend dependencies</i>
│   └── ...
│
├── <span title="Backend"><b>🗄️ backend/</b></span>
│   ├── <b>📂 controllers/</b>     <i>// Route controllers</i>
│   ├── <b>📂 models/</b>          <i>// Data models</i>
│   ├── <b>📂 routes/</b>          <i>// API routes</i>
│   ├── <b>📂 middlewares/</b>     <i>// Express middlewares</i>
│   ├── <b>📂 util/</b>            <i>// Utility modules</i>
│   ├── <b>📂 public/</b>          <i>// Static/public files</i>
│   ├── <b>📄 app.js</b>           <i>// Main server entry</i>
│   ├── <b>📄 swagger.js</b>       <i>// Swagger/OpenAPI setup</i>
│   ├── <b>📄 redis-server.js</b>  <i>// Redis integration</i>
│   ├── <b>📄 .env</b>             <i>// Backend environment</i>
│   └── <b>📄 package.json</b>     <i>// Backend dependencies</i>
│
├── <span title="Dockerized Language Environments"><b>🐳 dockerBackend/</b></span>
│   ├── <b>📂 GCC/</b>             <i>// GCC C/C++ env</i>
│   ├── <b>📂 Node/</b>            <i>// Node.js env</i>
│   ├── <b>📂 Python/</b>          <i>// Python env</i>
│   ├── <b>📂 Ubutnu/</b>          <i>// Ubuntu base env</i>
│   └── <b>📂 tesing/</b>          <i>// Testing env</i>
│
├── <b>📝 .gitignore</b>           <i>// Git ignore rules</i>
├── <b>📄 LICENSE</b>              <i>// License info</i>
├── <b>📄 package.json</b>         <i>// Root dependencies/meta</i>
├── <b>📄 package-lock.json</b>    <i>// Root lockfile</i>
└── <b>📄 README.md</b>            <i>// Project documentation</i>
</pre>

> <b>Tip:</b> Each main folder contains its own <code>package.json</code> and configuration files as needed. See individual folders for more details.

---

<div align="center">

### 🌟 Support Terminas

[![Star on GitHub](https://img.shields.io/github/stars/VublleCodeHub8/Main-Progress.svg?style=social)](https://github.com/VublleCodeHub8/Main-Progress/stargazers)
[![Follow on Twitter](https://img.shields.io/twitter/follow/terminas?style=social)](https://twitter.com/terminas)

<sub>Made with ❤️ by Terminas Team</sub>

</div>