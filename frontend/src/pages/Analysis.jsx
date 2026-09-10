import { useState } from "react";
import { getDashboard } from "../api/dashboardApi";
import GoalPicker from "../components/GoalPicker";

function Analysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (goalId) => {
    setError("");
    setAnalysis(null);
    try {
      setLoading(true);
      const result = await getDashboard(goalId);
      setAnalysis(result);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to fetch analysis for this goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-panel">
        <h1>Analysis</h1>
        <p>Inspect the roadmap performance and get a quick health overview.</p>

        <GoalPicker onSelect={handleFetch} />

        {error && <div className="error-message">{error}</div>}
      </div>

      {analysis && (
        <div className="page-panel">
          <div className="section-title">
            <div>
              <h2>{analysis.goal}</h2>
              <p>Insight into your current phase, completed work, and next steps.</p>
            </div>
            <span className="tag-pill">Health check</span>
          </div>

          <div className="summary-grid">
            <div className="metric-card">
              <span>Progress</span>
              <strong>{analysis.progress}%</strong>
            </div>
            <div className="metric-card">
              <span>Completed</span>
              <strong>{analysis.completed_topics}</strong>
            </div>
            <div className="metric-card">
              <span>Total Topics</span>
              <strong>{analysis.total_topics}</strong>
            </div>
            <div className="metric-card">
              <span>Current Phase</span>
              <strong>{analysis.current_phase || "N/A"}</strong>
            </div>
          </div>

          <div className="response-card">
            <div className="response-item">
              <span>Current Topic</span>
              <strong>{analysis.current_topic || "Finished"}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analysis;
