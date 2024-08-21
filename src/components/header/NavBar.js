import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoIcon from "@mui/icons-material/Star";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [active, setActive] = useState(false);

  return (
    <nav className="bg-background h-[8vh] flex items-center justify-between bg-opacity-20 absolute text-white border z-10 w-[90vw] font-Josefin mt-2 rounded-2xl shadow-lg p-4">
      <motion.a
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.5, duration: 0.5, ease: "easeInOut" },
        }}
        exit={{ opacity: 0, y: -12 }}
        href="/"
        className="flex items-center gap-2"
      >
        <LogoIcon className="text-3xl" />
        <span className="text-2xl font-bold">Kanban</span>
      </motion.a>
      <div className="flex items-center">
        <div className="lg:hidden">
          <button className="btn btn-ghost" onClick={() => setActive(!active)}>
            <MenuIcon className="h-6 w-6" />
          </button>
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-[8vh] right-0 mt-2 w-[80vw] bg-black bg-opacity-90 rounded-lg shadow-lg z-20"
              >
                <ul className="menu p-4 flex flex-col gap-4">
                  <li>
                    <Link to="/" className="flex items-center gap-2">
                      <HomeIcon className="mb-1" /> Home
                    </Link>
                  </li>
                  {user && (
                    <li>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <DashboardIcon className="mb-1" /> Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    {user ? (
                      <button
                        onClick={logout}
                        className="flex items-center gap-2"
                      >
                        <LogoutIcon className="mb-1" /> Logout
                      </button>
                    ) : (
                      <Link to="/login" className="flex items-center gap-2">
                        <LoginIcon className="mb-1" /> Login
                      </Link>
                    )}
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden lg:flex">
          <ul className="flex items-center justify-between gap-8">
            <li>
              <NavLink to="/" label="Home" icon={<HomeIcon />} />
            </li>
            {user && (
              <li>
                <NavLink
                  to="/dashboard"
                  label="Dashboard"
                  icon={<DashboardIcon />}
                />
              </li>
            )}
            <li>
              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-white text-lg hover:text-primary duration-150 relative"
                >
                  <LogoutIcon />
                  Logout
                  <span
                    style={{
                      transform: "scaleX(1)",
                    }}
                    className="absolute -bottom-0 left-0 right-0 h-1 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out"
                  />
                </button>
              ) : (
                <NavLink to="/login" label="Login" icon={<LoginIcon />} />
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, icon }) => {
  return (
    <Link
      to={to}
      className="relative flex items-center gap-1 text-white text-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:text-yellow-400"
    >
      {icon}
      {label}
    </Link>
  );
};

export default Navbar;
