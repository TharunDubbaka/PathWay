import { useState } from "react";
import { getDashboard } from "../api/dashboardApi";

function Dashboard() {
  const [roadmapId, setRoadmapId] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setError("");
    setDashboard(null);
    try {
      setLoading(true);
      const result = await getDashboard(roadmapId);
      setDashboard(result);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to load dashboard. Verify the roadmap ID and backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-panel">
        <h1>Dashboard</h1>
        <p>Review the roadmap health, completed topics, and active study goals.</p>

        <div className="form-row">
          <input
            type="text"
            className="text-input"
            placeholder="Roadmap ID"
            value={roadmapId}
            onChange={(e) => setRoadmapId(e.target.value)}
          />
          <button
            className="primary-button"
            onClick={handleFetch}
            disabled={loading || !roadmapId}
          >
            {loading ? "Loading..." : "Load Dashboard"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {dashboard && (
        <div className="page-panel">
          <div className="section-title">
            <div>
              <h2>{dashboard.goal}</h2>
              <p>Current roadmap progress and next study steps.</p>
            </div>
            <span className="tag-pill">Active roadmap</span>
          </div>

          <div className="summary-grid">
            <div className="metric-card">
              <span>Progress</span>
              <strong>{dashboard.progress}%</strong>
            </div>
            <div className="metric-card">
              <span>Completed</span>
              <strong>{dashboard.completed_topics}</strong>
            </div>
            <div className="metric-card">
              <span>Total Topics</span>
              <strong>{dashboard.total_topics}</strong>
            </div>
            <div className="metric-card">
              <span>Current Phase</span>
              <strong>{dashboard.current_phase || "N/A"}</strong>
            </div>
          </div>

          <div className="response-card">
            <div className="response-item">
              <span>Current Topic</span>
              <strong>{dashboard.current_topic || "N/A"}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
