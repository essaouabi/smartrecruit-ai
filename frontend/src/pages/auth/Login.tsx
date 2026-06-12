// ===============================
// IMPORTS
// ===============================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

import {
  FaEnvelope,
  FaLock,
  FaRobot,
} from "react-icons/fa";

import { motion } from "framer-motion";

// ===============================
// LOGIN COMPONENT
// ===============================

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Connexion réussie.");

      navigate("/recruiter-dashboard");
    } catch (error: any) {
      console.log(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Erreur connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf4ef] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-xl p-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-[#0b3d2e] text-white flex items-center justify-center text-3xl shadow-lg">
            <FaRobot />
          </div>
        </div>

        <h1 className="text-4xl font-black text-center text-[#0b3d2e] mb-3">
          SmartRecruit AI
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Connexion recruteur RH
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-2 text-[#0b3d2e]">
              Email
            </label>

            <div className="flex items-center border rounded-2xl px-4 py-4 bg-gray-50">
              <FaEnvelope className="text-gray-400 mr-3" />

              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="bg-transparent outline-none w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-[#0b3d2e]">
              Mot de passe
            </label>

            <div className="flex items-center border rounded-2xl px-4 py-4 bg-gray-50">
              <FaLock className="text-gray-400 mr-3" />

              <input
                type="password"
                name="password"
                placeholder="********"
                className="bg-transparent outline-none w-full"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b3d2e] hover:bg-[#145443] text-white py-4 rounded-2xl font-bold text-lg transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8">
          Vous n’avez pas de compte ?
          <Link
            to="/register"
            className="text-[#0b3d2e] font-bold ml-2 hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;