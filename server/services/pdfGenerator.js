const puppeteer = require("puppeteer");

async function generatePDF(audit) {

    const browser = await puppeteer.launch({
        headless: true,
         args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ]
    });

    const page = await browser.newPage();

    const issuesHTML = audit.issues
        .map(issue => `
            <div class="issue">
                <strong>
                    ${issue.type.toUpperCase()}
                </strong>

                <p>
                    ${issue.message}
                </p>
            </div>
        `)
        .join("");

    const html = `
        <!DOCTYPE html>

        <html>

        <head>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #222;
                }

                h1 {
                    color: #2563eb;
                }

                .score {
                    font-size: 40px;
                    font-weight: bold;
                    margin: 20px 0;
                }

                .box {
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 6px;
                }

                .issue {
                    padding: 12px;
                    margin: 10px 0;
                    border-left: 4px solid #f59e0b;
                    background: #f8fafc;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                td, th {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }

            </style>

        </head>

        <body>

            <h1>SEO Audit Report</h1>

            <p>
                <strong>Website:</strong>
                ${audit.url}
            </p>

            <p>
                <strong>Date:</strong>
                ${new Date().toLocaleString()}
            </p>

            <div class="score">
                SEO Score: ${audit.score}/100
            </div>

            <h2>Website Overview</h2>

            <table>

                <tr>
                    <th>Metric</th>
                    <th>Result</th>
                </tr>

                <tr>
                    <td>Title</td>
                    <td>${audit.title || "Missing"}</td>
                </tr>

                <tr>
                    <td>Meta Description</td>
                    <td>${audit.description || "Missing"}</td>
                </tr>

                <tr>
                    <td>H1 Headings</td>
                    <td>${audit.h1}</td>
                </tr>

                <tr>
                    <td>H2 Headings</td>
                    <td>${audit.h2}</td>
                </tr>

                <tr>
                    <td>Total Images</td>
                    <td>${audit.images}</td>
                </tr>

                <tr>
                    <td>Missing Alt Text</td>
                    <td>${audit.missingAlt}</td>
                </tr>

                <tr>
                    <td>Links</td>
                    <td>${audit.links}</td>
                </tr>

                <tr>
                    <td>Canonical URL</td>
                    <td>${audit.canonical || "Missing"}</td>
                </tr>

            </table>

            <h2>SEO Issues</h2>

            ${issuesHTML || "<p>No major issues found.</p>"}

            <h2>Recommendations</h2>

            <ul>
                <li>Use a descriptive page title.</li>
                <li>Add a useful meta description.</li>
                <li>Use proper H1 and H2 structure.</li>
                <li>Add alt text to images.</li>
                <li>Use HTTPS for secure connections.</li>
                <li>Add a canonical URL.</li>
            </ul>

        </body>

        </html>
    `;

    await page.setContent(html, {
        waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

    return pdf;
}

module.exports = generatePDF;