import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./utils/protectedRoute.jsx";
import Layout from "../src/Layout/UserLayout.jsx";
import Learn from "./pages/Learn.jsx";

// Lazy load components
const Login = lazy(() => import("./pages/Login.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const Main = lazy(() => import("./pages/Main.jsx"));
const Problem = lazy(() => import("./pages/Problem"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashBoard.jsx"));

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
          },
        }}
        containerStyle={{ position: "fixed", top: 16, right: 16 }}
      />
      <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Main />} />
            <Route path="/problems/:id" element={<Problem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/learn" element={<Learn/>} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
