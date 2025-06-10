import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Main from "./pages/Main.jsx";
import Problem from "./pages/Problem";
import ProtectedRoute from "./utils/protectedRoute.jsx"; // import
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile.jsx";

const App = () => {
  return (
   
    <Router>
     <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937", // Tailwind's bg-gray-800
            color: "#fff",
          },
        }}
        containerStyle={{ position: 'fixed', top: 16, right: 16 }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <Problem />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


      </Routes>
    </Router>
 
  );
};

export default App;
