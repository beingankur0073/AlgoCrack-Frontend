// src/Layout/UserLayout.jsx
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import backImg from "../assets/back.jpg";
import Header from "../components/Header.jsx";

const UserLayout = () => {
  return (
    <div
      className="relative flex flex-col min-h-screen text-white overflow-auto"
      style={{
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/40 z-0" />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
