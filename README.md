# AI Apply Assistant - Backend

Backend API server for the AI Apply Assistant application, providing authentication, user management, and CV handling services.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **CV Management**: Upload, store, and manage CV documents
- **File Storage**: Cloudinary integration for file uploads
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer for email functionality
- **Security**: Password hashing with bcrypt
- **CORS Support**: Configured for frontend communication
- **Docker Support**: Containerized deployment

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Password Hashing**: bcrypt
- **Development**: nodemon for hot reloading
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Docker & Docker Compose (for containerized setup)

## 🚀 Getting Started

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd ai-apply-assist-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-apply-assist
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**

   Using Docker Compose:
   ```bash
   docker-compose up -d
   ```

   Or ensure MongoDB is running locally on port 27017.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **API will be available at**: `http://localhost:5000`

### Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

## 📜 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (currently not implemented)

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
│   ├── db.js        # Database connection
│   └── loadEnv.js   # Environment variables
├── controllers/      # Route controllers
│   ├── authController.js
│   ├── cvController.js
│   └── userController.js
├── middlewares/      # Custom middlewares
│   └── authMiddleware.js
├── models/          # Mongoose models
│   └── User.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── cvRoutes.js
│   └── userRoutes.js
├── utils/           # Utility functions
│   └── supabase.js
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /logout` - User logout

### User Routes (`/api/user`)
- User management endpoints

### CV Routes (`/api/cv`)
- CV upload, retrieval, and management endpoints

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (defaults to 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `EMAIL_USER` | Email service username | Yes |
| `EMAIL_PASS` | Email service password | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |

## 🐳 Docker Deployment

The application includes Docker support for easy deployment:

- **Dockerfile**: Node.js application container
- **docker-compose.yml**: MongoDB database service

To deploy:
```bash
docker-compose up -d --build
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication with refresh tokens
- CORS configuration for frontend communication
- Cookie-based token storage
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Support

For support or questions, please contact the development team.</content>
<filePath>d:\Personal\Ai-Apply-Assistance\ai-apply-assist-backend\README.md