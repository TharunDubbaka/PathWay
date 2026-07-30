import { useState } from "react";
import { generateRoadmap } from "../api/roadmapApi";
import { getProgress, completeTopic } from "../api/progressApi";
import ProgressCard from "../components/ProgressCard";
import RoadmapCard from "../components/RoadmapCard";

function Home() {
  const [goal, setGoal] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [studyHours, setStudyHours] = useState(10);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapId, setRoadmapId] = useState("");
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    try {
      setLoading(true);

      const data = {
        goal: goal || "AI Engineer",
        skill_level: skillLevel,
        study_hours_per_week: Number(studyHours) || 10,
      };

      const result = await generateRoadmap(data);

      setRoadmap(result.roadmap);
      setRoadmapId(result.roadmap_id);

      const progressData = await getProgress(result.roadmap_id);
      setProgress(progressData);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to generate roadmap. Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTopic = async (phaseIndex, topicIndex) => {
    try {
      await completeTopic(roadmapId, phaseIndex, topicIndex);

      const updatedRoadmap = {
        ...roadmap,
        phases: roadmap.phases.map((phase, pIndex) => ({
          ...phase,
          topics: phase.topics.map((topic, tIndex) => {
            if (pIndex === phaseIndex && tIndex === topicIndex) {
              return {
                ...topic,
                completed: true,
              };
            }
            return topic;
          }),
        })),
      };

      setRoadmap(updatedRoadmap);

      const progressData = await getProgress(roadmapId);
      setProgress(progressData);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to update topic progress.");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-panel">
        <h1>AI Roadmap Planner</h1>
        <p>Generate a personalized learning plan, track progress, and practice what you learn.</p>

        <div className="feature-grid">
          <div className="feature-card">
            <strong>Smart roadmaps</strong>
            <p>Generate an adaptive path for your goals.</p>
          </div>
          <div className="feature-card">
            <strong>Item progress</strong>
            <p>Track completed topics and next steps.</p>
          </div>
          <div className="feature-card">
            <strong>Practice quizzes</strong>
            <p>Test your knowledge as you learn.</p>
          </div>
        </div>

        <div className="form-grid">
          <div>
            <label className="field-label">Goal</label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter your goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Skill level</label>
            <select
              className="select-input"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="field-label">Hours per week</label>
            <input
              type="number"
              min="1"
              max="168"
              className="text-input"
              value={studyHours}
              onChange={(e) => {
                const value = Number(e.target.value);
                setStudyHours(value > 168 ? 168 : value);
              }}
            />
          </div>
          <div className="button-stack">
            <button
              className="primary-button"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="progress-panel">
            <div className="progress-header">
              <span>Generating roadmap</span>
              <strong>Building your personalized study path...</strong>
            </div>
            <div className="progress-bar">
              <div className="loading-progress-fill" />
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      {progress && <ProgressCard progress={progress} />}

      {roadmap && (
        <div className="page-panel">
          <div className="roadmap-summary">
            <div>
              <h2>{roadmap.goal}</h2>
              <p>
                <strong>Roadmap ID:</strong> {roadmapId}
              </p>
            </div>
            <div>
              <p>
                <strong>Study Hours/Week:</strong> {roadmap.study_hours_per_week}
              </p>
            </div>
          </div>

          <RoadmapCard roadmap={roadmap} onCompleteTopic={handleCompleteTopic} />
        </div>
      )}
    </div>
  );
}

export default Home;
