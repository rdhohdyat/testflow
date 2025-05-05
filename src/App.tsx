import LandingPage from "./page/landing-page";
import WorkFlowPage from "./page/workflow";
import Test from "./page/test";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/work" element={<WorkFlowPage />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
