// ===============================
// CLEAN STRING
// ===============================

const cleanString = (value) => {
  if (!value) return "";

  return String(value)
    .trim()
    .replace(/\s+/g, " ");
};

// ===============================
// CLEAN JOB DATA
// ===============================

const cleanJobData = (row) => {
  return {
    title: cleanString(row.title || row.titre || row.poste),
    company: cleanString(row.company || row.entreprise),
    location: cleanString(row.location || row.ville || row.localisation),
    description: cleanString(row.description || row.skills || row.competences),
  };
};

// ===============================
// VALIDATE JOB DATA
// ===============================

const isValidJob = (job) => {
  return (
    job.title.length >= 3 &&
    job.company.length >= 2 &&
    job.location.length >= 2 &&
    job.description.length >= 10
  );
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  cleanJobData,
  isValidJob,
};