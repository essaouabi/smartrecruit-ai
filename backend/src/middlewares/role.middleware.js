// ======================================================
// ROLE MIDDLEWARE
// ======================================================

const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Utilisateur non authentifié",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Accès refusé",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Erreur middleware rôle",
      });
    }
  };
};

module.exports = roleMiddleware;