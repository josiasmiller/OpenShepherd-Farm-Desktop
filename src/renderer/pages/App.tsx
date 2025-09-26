import React from "react";
import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import Home from "./common/home"
import AnimalSearch from "./common/animalSearch/animalSearch"
import CreateDefault from "./common/animalDefaults/createDefault"
import Sidebar from "../components/sidebar/sidebar";
import LandingPage from "./common/animalSearch/landingPage";
import RegistryLanding from "./registry/landing/registryLanding";
import { PreprocessorPage } from "./registry/landing/preprocessor/registryPreprocessor";
import "../styles/styles.css";
import IsolatedMuiScope from "../theme/IsolatedMuiScope";

const App: React.FC = () => {
  return (
    <Router>
      <div id="app-container">
        <IsolatedMuiScope>
          <Sidebar />
        </IsolatedMuiScope>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/animal-search" element={<AnimalSearch />} />
            <Route path="/create-default" element={<CreateDefault />} />
            <Route path="/registry" element={<RegistryLanding />} />

            {/* Routes that do NOT show up on the side bar: */}
            
            <Route path="/landing" element={<LandingPage />} />  {/* Note this is only reachable via the animal search page (there is no tab to be selected) */}

            <Route path="/registry/preprocess/:processType" element={<PreprocessorPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
