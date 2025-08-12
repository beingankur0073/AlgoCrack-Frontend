import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./utils/protectedRoute.jsx";
import Layout from "./Layout/Layout.jsx";

// Landing page
const Start = lazy(() => import("./pages/User/Start.jsx"));

// User pages
const Learn = lazy(() => import("./pages/User/Learn.jsx"));
const AuthPage = lazy(() => import("./pages/User/Authpage.jsx"));
const Main = lazy(() => import("./pages/User/Main.jsx"));
const Problem = lazy(() => import("./pages/User/Problem"));
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const Leaderboard = lazy(() => import("./pages/User/Leaderboard.jsx"));

// Admin pages
const AdminUsersAnalytics = lazy(() => import("./pages/Admin/AdminUsersAnalytics.jsx"));
const AdminProblemsAnalytics = lazy(() => import("./pages/Admin/AdminProblemsAnalytics.jsx"));
const AdminLearnAnalytics = lazy(() => import("./pages/Admin/AdminLearnAnalytics.jsx"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashBoard.jsx"));

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1f2937", color: "#fff" },
        }}
        containerStyle={{ position: "fixed", top: 16, right: 16 }}
      />
      <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Start />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected User & Admin Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/main" element={<Main />} />
            <Route path="/problems/:id" element={<Problem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/learn" element={<Learn />} />

            {/* Admin */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users-analytics" element={<AdminUsersAnalytics />} />
            <Route path="/admin/problems-analytics" element={<AdminProblemsAnalytics />} />
            <Route path="/admin/learn-analytics" element={<AdminLearnAnalytics />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
