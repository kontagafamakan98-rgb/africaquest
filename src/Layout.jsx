import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";

export default function Layout({ children, currentPageName }) {
  // We override Base44 routing with our own BrowserRouter for deep-link + back-gesture support
  return (
    <BrowserRouter>
      <div className="no-select">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:levelId" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}