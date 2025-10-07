import LandingPage from "./page/landing-page";
import WorkFlowPage from "./page/workflow";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import DashboardPage from "./page/dashboard";
import NotFoundPage from "./page/not-found";
import TestPage from "./page/test";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/work" element={<WorkFlowPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
