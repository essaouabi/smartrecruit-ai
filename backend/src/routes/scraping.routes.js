// =====================================================
// ROUTES SCRAPING - SMARTRECRUIT AI
// =====================================================

const express = require("express");

const router = express.Router();

const {
  startScraping,
} = require("../controllers/scraping.controller");

// =====================================================
// ROUTE GET - TEST DEPUIS LE NAVIGATEUR
// =====================================================

router.get("/jobs", startScraping);

// =====================================================
// ROUTE POST - LANCER LE SCRAPING DEPUIS POSTMAN / FRONTEND
// =====================================================

router.post("/jobs", startScraping);

// =====================================================
// EXPORT DU ROUTER
// =====================================================

module.exports = router;