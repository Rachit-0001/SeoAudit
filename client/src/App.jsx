import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      alert("Please enter a website URL");
      return;
    }

    try {
      setLoading(true);
      setReport(null);

      const response = await axios.post(
        "http://localhost:5000/api/audit",
        { url }
      );

      setReport(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to analyze this website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
          SEO<span>Lens</span>
        </div>

        <p>Simple Website SEO Auditor</p>
      </header>

      {/* Main */}
      <main className="container">

        <section className="hero">
          <h1>Check Your Website SEO</h1>

          <p>
            Find common SEO problems and get simple recommendations
            to improve your website.
          </p>

          <div className="search-box">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button onClick={analyzeWebsite} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing website...</p>
          </div>
        )}

        {/* Report */}
        {report && !loading && (
          <section className="report">

            {/* Score */}
            <div className="score-card">
              <div>
                <p className="small-title">SEO SCORE</p>
                <h2>{report.score}/100</h2>
                <p>{report.url}</p>
              </div>

              <div className="score-circle">
                {report.score}
              </div>
            </div>

            {/* Website information */}
            <h2 className="section-title">
              Website Overview
            </h2>

            <div className="stats">

              <div className="stat-card">
                <span>Title</span>
                <strong>
                  {report.title ? "✓ Found" : "✗ Missing"}
                </strong>
              </div>

              <div className="stat-card">
                <span>Meta Description</span>
                <strong>
                  {report.description ? "✓ Found" : "✗ Missing"}
                </strong>
              </div>

              <div className="stat-card">
                <span>H1 Headings</span>
                <strong>{report.h1}</strong>
              </div>

              <div className="stat-card">
                <span>H2 Headings</span>
                <strong>{report.h2}</strong>
              </div>

              <div className="stat-card">
                <span>Images</span>
                <strong>{report.images}</strong>
              </div>

              <div className="stat-card">
                <span>Missing Alt</span>
                <strong>{report.missingAlt}</strong>
              </div>

              <div className="stat-card">
                <span>Links</span>
                <strong>{report.links}</strong>
              </div>

              <div className="stat-card">
                <span>Canonical</span>
                <strong>
                  {report.canonical ? "✓ Found" : "✗ Missing"}
                </strong>
              </div>

            </div>

            {/* Details */}
            <h2 className="section-title">
              SEO Details
            </h2>

            <div className="details">

              <div className="detail-card">
                <h3>Page Title</h3>
                <p>
                  {report.title || "No title tag found"}
                </p>
              </div>

              <div className="detail-card">
                <h3>Meta Description</h3>
                <p>
                  {report.description ||
                    "No meta description found"}
                </p>
              </div>

            </div>

            {/* Issues */}
            <h2 className="section-title">
              SEO Issues
            </h2>

            {report.issues.length === 0 ? (
              <div className="success">
                ✓ No major SEO issues found.
              </div>
            ) : (
              <div className="issues">

                {report.issues.map((issue, index) => (
                  <div
                    className={`issue ${issue.type}`}
                    key={index}
                  >
                    <div className="issue-icon">
                      {issue.type === "error" ? "!" : "⚠"}
                    </div>

                    <div>
                      <strong>
                        {issue.type === "error"
                          ? "Problem"
                          : "Warning"}
                      </strong>

                      <p>{issue.message}</p>
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* PDF */}
            <div className="pdf-section">
              <button
                className="pdf-button"
                onClick={() =>
                  window.open(
                    `http://localhost:5000/api/audit/${report._id}/pdf`,
                    "_blank"
                  )
                }
              >
                Download PDF Report
              </button>
            </div>

          </section>
        )}

      </main>

      <footer>
        <p>SEO Lens © 2026</p>
      </footer>

    </div>
  );
}

export default App;