// ===============================
// IMPORTS
// ===============================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
  FaCloudUploadAlt,
  FaDatabase,
  FaCheckCircle,
  FaTimesCircle,
  FaFileCsv,
  FaPlay,
  FaHistory,
  FaServer,
} from "react-icons/fa";

// ===============================
// TYPES
// ===============================

type ImportHistory = {
  id: number;
  filename: string;
  total_rows: number;
  inserted_rows: number;
  rejected_rows: number;
  created_at: string;
};

// ===============================
// COMPONENT
// ===============================

const DataPipeline = () => {

  // ===============================
  // REFS
  // ===============================

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  // ===============================
  // STATES
  // ===============================

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const [history, setHistory] =
    useState<ImportHistory[]>([]);

  // ===============================
  // LOAD HISTORY
  // ===============================

  const fetchHistory = async () => {

    try {

      const response =
        await api.get(
          "/data/imports"
        );

      setHistory(
        response.data || []
      );

    } catch (error) {

      console.log(error);

    }

  };

  // ===============================
  // LOAD PAGE
  // ===============================

  useEffect(() => {

    fetchHistory();

  }, []);

  // ===============================
  // CHOOSE FILE
  // ===============================

  const handleChooseFile = () => {

    inputRef.current?.click();

  };

  // ===============================
  // FILE CHANGE
  // ===============================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".csv")
    ) {

      alert(
        "Veuillez sélectionner un fichier CSV."
      );

      return;

    }

    setFile(selectedFile);

    setResult(null);

  };

  // ===============================
  // UPLOAD CSV
  // ===============================

  const handleUpload =
    async () => {

      if (!file) {

        alert(
          "Veuillez choisir un fichier CSV."
        );

        return;

      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await api.post(
            "/data/import-csv",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setResult(
          response.data
        );

        fetchHistory();

      } catch (error) {

        console.log(error);

        alert(
          "Erreur pendant l’import CSV."
        );

      } finally {

        setLoading(false);

      }

    };

  // ===============================
  // FORMAT DATE
  // ===============================

  const formatDate = (
    date: string
  ) => {

    return new Date(
      date
    ).toLocaleString(
      "fr-FR"
    );

  };

  // ===============================
  // UI
  // ===============================

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-bold text-[#0b3d2e] mb-3">
          Data Pipeline E1
        </h1>

        <p className="text-gray-600 text-lg">
          Import CSV → nettoyage → validation → stockage PostgreSQL → affichage dans Jobs.
        </p>

      </div>

      {/* GRID */}

      <div className="grid grid-cols-2 gap-8">

        {/* LEFT */}

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

          <div className="w-20 h-20 rounded-[30px] bg-green-100 text-green-700 flex items-center justify-center text-4xl mb-6">
            <FaCloudUploadAlt />
          </div>

          <h2 className="text-2xl font-bold text-[#0b3d2e] mb-3">
            Importer un fichier CSV
          </h2>

          <p className="text-gray-500 mb-6">
            Sélectionnez un fichier contenant des offres d’emploi :
            title, company, location, description.
          </p>

          {/* INPUT */}

          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* SELECT BUTTON */}

          <button
            onClick={handleChooseFile}
            className="w-full border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 rounded-3xl p-10 flex flex-col items-center justify-center transition mb-6"
          >

            <FaFileCsv className="text-6xl text-green-700 mb-5" />

            <span className="font-bold text-[#0b3d2e] text-2xl">
              Choisir un fichier CSV
            </span>

            <span className="text-gray-500 mt-3">
              Cliquez ici pour sélectionner jobs.csv
            </span>

          </button>

          {/* FILE */}

          {file && (

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">

              <p className="text-green-700 font-bold">
                Fichier sélectionné
              </p>

              <p className="text-[#0b3d2e] mt-1">
                {file.name}
              </p>

            </div>

          )}

          {/* IMPORT BUTTON */}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-[#0b3d2e] hover:bg-[#145443] text-white rounded-2xl p-5 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >

            <FaPlay />

            {loading
              ? "Importation..."
              : "Importer vers PostgreSQL"}

          </button>

        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

          <h2 className="text-2xl font-bold text-[#0b3d2e] mb-6">
            Résultat du pipeline
          </h2>

          {!result ? (

            <div className="h-[360px] flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl">

              <FaDatabase className="text-6xl text-gray-300 mb-5" />

              <p className="text-gray-500">
                Aucun import exécuté pour le moment.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {/* TOTAL */}

              <div className="bg-blue-50 rounded-3xl p-6 flex items-center gap-5">

                <FaDatabase className="text-blue-600 text-3xl" />

                <div>

                  <p className="text-gray-500">
                    Lignes CSV lues
                  </p>

                  <h3 className="text-4xl font-bold text-[#0b3d2e]">
                    {result.total}
                  </h3>

                </div>

              </div>

              {/* INSERTED */}

              <div className="bg-green-50 rounded-3xl p-6 flex items-center gap-5">

                <FaCheckCircle className="text-green-600 text-3xl" />

                <div>

                  <p className="text-gray-500">
                    Lignes validées
                  </p>

                  <h3 className="text-4xl font-bold text-green-700">
                    {result.inserted}
                  </h3>

                </div>

              </div>

              {/* REJECTED */}

              <div className="bg-red-50 rounded-3xl p-6 flex items-center gap-5">

                <FaTimesCircle className="text-red-600 text-3xl" />

                <div>

                  <p className="text-gray-500">
                    Lignes rejetées
                  </p>

                  <h3 className="text-4xl font-bold text-red-700">
                    {result.rejected}
                  </h3>

                </div>

              </div>

              {/* SUCCESS */}

              <div className="bg-[#0b3d2e] text-white rounded-3xl p-6">

                <p className="font-bold mb-2">
                  Pipeline terminé avec succès
                </p>

                <p className="text-green-100">
                  Les données sont maintenant stockées dans PostgreSQL et visibles dans SmartRecruit.
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* RNCP */}

      <div className="mt-10 bg-gradient-to-r from-[#062c22] to-[#0b3d2e] rounded-[32px] p-8 text-white shadow-xl">

        <h2 className="text-3xl font-bold mb-6">
          Synthèse RNCP E1 — Data Engineering
        </h2>

        <p className="text-green-100 leading-8 mb-8">
          SmartRecruit AI utilise une chaîne Data Engineering complète :
          import CSV, nettoyage, validation, stockage PostgreSQL et traçabilité des imports.
        </p>

        <div className="grid grid-cols-6 gap-4 text-center">

          {[
            "CSV",
            "Lecture",
            "Nettoyage",
            "Validation",
            "PostgreSQL",
            "Dashboard",
          ].map((step) => (

            <div
              key={step}
              className="bg-white/10 border border-white/10 rounded-2xl p-5"
            >

              <p className="font-bold">
                {step}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* HISTORY */}

      <div className="mt-10 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl">
            <FaHistory />
          </div>

          <div>

            <h2 className="text-3xl font-bold text-[#0b3d2e]">
              Historique des imports PostgreSQL
            </h2>

            <p className="text-gray-500">
              Historisation et traçabilité des pipelines exécutés.
            </p>

          </div>

        </div>

        {history.length === 0 ? (

          <div className="bg-gray-50 rounded-3xl p-10 text-center">

            <FaServer className="text-5xl text-gray-300 mx-auto mb-5" />

            <p className="text-gray-500">
              Aucun historique disponible.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto rounded-3xl border border-gray-100">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="p-5 text-left text-gray-500">
                    Fichier
                  </th>

                  <th className="p-5 text-left text-gray-500">
                    Total
                  </th>

                  <th className="p-5 text-left text-gray-500">
                    Insérées
                  </th>

                  <th className="p-5 text-left text-gray-500">
                    Rejetées
                  </th>

                  <th className="p-5 text-left text-gray-500">
                    Date
                  </th>

                  <th className="p-5 text-left text-gray-500">
                    Statut
                  </th>

                </tr>

              </thead>

              <tbody>

                {history.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >

                    <td className="p-5 font-semibold text-[#0b3d2e]">
                      {item.filename}
                    </td>

                    <td className="p-5">
                      {item.total_rows}
                    </td>

                    <td className="p-5 text-green-700 font-bold">
                      {item.inserted_rows}
                    </td>

                    <td className="p-5 text-red-700 font-bold">
                      {item.rejected_rows}
                    </td>

                    <td className="p-5 text-gray-500">
                      {formatDate(
                        item.created_at
                      )}
                    </td>

                    <td className="p-5">

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                        Traçable
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </DashboardLayout>

  );

};

// ===============================
// EXPORT
// ===============================

export default DataPipeline;