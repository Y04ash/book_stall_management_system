import React from "react";
import { Home, PlusCircle, Flag, User } from "lucide-react";
import { Navigate } from "react-router-dom";
const Footer = () => {
const navigate = Navigate()
  return (
    <footer className="bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-200 text-gray-800 shadow-inner pt-5">
      {/* Navigation Section */}
      <div className="flex justify-around items-center py-4">
        <a
          onClick={() => navigate("/home")}
          className="flex flex-col items-center hover:text-indigo-600 transition"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-sm">Home</span>
        </a>

        <a
          onClick={() => navigate("/add-camp")}
          className="flex flex-col items-center hover:text-indigo-600 transition"
        >
          <PlusCircle className="w-6 h-6 mb-1" />
          <span className="text-sm">Add Camp</span>
        </a>

        <a
          onClick={() => navigate("/campaign")}
          className="flex flex-col items-center hover:text-indigo-600 transition"
        >
          <Flag className="w-6 h-6 mb-1" />
          <span className="text-sm">Campaign</span>
        </a>

        <a
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center hover:text-indigo-600 transition"
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-sm">Profile</span>
        </a>
      </div>

      {/* Developer Credit Section */}
      <div className="text-center py-3 text-xs sm:text-sm text-gray-700">
        <p>
          Developed by <span className="font-semibold text-gray-900">Yash</span>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:yashranbhare2020@gmail.com"
            className="text-indigo-600 hover:underline"
          >
            yashranbhare2020@gmail.com
          </a>
        </p>
        <p>
          Contact:{" "}
          <a
            href="tel:+917977323923"
            className="text-indigo-600 hover:underline"
          >
            +91 7977323923
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
