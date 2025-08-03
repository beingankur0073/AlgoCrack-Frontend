# AlgoCrack – Full-Stack Coding Platform

**AlgoCrack** is a comprehensive, full-stack coding platform designed to provide a seamless user experience for writing, executing, and managing code submissions in real-time. Built with modern web technologies, it supports real-time code execution, user authentication, role-based access, and an admin dashboard for problem management and analytics.

---

## 🚀 Features

- **Real-Time Code Execution:**  
  Execute code in multiple languages directly in the browser with instant results.

- **Monaco Editor Integration:**  
  Provides an advanced, VS Code-like in-browser code editor with syntax highlighting and IntelliSense.

- **PrismJS Syntax Highlighting:**  
  Enhanced highlighting for submitted code snippets and saved solutions.

- **User Profiles:**  
  Detailed profile pages where users can upload dynamic profile and cover images via Cloudinary.

- **Submission Tracking:**  
  Keep a detailed history of all your code submissions and track your progress over time.

- **Authentication & Authorization:**  
  - Secure JWT-based login and session management.  
  - Role-based access control to differentiate between normal users and admins.

- **Admin Dashboard:**  
  Manage coding problems, review user activities, and access detailed analytics on platform usage and submissions.

- **State Management with Redux:**  
  Efficient and scalable state management reducing API calls and improving UX responsiveness.

- **Responsive UI:**  
  Built with Tailwind CSS and enhanced with Framer Motion for smooth animations and transitions.

- **Media Upload via Cloudinary:**  
  Efficient and scalable uploading and hosting of user profile and cover images.

- **Deployment:**  
  - Backend hosted on Render for reliability.  
  - Frontend hosted on Vercel for fast CDN delivery and smooth user experience.

---

## 🛠 Technology Stack

| Frontend                          | Backend               | DevOps & Tools        |
|----------------------------------|-----------------------|-----------------------|
| ReactJS                          | Node.js               | Render (Backend host) |
| Redux (State Management)         | Express.js            | Vercel (Frontend host)|
| Tailwind CSS (Styling)           | MongoDB               | Cloudinary (Media)    |
| Framer Motion (Animations)       | JWT (Auth)            | GitHub (Code Repo)    |
| React Query (API Caching)        |                       |                       |
| Monaco Editor (Code Editor)      |                       |                       |
| PrismJS (Syntax Highlighting)    |                       |                       |

---

## 📸 Screenshots

*Add screenshots below to illustrate key features such as:*

- Landing/Home Page
- Code Editor with Monaco Editor
- Profile Page with Image Upload
- Admin Dashboard and Analytics
- Submission List and Code Output

---

## 🎬 Demo Video

*Embed a walkthrough/demo video below.*

- **How to Add:**  
  Upload your demo video to YouTube or another public platform and embed the video link here.

  
  Example (YouTube Markdown Embed):

[![Watch the demo](https://img.youtube

text
*(Replace `<VIDEO_ID>` with your actual YouTube video ID)*

---

## 🌐 Live Demo

[**Visit AlgoCrack Live**](#)  
*Replace the above link with the actual deployed URL once available.*

---

## 📂 Repository Links

- [Backend GitHub Repository](#)  
- [Frontend GitHub Repository](#)  
*Replace `#` with the actual URLs of your GitHub repos.*

---

## 🔐 Authentication & Security

- **JWT Authentication:** Ensures stateless, secure user sessions.
- **Role-Based Access Control:** Only users with admin roles can access sensitive routes and management dashboards.
- **Secure API:** All endpoints are protected via middleware validating authentication and authorization.
- **Password Security:** User passwords are hashed using industry standards before database storage.

---

## ⚡ Getting Started: Running Locally

### 1. Clone the Repositories

    git clone <backend-repo-url>
    git clone <frontend-repo-url>

### 2. Install Dependencies

Navigate into each repository folder and install dependencies:

    cd backend
    npm install

    cd ../frontend
    npm install

### 3. Set Up Environment Variables

Create `.env` files in both backend and frontend with the following variables.

#### Backend `.env`

PORT=5000
MONGODB_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret key>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary cloud name>
CLOUDINARY_API_KEY=<Your Cloudinary API key>
CLOUDINARY_API_SECRET=<Your Cloudinary API secret>



#### Frontend `.env`

REACT_APP_API_BASE_URL=http://localhost:5000/api

text

*Adjust URLs and keys according to your environment and deployment.*

### 4. Start the Servers

In separate terminal windows or tabs:

- Start Backend:

cd backend
npm run dev



- Start Frontend:

cd frontend
npm start



The frontend will usually run on `http://localhost:3000` and the backend on the port specified in your `.env`.

---

## 🧩 Project Structure Overview

### Backend

- `controllers/` – Route controllers managing request logic
- `models/` – Mongoose schemas and models
- `routes/` – API endpoints (users, auth, problems, submissions)
- `middleware/` – Authentication and authorization middleware
- `utils/` – Helper functions (e.g., Cloudinary uploader)
- `server.js` – Application entry point

### Frontend

- `src/components/` – Reusable UI components (Editor, Dashboard, Profile)
- `src/pages/` – Page-level components (Home, Login, Admin)
- `src/redux/` – Redux slices and store setup
- `src/api/` – API client configurations using React Query
- `src/styles/` – Tailwind CSS configurations and custom styles
- `src/App.js` – Root component with routing

---

## 🛡️ Security Considerations

- Passwords are never stored in plain text; they use bcrypt hashing.
- JWT tokens are signed with a strong secret and include expiration.
- API endpoints are protected with authentication and role checks.
- File uploads are validated before processing with Cloudinary.
- Rate limiting can be added to prevent brute force attacks (recommended for production).

---

## 👤 Author

**[Your Name]**  
[Your LinkedIn Profile](#) | [Your Personal Website](#)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Contributing

Contributions to AlgoCrack are welcome! If you have ideas, bug fixes, or features, please:

1. Fork the repositories.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request and describe your changes.

Please make sure your code follows existing style guidelines and passes all tests.

---

## 📚 Additional Resources

- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [PrismJS Syntax Highlighting](https://prismjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query](https://react-query.tanstack.com/)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)

---

Thank you for checking out AlgoCrack! Happy coding! 🚀
