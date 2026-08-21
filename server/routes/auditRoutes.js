const express = require("express");

const Audit = require("../models/Audit");
const analyzeWebsite = require("../services/seoAnalyzer");
const generatePDF = require("../services/pdfGenerator");

const router = express.Router();


// Create new audit
router.post("/", async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                message: "Website URL is required"
            });
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                message: "Invalid website URL"
            });
        }

        console.log("Analyzing:", url);

        // Analyze website
        const result = await analyzeWebsite(url);

        // Save result
        const audit = await Audit.create(result);

        res.status(201).json(audit);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            message:
                "Unable to analyze website. Make sure the URL is accessible."
        });
    }
});


// Get audit by ID
router.get("/:id", async (req, res) => {

    try {

        const audit = await Audit.findById(
            req.params.id
        );

        if (!audit) {
            return res.status(404).json({
                message: "Audit not found"
            });
        }

        res.json(audit);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Generate PDF
router.get("/:id/pdf", async (req, res) => {

    try {

        const audit = await Audit.findById(
            req.params.id
        );

        if (!audit) {
            return res.status(404).json({
                message: "Audit not found"
            });
        }

        const pdf = await generatePDF(audit);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                `attachment; filename="seo-report.pdf"`
        });

        res.send(pdf);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not generate PDF"
        });
    }
});


module.exports = router;