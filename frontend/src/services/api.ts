// ===============================
// IMPORT AXIOS
// ===============================

import axios from "axios";

// ===============================
// CREATE API INSTANCE
// ===============================

const api = axios.create({

  // Backend URL
  baseURL:
    "http://localhost:5000/api",

  // Default headers
  headers: {
    "Content-Type":
      "application/json",
  },

});

// ===============================
// REQUEST INTERCEPTOR
// ===============================

api.interceptors.request.use(

  (config) => {

    // Récupérer token
    const token =
      localStorage.getItem("token");

    // Ajouter Authorization header
    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    // Session expirée
    if (
      error.response &&
      error.response.status === 401
    ) {

      // Supprimer session
      localStorage.removeItem("token");

      localStorage.removeItem("user");

      // Redirection login
      window.location.href =
        "/login";

    }

    return Promise.reject(error);

  }

);

// ===============================
// EXPORT API
// ===============================

export default api;