import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Main from "./pages/Main.jsx";
import Problem from "./pages/Problem";
import ProtectedRoute from "./utils/protectedRoute.jsx";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile.jsx";
import Layout from "../src/Layout/UserLayout.jsx"; 

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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      
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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
