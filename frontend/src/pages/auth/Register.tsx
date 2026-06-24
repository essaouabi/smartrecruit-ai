import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaRobot,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "recruiter", // Valeur par défaut
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Compte créé avec succès.");

      // Redirection dynamique basée sur le rôle
      if (response.data.user.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Erreur lors de la création du compte.");
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
          Créer un compte
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Compte SmartRecruit AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom complet */}
          <div>
            <label className="block font-semibold mb-2 text-[#0b3d2e]">Nom complet</label>
            <div className="flex items-center border rounded-2xl px-4 py-4 bg-gray-50">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="fullname"
                placeholder="Mohamed Amine"
                className="bg-transparent outline-none w-full"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-2 text-[#0b3d2e]">Email</label>
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

          {/* Mot de passe */}
          <div>
            <label className="block font-semibold mb-2 text-[#0b3d2e]">Mot de passe</label>
            <div className="flex items-center border rounded-2xl px-4 py-4 bg-gray-50">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 caractères"
                className="bg-transparent outline-none w-full"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Type de compte (MODIFIÉ) */}
          <div>
            <label className="block font-semibold mb-2 text-[#0b3d2e]">Type de compte</label>
            <div className="flex items-center border rounded-2xl px-4 py-4 bg-gray-50">
              <FaUsers className="text-gray-400 mr-3" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-gray-700 font-semibold"
              >
                <option value="recruiter">Recruteur / RH</option>
                <option value="candidate">Candidat</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b3d2e] hover:bg-[#145443] text-white py-4 rounded-2xl font-bold text-lg transition disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8">
          Vous avez déjà un compte ?
          <Link to="/login" className="text-[#0b3d2e] font-bold ml-2 hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;