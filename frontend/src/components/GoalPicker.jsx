import { useEffect, useRef, useState } from "react";
import { getGoals } from "../api/goalsApi";

function GoalPicker({ onSelect }) {
  const [goals, setGoals] = useState([]);
  const [value, setValue] = useState(localStorage.getItem("selected_goal_id") || "");
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    getGoals().then((items) => {
      setGoals(items);
      if (!value && items[0]) {
        setValue(items[0].id);
        localStorage.setItem("selected_goal_id", items[0].id);
        onSelectRef.current(items[0].id);
      } else if (value) {
        onSelectRef.current(value);
      }
    });
  }, []);

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    localStorage.setItem("selected_goal_id", nextValue);
    onSelect(nextValue);
  };

  return (
    <div className="goal-picker">
      <label className="field-label" htmlFor="goal-picker">Saved goal</label>
      <select id="goal-picker" className="select-input" value={value} onChange={handleChange}>
        <option value="">Choose a goal</option>
        {goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.goal_name}</option>)}
      </select>
    </div>
  );
}

export default GoalPicker;
