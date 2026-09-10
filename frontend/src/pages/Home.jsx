import { useEffect, useState } from "react";
import { generateRoadmap, getGenerationStatus } from "../api/roadmapApi";
import { getGoal, getGoals } from "../api/goalsApi";
import { getProgress, completeTopic } from "../api/progressApi";
import ProgressCard from "../components/ProgressCard";
import RoadmapCard from "../components/RoadmapCard";

function Home() {
  const [goalName, setGoalName] = useState("");
  const [skills, setSkills] = useState([{ name: "", experience_level: "Beginner" }]);
  const [studyHours, setStudyHours] = useState(10);
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getGoals().then(setGoals).catch(() => setError("Unable to load your goals."));
  }, []);

  const loadGoal = async (goalId) => {
    setError("");
    setSelectedGoalId(goalId);
    if (!goalId) {
      setRoadmap(null);
      setProgress(null);
      return;
    }
    try {
      const selectedRoadmap = await getGoal(goalId);
      setRoadmap(selectedRoadmap);
      setProgress(await getProgress(goalId));
    } catch (loadError) {
      console.error(loadError);
      setError("Unable to load that goal.");
    }
  };

  const handleGenerate = async () => {
    setError("");
    try {
      setLoading(true);

      const data = {
        goal_name: goalName || "AI Engineer",
        current_skills: skills.filter((skill) => skill.name.trim()),
        skill_level: "Adaptive",
        study_hours_per_week: Number(studyHours) || 10,
      };

      const job = await generateRoadmap(data);
      let result;
      let status = job;
      while (status.status !== "complete" && status.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        status = await getGenerationStatus(job.job_id);
      }
      if (status.status === "failed") {
        throw new Error(status.error);
      }
      result = status;

      setRoadmap(result.roadmap);
      setSelectedGoalId(result.goal_id);
      setGoals(await getGoals());

      const progressData = await getProgress(result.goal_id);
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
      await completeTopic(selectedGoalId, phaseIndex, topicIndex);

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

      const progressData = await getProgress(selectedGoalId);
      setProgress(progressData);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to update topic progress.");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-panel">
        <h1>Your learning goals</h1>
        <p>Create a new personalized path or continue one of your previous goals.</p>

        {goals.length > 0 && (
          <div className="goal-history">
            <label className="field-label" htmlFor="previous-goal">Previous goals</label>
            <select id="previous-goal" className="select-input" value={selectedGoalId} onChange={(event) => loadGoal(event.target.value)}>
              <option value="">Choose a saved goal</option>
              {goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.goal_name}</option>)}
            </select>
          </div>
        )}

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
            <label className="field-label">Goal name</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Become a data analyst"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
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
          <div className="skills-editor">
            <div className="skills-heading">
              <label className="field-label">Current skills with experience level</label>
              <button className="text-button" type="button" onClick={() => setSkills([...skills, { name: "", experience_level: "Beginner" }])}>+ Add skill</button>
            </div>
            {skills.map((skill, index) => (
              <div className="skill-row" key={index}>
                <input className="text-input" placeholder="Skill name" value={skill.name} onChange={(event) => setSkills(skills.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} />
                <select className="select-input" value={skill.experience_level} onChange={(event) => setSkills(skills.map((item, itemIndex) => itemIndex === index ? { ...item, experience_level: event.target.value } : item))}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                {skills.length > 1 && <button className="icon-button" type="button" onClick={() => setSkills(skills.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>}
              </div>
            ))}
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
                <strong>Skill-aligned plan</strong>
              </p>
            </div>
            <div>
              <p><strong>{roadmap.study_hours_per_week} hrs/week</strong></p>
            </div>
          </div>

          <RoadmapCard roadmap={roadmap} onCompleteTopic={handleCompleteTopic} />
        </div>
      )}
    </div>
  );
}

export default Home;
