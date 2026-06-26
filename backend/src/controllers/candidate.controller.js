// ======================================================
// CANDIDATE CONTROLLER - SMARTRECRUIT AI
// RGPD READY : anonymisation + suppression logique
// ======================================================

// ===============================
// IMPORT DATABASE
// ===============================

const pool = require("../config/db");

// ===============================
// IMPORT SERVICES OPTIONNELS
// ===============================

let logAudit = async () => null;
let createNotification = async () => null;

try {
  const auditService = require("../services/auditLog.service");
  logAudit = auditService.logAudit || logAudit;
} catch (error) {
  console.warn("Audit service non chargé :", error.message);
}

try {
  const notificationService = require("../services/notification.service");
  createNotification =
    notificationService.createNotification || createNotification;
} catch (error) {
  console.warn("Notification service non chargé :", error.message);
}

// ===============================
// HELPERS
// ===============================

const getUserId = (req) => {
  return req.user?.id || req.user?.userId || null;
};

const getUserRole = (req) => {
  return req.user?.role || null;
};

const emitSocketNotification = (req, payload) => {
  try {
    const io = req.app.get("io");

    if (io) {
      io.emit("notification", {
        type: payload.type || "info",
        title: payload.title,
        message: payload.message,
        date: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.warn("Socket notification ignorée :", error.message);
  }
};

// ===============================
// SAVE CANDIDATE ANALYSIS
// ===============================

const saveCandidate = async (req, res) => {
  try {
    const {
      name,
      title,
      email,
      phone,
      linkedin,
      github,
      score,
      skills,
      missingSkills,
      summary,
      jobContext,
      strengths,
      weaknesses,
      advice,
      profileLevel,
      yearsExperience,
      interviewQuestions,
      hrRecommendation,
    } = req.body;

    const newCandidate = await pool.query(
      `
      INSERT INTO candidates
      (
        name,
        title,
        email,
        phone,
        linkedin,
        github,
        score,
        skills,
        missing_skills,
        summary,
        job_context,
        strengths,
        weaknesses,
        advice,
        profile_level,
        years_experience,
        interview_questions,
        hr_recommendation,
        is_anonymized
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, false
      )
      RETURNING *
      `,
      [
        name || "",
        title || "",
        email || "",
        phone || "",
        linkedin || "",
        github || "",
        Number(score) || 0,
        Array.isArray(skills) ? skills.join(", ") : skills || "",
        Array.isArray(missingSkills)
          ? missingSkills.join(", ")
          : missingSkills || "",
        summary || "",
        jobContext || "",
        Array.isArray(strengths) ? strengths.join(" | ") : strengths || "",
        Array.isArray(weaknesses) ? weaknesses.join(" | ") : weaknesses || "",
        Array.isArray(advice) ? advice.join(" | ") : advice || "",
        profileLevel || "",
        Number(yearsExperience) || 0,
        Array.isArray(interviewQuestions)
          ? interviewQuestions.join(" | ")
          : interviewQuestions || "",
        hrRecommendation || "",
      ]
    );

    await Promise.allSettled([
      logAudit({
        req,
        action: "CREATE_CANDIDATE",
        entity: "candidate",
        entityId: newCandidate.rows[0].id,
        details: "Création d'une analyse candidat.",
        userId: getUserId(req),
        userRole: getUserRole(req),
      }),
      createNotification({
        userId: getUserId(req),
        title: "Nouveau candidat enregistré",
        message: `${newCandidate.rows[0].name} a été ajouté à la base candidats.`,
        type: "success",
        role: "recruiter",
      }),
    ]);

    res.status(201).json(newCandidate.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur sauvegarde candidat",
    });
  }
};

// ===============================
// GET ALL CANDIDATES
// ===============================

const getCandidates = async (req, res) => {
  try {
    const candidates = await pool.query(
      `
      SELECT *
      FROM candidates
      WHERE deleted_at IS NULL
      ORDER BY id DESC
      `
    );

    res.status(200).json(candidates.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération candidats",
    });
  }
};

// ===============================
// GET CANDIDATE BY ID
// ===============================

const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "ID candidat invalide",
      });
    }

    const candidate = await pool.query(
      `
      SELECT *
      FROM candidates
      WHERE id = $1
      AND deleted_at IS NULL
      `,
      [id]
    );

    if (candidate.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    res.status(200).json(candidate.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur récupération détail candidat",
    });
  }
};

// ===============================
// UPDATE CANDIDATE DECISION
// ===============================

const updateCandidateDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, decision_color } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "ID candidat invalide",
      });
    }

    if (!decision || !decision_color) {
      return res.status(400).json({
        message: "Décision et couleur obligatoires",
      });
    }

    const updatedCandidate = await pool.query(
      `
      UPDATE candidates
      SET
        decision = $1,
        decision_color = $2
      WHERE id = $3
      AND deleted_at IS NULL
      RETURNING *
      `,
      [decision, decision_color, id]
    );

    if (updatedCandidate.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    await logAudit({
      req,
      action: "UPDATE_CANDIDATE_DECISION",
      entity: "candidate",
      entityId: id,
      details: `Décision mise à jour : ${decision}`,
      userId: getUserId(req),
      userRole: getUserRole(req),
    });

    res.status(200).json({
      message: "Décision candidat mise à jour",
      candidate: updatedCandidate.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur mise à jour décision candidat",
    });
  }
};

// ===============================
// ANONYMIZE CANDIDATE - RGPD
// ===============================

const anonymizeCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "ID candidat invalide",
      });
    }

    const existingCandidate = await pool.query(
      `
      SELECT *
      FROM candidates
      WHERE id = $1
      AND deleted_at IS NULL
      `,
      [id]
    );

    if (existingCandidate.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Candidat introuvable",
      });
    }

    if (existingCandidate.rows[0].is_anonymized === true) {
      return res.status(200).json({
        success: true,
        message: "Ce candidat est déjà anonymisé.",
        candidate: existingCandidate.rows[0],
      });
    }

    const anonymizedName = `Candidat anonymisé ${id}`;
    const anonymizedEmail = `anonymized_${id}@smartrecruit.local`;

    const anonymizedCandidate = await pool.query(
      `
      UPDATE candidates
      SET
        name = $1,
        email = $2,
        phone = 'Anonymisé',
        linkedin = 'Anonymisé',
        github = 'Anonymisé',
        summary = 'Données personnelles anonymisées conformément au RGPD.',
        is_anonymized = true,
        anonymized_at = CURRENT_TIMESTAMP
      WHERE id = $3
      AND deleted_at IS NULL
      RETURNING *
      `,
      [anonymizedName, anonymizedEmail, id]
    );

    await Promise.allSettled([
      logAudit({
        req,
        action: "ANONYMIZE_CANDIDATE",
        entity: "candidate",
        entityId: id,
        details:
          "Anonymisation RGPD du candidat : nom, email, téléphone, LinkedIn et GitHub masqués.",
        userId: getUserId(req),
        userRole: getUserRole(req),
      }),
      createNotification({
        userId: getUserId(req),
        title: "Candidat anonymisé",
        message: `Le candidat #${id} a été anonymisé conformément au RGPD.`,
        type: "warning",
        role: "recruiter",
      }),
    ]);

    emitSocketNotification(req, {
      type: "warning",
      title: "Candidat anonymisé",
      message: `Le candidat #${id} a été anonymisé conformément au RGPD.`,
    });

    res.status(200).json({
      success: true,
      message: "Candidat anonymisé avec succès.",
      candidate: anonymizedCandidate.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur anonymisation candidat",
    });
  }
};

// ===============================
// DELETE CANDIDATE - SUPPRESSION LOGIQUE RGPD
// ===============================

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "ID candidat invalide",
      });
    }

    const existingCandidate = await pool.query(
      `
      SELECT *
      FROM candidates
      WHERE id = $1
      AND deleted_at IS NULL
      `,
      [id]
    );

    if (existingCandidate.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Candidat introuvable",
      });
    }

    const deletedCandidate = await pool.query(
      `
      UPDATE candidates
      SET
        name = $1,
        email = $2,
        phone = 'Supprimé',
        linkedin = 'Supprimé',
        github = 'Supprimé',
        summary = 'Candidat supprimé logiquement conformément au RGPD.',
        is_anonymized = true,
        anonymized_at = COALESCE(anonymized_at, CURRENT_TIMESTAMP),
        deleted_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
      `,
      [
        `Candidat supprimé ${id}`,
        `deleted_${id}@smartrecruit.local`,
        id,
      ]
    );

    await Promise.allSettled([
      logAudit({
        req,
        action: "SOFT_DELETE_CANDIDATE",
        entity: "candidate",
        entityId: id,
        details:
          "Suppression logique RGPD du candidat avec anonymisation des données personnelles.",
        userId: getUserId(req),
        userRole: getUserRole(req),
      }),
      createNotification({
        userId: getUserId(req),
        title: "Candidat supprimé",
        message: `Le candidat #${id} a été supprimé logiquement et anonymisé.`,
        type: "error",
        role: "recruiter",
      }),
    ]);

    emitSocketNotification(req, {
      type: "error",
      title: "Candidat supprimé",
      message: `Le candidat #${id} a été supprimé logiquement et anonymisé.`,
    });

    res.status(200).json({
      success: true,
      message: "Candidat supprimé logiquement avec succès.",
      candidate: deletedCandidate.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur suppression candidat",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  saveCandidate,
  getCandidates,
  getCandidateById,
  updateCandidateDecision,
  anonymizeCandidate,
  deleteCandidate,
};