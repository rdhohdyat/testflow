import LandingPage from "./page/landing-page";
import WorkFlowPage from "./page/workflow";
import WorkFlowPage2 from "./page/workflow-v2";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/work" element={<WorkFlowPage/>}/>
        <Route path="/work2" element={<WorkFlowPage2/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
