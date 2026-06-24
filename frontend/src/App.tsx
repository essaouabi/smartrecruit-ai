import type { ReactNode } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CVAnalyzer from "./pages/recruiter/CVAnalyzer";
import Jobs from "./pages/recruiter/Jobs";
import Candidates from "./pages/recruiter/Candidates";
import CandidateDetails from "./pages/recruiter/CandidateDetails";
import AIAssistant from "./pages/recruiter/AIAssistant";
import Monitoring from "./pages/recruiter/Monitoring";
import DataPipeline from "./pages/recruiter/DataPipeline";
import AuditLogs from "./pages/recruiter/AuditLogs";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateAssistant from "./pages/candidate/CandidateAssistant";
import MyApplications from "./pages/candidate/MyApplications";

// ===============================
// PROTECTED ROUTE
// ===============================

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ===============================
// APP ROUTES
// ===============================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =============================== */}
        {/* CANDIDATE ROUTES */}
        {/* =============================== */}

        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-profile"
          element={
            <ProtectedRoute>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-jobs"
          element={
            <ProtectedRoute>
              <CandidateJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-assistant"
          element={
            <ProtectedRoute>
              <CandidateAssistant />
            </ProtectedRoute>
          }
        />

        {/* =============================== */}
        {/* RECRUITER ROUTES */}
        {/* =============================== */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidates"
          element={
            <ProtectedRoute>
              <Candidates />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidates/:id"
          element={
            <ProtectedRoute>
              <CandidateDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cv-analyzer"
          element={
            <ProtectedRoute>
              <CVAnalyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emplois"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitoring"
          element={
            <ProtectedRoute>
              <Monitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-pipeline"
          element={
            <ProtectedRoute>
              <DataPipeline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit"
          element={<Navigate to="/audit-logs" replace />}
        />

        {/* REDIRECTIONS OPTIONNELLES */}
        <Route
          path="/dashboard"
          element={<Navigate to="/recruiter-dashboard" replace />}
        />

        <Route
          path="/recruiter"
          element={<Navigate to="/recruiter-dashboard" replace />}
        />

        <Route
          path="/candidate"
          element={<Navigate to="/candidate-dashboard" replace />}
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;