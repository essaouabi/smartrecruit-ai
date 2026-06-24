import { useState } from "react";
import api from "../services/api";

import {
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

type ImportScrapedJobsButtonProps = {
  onImported?: () => void;
};

type ScrapingResponseData = {
  totalScraped?: number;
  total?: number;
  insertedJobs?: number;
  skippedDuplicates?: number;
};

function ImportScrapedJobsButton({
  onImported,
}: ImportScrapedJobsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);

  const importJobs = async () => {
    try {
      setLoading(true);
      setMessage("");
      setSuccess(null);

      const response = await api.post("/scraping/jobs");

      const data: ScrapingResponseData = response.data?.data || {};

      const totalScraped = data.totalScraped ?? data.total ?? 0;
      const insertedJobs = data.insertedJobs ?? 0;
      const skippedDuplicates = data.skippedDuplicates ?? 0;

      setSuccess(true);

      setMessage(
        `${totalScraped} offres collectées, ${insertedJobs} ajoutées, ${skippedDuplicates} doublons ignorés.`
      );

      if (onImported) {
        await onImported();
      }
    } catch (error: any) {
      console.error("Erreur import scraping :", error);
      console.error("Réponse backend :", error.response?.data);

      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur lors de l'importation des offres.";

      setSuccess(false);
      setMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={importJobs}
        disabled={loading}
        className={`bg-[#0b3d2e] hover:bg-[#145443] text-white px-7 py-4 rounded-2xl font-bold flex items-center gap-3 transition ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"
        }`}
      >
        {loading ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <FaDownload />
        )}

        {loading ? "Importation..." : "Importer des offres"}
      </button>

      {message && (
        <div
          className={`mt-3 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold ${
            success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {success ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationTriangle />
          )}

          <span>{message}</span>
        </div>
      )}
    </div>
  );
}

export default ImportScrapedJobsButton;