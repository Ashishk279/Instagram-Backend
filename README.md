## Social Media Backend
This repository contains the backend for a social media application built using Node.js and Express. It includes user authentication, profile management, post creation, commenting, liking, following, and real-time chat functionality using Socket.IO.

# Table of Contents
Installation
Configuration
Usage
API Endpoints
WebSocket Events
Packages Used
License

# Installation
Clone the repository:
git clone https://github.com/Ashishk279/Instagram-Backend
cd Instagram-Backend

# Install dependencies:
npm install

# Create a .env file in the root directory and add the following environment variables:
# env

PORT=8000
MONGODB_URL=your_mongodb_connection_string
DB_NAME=your_db_name_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=expired_in (10d)
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=expired_in

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USERNAME=your_email_user
EMAIL_PASSWORD=your_email_password


# Configuration
bcrypt: For hashing passwords.
cloudinary: For handling image uploads.
cookie-parser: For parsing cookies.
cors: For enabling Cross-Origin Resource Sharing.
dotenv: For managing environment variables.
express: For building the server.
i18n: For internationalization.
joi: For data validation.
jsonwebtoken: For creating and verifying JSON Web Tokens.
mongoose: For MongoDB object modeling.
multer: For handling multipart/form-data, especially for file uploads.
nodemailer: For sending emails.
nodemon: For automatically restarting the server during development.
otp-generator: For generating one-time passwords.
socket.io: For real-time bidirectional event-based communication.
uuid: For generating unique identifiers.

# Usage
Start the server:
npm start

Access the server at:
http://localhost:8000

# API Endpoints
# User Routes
Signup: POST /signup
Verify Email: POST /verify
Resend Verification Email: POST /resend
Login: POST /login
Logout: POST /logout (requires JWT)
Edit Profile: POST /details (requires JWT, file upload)
Get User: GET /getuser (requires JWT)
Change Profile Picture: POST /changephoto (requires JWT, file upload)
Change Password: POST /changepassword (requires JWT)
Post Routes
Create Post: POST /post (requires JWT, file upload)
Delete Post: PATCH /posts/:id (requires JWT)
Get All Posts: GET /post (requires JWT)
Post Status: GET /status (requires JWT)
Follow Routes
Find User: GET /search (requires JWT)
Follow User: POST /follow (requires JWT)
Unfollow User: DELETE /unfollow (requires JWT)
Get Followers: GET /followers (requires JWT)
Get Following: GET /following (requires JWT)
View Following Content: GET /following-content (requires JWT)
Comment Routes
Comment on Post: POST /p/:postid/comment (requires JWT)
Edit Comment on Post: PATCH /p/:postid/edit (requires JWT)
Remove Comment on Post: PATCH /p/:postid/remove (requires JWT)
Like Routes
Like Post: POST /p/:postid/like (requires JWT)
Dislike Post: DELETE /p/:postid/dislike (requires JWT)

# Socket.io Events
Connection
Authenticate User: When a user connects, they must be authenticated using a JWT.
Chat
Connect to Chat: Join a chat room with connectToChat.
Send Message: Send a message to a chat room with sendMessage.
Receive Message: Listen for messages in a chat room with receiveMessage.
Message Received: Acknowledge a message has been read with messageReceived.
Disconnect from Chat: Leave a chat room with disconnectToChat.

# License
This project is licensed under the MIT License. See the LICENSE file for details.