import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage.jsx";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="no-select">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:levelId" element={<QuizPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}