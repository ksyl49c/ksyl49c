import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Overview from "./pages/Overview";
import VoiceDocumentation from "./pages/VoiceDocumentation";
import ResidentGraph from "./pages/ResidentGraph";
import ComplianceAudit from "./pages/ComplianceAudit";
import PredictiveIntelligence from "./pages/PredictiveIntelligence";
import FamilyCommunication from "./pages/FamilyCommunication";
import Operations from "./pages/Operations";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-cream-100">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <MobileNav />
          <main className="flex-1 min-w-0 px-4 py-6 md:px-9 md:py-8 max-w-[1400px] w-full mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/voice" element={<VoiceDocumentation />} />
              <Route path="/graph" element={<ResidentGraph />} />
              <Route path="/compliance" element={<ComplianceAudit />} />
              <Route path="/predictive" element={<PredictiveIntelligence />} />
              <Route path="/family" element={<FamilyCommunication />} />
              <Route path="/operations" element={<Operations />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
