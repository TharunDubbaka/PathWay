import { useState } from "react";
import { generateQuiz } from "../api/quizApi";

function Quiz() {
  const [roadmapId, setRoadmapId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setQuiz(null);
    try {
      setLoading(true);
      const result = await generateQuiz(roadmapId);
      setQuiz(result.quiz || []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to generate quiz. Verify the roadmap ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-panel">
        <h1>Quiz</h1>
        <p>Practice your current topic with a clear multiple-choice quiz.</p>

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
            onClick={handleGenerate}
            disabled={loading || !roadmapId}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {quiz && quiz.length > 0 && (
        <div className="page-panel">
          <div className="section-title">
            <div>
              <h2>Quiz Questions</h2>
              <p>Answer the questions below to test your current study topic.</p>
            </div>
            <span className="tag-pill">Practice</span>
          </div>
          <div className="plan-grid">
            {quiz.map((item, index) => (
              <div className="question-card" key={index}>
                <h3>Question {index + 1}</h3>
                <p>{item.question}</p>
                <ul className="option-list">
                  {item.options?.map((option, optionIndex) => (
                    <li className="option-item" key={optionIndex}>
                      {option}
                    </li>
                  ))}
                </ul>
                <div className="quiz-answer">
                  <strong>Answer:</strong> {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
