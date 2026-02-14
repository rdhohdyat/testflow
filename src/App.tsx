import LandingPage from "./page/landing-page";
import WorkFlowPage from "./page/workflow";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import DashboardPage from "./page/dashboard";
import NotFoundPage from "./page/not-found";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/work" element={<WorkFlowPage />} />
          <Route path="/project" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
