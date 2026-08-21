import { HashRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Overview from "./pages/Overview";
import VoiceDocumentation from "./pages/VoiceDocumentation";
import ResourceManagement from "./pages/ResourceManagement";
import ResidentMonitoring from "./pages/ResidentMonitoring";
import ComplianceAudit from "./pages/ComplianceAudit";
import FamilyCommunication from "./pages/FamilyCommunication";
import Operations from "./pages/Operations";
import RobotManagement from "./pages/RobotManagement";
import PredictiveIntelligence from "./pages/PredictiveIntelligence";

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen bg-cream-100">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <MobileNav />
          <main className="flex-1 min-w-0 px-4 py-6 md:px-9 md:py-8 max-w-[1400px] w-full mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/voice" element={<VoiceDocumentation />} />
              <Route path="/resources" element={<ResourceManagement />} />
              <Route path="/monitoring" element={<ResidentMonitoring />} />
              <Route path="/compliance" element={<ComplianceAudit />} />
              <Route path="/family" element={<FamilyCommunication />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/robots" element={<RobotManagement />} />
              <Route path="/predictive" element={<PredictiveIntelligence />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}
