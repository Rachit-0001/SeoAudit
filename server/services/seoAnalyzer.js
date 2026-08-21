const axios = require("axios");
const cheerio = require("cheerio");

async function analyzeWebsite(url) {

    // Fetch website HTML
    const response = await axios.get(url, {
        timeout: 10000,
        headers: {
            "User-Agent": "Mozilla/5.0 SEO-Auditor"
        }
    });

    const html = response.data;

    // Load HTML using Cheerio
    const $ = cheerio.load(html);

    // Basic SEO information
    const title = $("title").text().trim();

    const description =
        $('meta[name="description"]')
            .attr("content") || "";

    const h1 = $("h1").length;

    const h2 = $("h2").length;

    const images = $("img").length;

    // Find images without alt attribute
    const missingAlt = $("img").filter(function () {
        const alt = $(this).attr("alt");

        return !alt || alt.trim() === "";
    }).length;

    const links = $("a[href]").length;

    const canonical =
        $('link[rel="canonical"]').attr("href") || null;

    // Store problems
    const issues = [];

    // Start with 100
    let score = 100;

    // Title check
    if (!title) {

        score -= 15;

        issues.push({
            type: "error",
            message: "Missing title tag"
        });

    } else if (title.length < 30 || title.length > 60) {

        score -= 5;

        issues.push({
            type: "warning",
            message:
                "Title length should be between 30 and 60 characters"
        });
    }

    // Meta description check
    if (!description) {

        score -= 15;

        issues.push({
            type: "error",
            message: "Missing meta description"
        });

    } else if (
        description.length < 70 ||
        description.length > 160
    ) {

        score -= 5;

        issues.push({
            type: "warning",
            message:
                "Meta description should be between 70 and 160 characters"
        });
    }

    // H1 check
    if (h1 === 0) {

        score -= 10;

        issues.push({
            type: "error",
            message: "No H1 heading found"
        });

    } else if (h1 > 1) {

        score -= 5;

        issues.push({
            type: "warning",
            message:
                "Multiple H1 headings found"
        });
    }

    // Image alt check
    if (missingAlt > 0) {

        const deduction = Math.min(
            missingAlt * 2,
            10
        );

        score -= deduction;

        issues.push({
            type: "warning",
            message:
                `${missingAlt} image(s) are missing alt text`
        });
    }

    // Canonical check
    if (!canonical) {

        score -= 5;

        issues.push({
            type: "warning",
            message: "Canonical URL is missing"
        });
    }

    // HTTPS check
    if (!url.startsWith("https://")) {

        score -= 10;

        issues.push({
            type: "error",
            message: "Website is not using HTTPS"
        });
    }

    return {
        url,
        score: Math.max(score, 0),

        title,
        description,

        h1,
        h2,

        images,
        missingAlt,

        links,

        canonical,

        issues
    };
}

module.exports = analyzeWebsite;    