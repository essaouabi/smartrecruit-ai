const pool = require("../config/db");
const { logAudit } = require("../services/auditLog.service");

// =====================================================
// CANDIDAT : POSTULER À UNE OFFRE
// =====================================================

const applyToJob = async (req, res) => {
  try {
    const candidateId = req.user.id || req.user.userId;
    const userRole = req.user.role || "candidate";

    const { job_id, cv_id } = req.body;

    if (!job_id) {
      return res.status(400).json({
        message: "ID de l'offre obligatoire.",
      });
    }

    if (!cv_id) {
      return res.status(400).json({
        message: "Veuillez sélectionner un CV.",
      });
    }

    const jobCheck = await pool.query(
      "SELECT * FROM jobs WHERE id = $1",
      [job_id]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Offre introuvable.",
      });
    }

    const job = jobCheck.rows[0];

    const cvCheck = await pool.query(
      `
      SELECT *
      FROM candidate_cvs
      WHERE id = $1 AND user_id = $2
      `,
      [cv_id, candidateId]
    );

    if (cvCheck.rows.length === 0) {
      return res.status(404).json({
        message: "CV introuvable pour ce candidat.",
      });
    }

    const cv = cvCheck.rows[0];

    const existingApplication = await pool.query(
      `
      SELECT *
      FROM applications
      WHERE candidate_id = $1 AND job_id = $2
      `,
      [candidateId, job_id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({
        message: "Vous avez déjà postulé à cette offre.",
      });
    }

    const skillsList = [
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Express",
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "PHP",
      "SQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Docker",
      "AWS",
      "Azure",
      "Git",
      "API REST",
      "Machine Learning",
      "Deep Learning",
      "Data",
      "IA",
      "NLP",
      "TensorFlow",
      "PyTorch",
      "DevOps",
      "Kubernetes",
      "Linux",
      "HTML",
      "CSS",
      "Tailwind",
      "Bootstrap",
    ];

    const cvText = (cv.cv_text || "").toLowerCase();

    const jobText = `${job.title || ""} ${
      job.description || ""
    }`.toLowerCase();

    const requiredSkills = skillsList.filter((skill) =>
      jobText.includes(skill.toLowerCase())
    );

    const detectedSkills = skillsList.filter((skill) =>
      cvText.includes(skill.toLowerCase())
    );

    const matchingSkills = detectedSkills.filter((skill) =>
      requiredSkills.includes(skill)
    );

    let aiScore = 60;

    if (requiredSkills.length > 0) {
      aiScore = Math.round(
        55 + (matchingSkills.length / requiredSkills.length) * 40
      );
    } else {
      aiScore = Math.min(85, 60 + detectedSkills.length * 5);
    }

    if (matchingSkills.length === 0 && detectedSkills.length > 0) {
      aiScore = 55;
    }

    if (aiScore > 100) {
      aiScore = 100;
    }

    const missingSkills = requiredSkills.filter(
      (skill) => !detectedSkills.includes(skill)
    );

    const aiSummary = `
===== ANALYSE IA SMARTRECRUIT =====

Compétences détectées dans le CV :
${detectedSkills.length > 0 ? detectedSkills.join(", ") : "Aucune"}

Compétences demandées :
${requiredSkills.length > 0 ? requiredSkills.join(", ") : "Aucune"}

Compétences correspondantes :
${matchingSkills.length > 0 ? matchingSkills.join(", ") : "Aucune"}

Compétences manquantes :
${missingSkills.length > 0 ? missingSkills.join(", ") : "Aucune"}

CV : ${detectedSkills.length} compétence(s) détectée(s)

Offre : ${requiredSkills.length} compétence(s) requise(s)

Matching : ${matchingSkills.length} compétence(s)

Score IA final : ${aiScore}%
`;

    const result = await pool.query(
      `
      INSERT INTO applications
      (
        candidate_id,
        job_id,
        cv_id,
        status,
        ai_score,
        ai_summary
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [candidateId, job_id, cv_id, "pending", aiScore, aiSummary]
    );

    const application = result.rows[0];

    // =====================================================
    // AUDIT LOG : CANDIDATURE CRÉÉE
    // =====================================================

    await logAudit({
      req,
      userId: candidateId,
      userRole,
      action: "APPLICATION_CREATED",
      entity: "applications",
      entityId: application.id,
      description: `Le candidat ${candidateId} a postulé à l'offre "${job.title}" avec le CV "${cv.file_name}" et un score IA de ${aiScore}%.`,
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("notification", {
        type: "success",
        title: "Nouvelle candidature",
        message: `Un candidat vient de postuler à "${job.title}" avec un score IA de ${aiScore}%.`,
        date: new Date().toISOString(),
      });

      io.emit("audit-log", {
        action: "APPLICATION_CREATED",
        entity: "applications",
        entityId: application.id,
        message: `Nouvelle candidature créée avec un score IA de ${aiScore}%.`,
        date: new Date().toISOString(),
      });
    }

    res.status(201).json({
      message: "Candidature envoyée avec succès.",
      application,
    });
  } catch (error) {
    console.error("ERREUR APPLY TO JOB :", error);

    await logAudit({
      req,
      userId: req.user?.id || req.user?.userId || null,
      userRole: req.user?.role || null,
      action: "APPLICATION_CREATE_ERROR",
      entity: "applications",
      entityId: null,
      description: `Erreur lors de la création d'une candidature : ${error.message}`,
    });

    res.status(500).json({
      message: "Erreur lors de la candidature.",
      error: error.message,
    });
  }
};

// =====================================================
// CANDIDAT : VOIR MES CANDIDATURES
// =====================================================

const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.id || req.user.userId;

    const result = await pool.query(
      `
      SELECT 
        applications.id,
        applications.status,
        applications.created_at,
        applications.cv_id,
        applications.ai_score,
        applications.ai_summary,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.description,
        candidate_cvs.file_name AS cv_name
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      LEFT JOIN candidate_cvs ON applications.cv_id = candidate_cvs.id
      WHERE applications.candidate_id = $1
      ORDER BY applications.created_at DESC
      `,
      [candidateId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération candidatures.",
    });
  }
};

// =====================================================
// RH : VOIR TOUTES LES CANDIDATURES
// =====================================================

const getAllApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        applications.id,
        applications.status,
        applications.created_at,
        applications.cv_id,
        applications.ai_score,
        applications.ai_summary,

        users.fullname,
        users.email,

        jobs.title,
        jobs.company,
        jobs.location,

        candidate_cvs.file_name AS cv_name

      FROM applications

      JOIN users 
        ON applications.candidate_id = users.id

      JOIN jobs 
        ON applications.job_id = jobs.id

      LEFT JOIN candidate_cvs 
        ON applications.cv_id = candidate_cvs.id

      ORDER BY applications.created_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération candidatures recruteur.",
    });
  }
};

// =====================================================
// RH : MODIFIER LE STATUT D'UNE CANDIDATURE
// =====================================================

const updateApplicationStatus = async (req, res) => {
  try {
    const recruiterId = req.user.id || req.user.userId;
    const userRole = req.user.role || "recruiter";

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "interview",
      "accepted",
      "rejected",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Le statut est obligatoire.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Statut invalide. Utilisez : pending, interview, accepted ou rejected.",
      });
    }

    const applicationCheck = await pool.query(
      `
      SELECT
        applications.*,
        users.fullname,
        users.email,
        jobs.title,
        jobs.company
      FROM applications
      JOIN users ON applications.candidate_id = users.id
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.id = $1
      `,
      [id]
    );

    if (applicationCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Candidature introuvable.",
      });
    }

    const oldApplication = applicationCheck.rows[0];
    const oldStatus = oldApplication.status;

    const result = await pool.query(
      `
      UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    const updatedApplication = result.rows[0];

    // =====================================================
    // AUDIT LOG : STATUT CANDIDATURE MODIFIÉ
    // =====================================================

    await logAudit({
      req,
      userId: recruiterId,
      userRole,
      action: "APPLICATION_STATUS_UPDATED",
      entity: "applications",
      entityId: Number(id),
      description: `Le recruteur ${recruiterId} a modifié la candidature de "${oldApplication.fullname}" pour l'offre "${oldApplication.title}" : ${oldStatus} → ${status}.`,
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("notification", {
        type: "info",
        title: "Statut candidature mis à jour",
        message: `La candidature de ${oldApplication.fullname} est maintenant : ${status}`,
        date: new Date().toISOString(),
      });

      io.emit("audit-log", {
        action: "APPLICATION_STATUS_UPDATED",
        entity: "applications",
        entityId: Number(id),
        message: `Statut modifié : ${oldStatus} → ${status}`,
        date: new Date().toISOString(),
      });
    }

    res.json({
      message: "Statut de candidature mis à jour avec succès.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(error);

    await logAudit({
      req,
      userId: req.user?.id || req.user?.userId || null,
      userRole: req.user?.role || null,
      action: "APPLICATION_STATUS_UPDATE_ERROR",
      entity: "applications",
      entityId: Number(req.params?.id) || null,
      description: `Erreur modification statut candidature : ${error.message}`,
    });

    res.status(500).json({
      message: "Erreur modification statut candidature.",
      error: error.message,
    });
  }
};

// =====================================================
// CANDIDAT : STATISTIQUES DES CANDIDATURES
// =====================================================

const getApplicationStats = async (req, res) => {
  try {
    const candidateId = req.user.id || req.user.userId;

    const result = await pool.query(
      `
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'accepted') AS accepted,
        COUNT(*) FILTER (WHERE status = 'interview') AS interview,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
      FROM applications
      WHERE candidate_id = $1
      `,
      [candidateId]
    );

    res.json({
      total: Number(result.rows[0].total),
      accepted: Number(result.rows[0].accepted),
      interview: Number(result.rows[0].interview),
      pending: Number(result.rows[0].pending),
      rejected: Number(result.rows[0].rejected),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération statistiques candidatures.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  applyToJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats,
};