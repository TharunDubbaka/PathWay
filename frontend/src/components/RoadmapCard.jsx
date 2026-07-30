function RoadmapCard({ roadmap, onCompleteTopic }) {
  if (!roadmap) {
    return null;
  }

  return (
    <div className="roadmap-card">
      <div className="roadmap-header">
        <div>
          <h2>{roadmap.goal}</h2>
          <p>{roadmap.phases.length} phases planned</p>
        </div>
        <div className="roadmap-meta">
          <span>{roadmap.skill_level || "Skill level not set"}</span>
          <span>{roadmap.study_hours_per_week} hrs/week</span>
        </div>
      </div>

      {roadmap.phases.map((phase, phaseIndex) => (
        <section className="phase-block" key={phaseIndex}>
          <div className="phase-title">
            <div>
              <strong>{phase.title}</strong>
              <p className="phase-description">{phase.description}</p>
            </div>
            <div>{phase.duration_weeks ? `${phase.duration_weeks} weeks` : "Flexible"}</div>
          </div>

          <div className="topic-list">
            {phase.topics.map((topic, topicIndex) => (
              <div className="topic-row" key={topicIndex}>
                <div>
                  <label className="topic-checkbox">
                    <input
                      type="checkbox"
                      checked={topic.completed}
                      onChange={() => onCompleteTopic(phaseIndex, topicIndex)}
                    />
                    <span className="topic-name">{topic.name}</span>
                  </label>
                  <p className="topic-summary">{topic.summary}</p>
                  {topic.resources?.length > 0 && (
                    <div className="resource-list">
                      {topic.resources
                        .slice()
                        .sort((a, b) => {
                          const order = {
                            video: 1,
                            website: 2,
                            article: 3,
                            other: 4,
                          };
                          const typeA = (a.type || "other").toLowerCase();
                          const typeB = (b.type || "other").toLowerCase();
                          return (order[typeA] || 4) - (order[typeB] || 4);
                        })
                        .map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="resource-link"
                          >
                            {resource.type || "Link"}: {resource.title}
                          </a>
                        ))}
                    </div>
                  )}
                </div>

                <button
                  className={topic.completed ? "secondary-button" : "topic-button"}
                  onClick={() => onCompleteTopic(phaseIndex, topicIndex)}
                >
                  {topic.completed ? "Completed" : "Mark Complete"}
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default RoadmapCard;
