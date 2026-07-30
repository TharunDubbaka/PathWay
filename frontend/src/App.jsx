import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import StudyPlan from "./pages/StudyPlan";
import Quiz from "./pages/Quiz";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;