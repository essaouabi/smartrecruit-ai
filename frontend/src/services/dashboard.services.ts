// ======================================================
// SERVICE DASHBOARD - SMARTRECRUIT AI
// ======================================================
// Ce service permet de communiquer avec l'API Dashboard
// du backend Node.js.
// Il récupère les statistiques globales utilisées dans
// le tableau de bord recruteur.
// ======================================================

import axios from "axios";

// ======================================================
// URL DE L'API DASHBOARD
// ======================================================
// Le backend tourne localement sur le port 5000.
// La route utilisée est : /api/dashboard/stats
// ======================================================

const API_URL = "http://localhost:5000/api/dashboard";

// ======================================================
// TYPE DES STATISTIQUES DASHBOARD
// ======================================================
// Ce type permet d'avoir une structure claire des données
// reçues depuis le backend.
// ======================================================

export interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  totalAnalyses: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  acceptedCandidates: number;
  rejectedCandidates: number;
  generatedAt: string;
}

// ======================================================
// TYPE D'UNE OFFRE D'EMPLOI
// ======================================================

export interface Job {
  id: number;
  title: string;
  company?: string;
  location?: string;
  description?: string;
  created_at?: string;
}

// ======================================================
// TYPE D'UN CANDIDAT
// ======================================================

export interface Candidate {
  id: number;
  fullname?: string;
  name?: string;
  email?: string;
  score?: number;
  decision?: string;
  skills?: string;
  created_at?: string;
}

// ======================================================
// TYPE DE LA RÉPONSE DASHBOARD
// ======================================================

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  latestJobs: Job[];
  topCandidates: Candidate[];
  latestCandidates: Candidate[];
}

// ======================================================
// RÉCUPÉRATION DES STATISTIQUES DASHBOARD
// ======================================================
// Cette fonction :
// 1. récupère le token JWT stocké dans le navigateur ;
// 2. envoie une requête GET au backend ;
// 3. ajoute le token dans le header Authorization ;
// 4. retourne les statistiques du dashboard.
// ======================================================

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.get<DashboardResponse>(
    `${API_URL}/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};