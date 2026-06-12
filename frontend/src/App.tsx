// ===============================
// IMPORTS
// ===============================

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ===============================
// PAGES
// ===============================

// HOME
import Home from "./pages/Home";

// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// RECRUITER
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CVAnalyzer from "./pages/recruiter/CVAnalyzer";
import Jobs from "./pages/recruiter/Jobs";
import Candidates from "./pages/recruiter/Candidates";
import AIAssistant from "./pages/recruiter/AIAssistant";
import Monitoring from "./pages/recruiter/Monitoring";
import DataPipeline from "./pages/recruiter/DataPipeline";

// ===============================
// PROTECTED ROUTE
// ===============================

const ProtectedRoute = ({
  children,
}: any) => {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;

};

// ===============================
// APP
// ===============================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* CANDIDATES */}

        <Route
          path="/candidates"
          element={
            <ProtectedRoute>
              <Candidates />
            </ProtectedRoute>
          }
        />

        {/* CV ANALYZER */}

        <Route
          path="/cv-analyzer"
          element={
            <ProtectedRoute>
              <CVAnalyzer />
            </ProtectedRoute>
          }
        />

        {/* JOBS */}

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        {/* AI ASSISTANT */}

        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        {/* MONITORING */}

        <Route
          path="/monitoring"
          element={
            <ProtectedRoute>
              <Monitoring />
            </ProtectedRoute>
          }
        />

        {/* DATA PIPELINE */}

        <Route
          path="/data-pipeline"
          element={
            <ProtectedRoute>
              <DataPipeline />
            </ProtectedRoute>
          }
        />

        {/* PAGE INCONNUE */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

// ===============================
// EXPORT
// ===============================

export default App;