function ProgressCard({ progress }) {
  return (
    <div className="page-panel progress-card">
      <div className="roadmap-header">
        <div>
          <h2>Progress Summary</h2>
          <p>Track completed milestones and progress across your roadmap.</p>
        </div>
        <div>
          <strong>{progress.progress}%</strong>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress.progress}%` }} />
      </div>

      <div className="progress-stats">
        <div className="progress-panel">
          <p>Goal</p>
          <strong>{progress.goal}</strong>
        </div>
        <div className="progress-panel">
          <p>Completed</p>
          <strong>{progress.completed_topics}</strong>
        </div>
        <div className="progress-panel">
          <p>Remaining</p>
          <strong>{progress.remaining_topics}</strong>
        </div>
        <div className="progress-panel">
          <p>Progress</p>
          <strong>{progress.progress}%</strong>
        </div>
      </div>
    </div>
  );
}

export default ProgressCard;
