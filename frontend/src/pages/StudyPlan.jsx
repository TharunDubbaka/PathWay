import { useState } from "react";
import { generateStudyPlan } from "../api/studyPlanApi";
import GoalPicker from "../components/GoalPicker";

function StudyPlan() {
  const [goalId, setGoalId] = useState("");
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (selectedGoalId = goalId) => {
    setError("");
    setStudyPlan(null);
    try {
      setLoading(true);
      const result = await generateStudyPlan(selectedGoalId);
      setStudyPlan(result);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to generate a study plan for this goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-panel">
        <h1>Study Plan</h1>
        <p>Generate a weekly plan for your next active topic and keep your study time focused.</p>

        <div className="form-row">
          <GoalPicker onSelect={setGoalId} />
          <button className="primary-button" onClick={() => handleGenerate()} disabled={loading || !goalId}>
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {studyPlan && (
        <div className="page-panel">
          <div className="section-title">
            <div>
              <h2>7-Day Study Plan</h2>
              <p>Structured tasks to keep you moving forward each day.</p>
            </div>
            <span className="tag-pill">Weekly Plan</span>
          </div>
          <div className="plan-grid">
            {studyPlan.week_plan?.map((item, index) => (
              <div className="metric-card" key={index}>
                <span className="tag-pill">Day {item.day}</span>
                <p>{item.task}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyPlan;
