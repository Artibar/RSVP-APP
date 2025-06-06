import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./src/contexts/AuthContext";
import Navbar from "./src/components/Navbar";
import HomePage from "./src/pages/HomePage";
import LoginPage from "./src/pages/LoginPage";
import SignupPage from "./src/pages/SignupPage";
import DashboardPage from "./src/pages/DashboardPage";
import EventPage from "./src/pages/EventPage";
import NotFoundPage from "./src/pages/NotFoundPage";
import EventForm from "./src/components/EventForm";
import AnalyticsPage from "./src/pages/AnalyticsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh" }}>
          <Navbar />
          <main style={{ padding: "20px" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/event/new" element={<EventForm />} />
              <Route path="/event/:eventId" element={<EventPage />} />
              <Route path="/event/:eventId/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
