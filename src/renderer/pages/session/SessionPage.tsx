import React from 'react';
import {HashRouter as Router} from "react-router";
import IsolatedMuiScope from "../../theme/IsolatedMuiScope";
import Sidebar from "@components/sidebar/sidebar";
import {Route, Routes} from "react-router-dom";
import Home from "../common/home";
import AnimalSearch from "../common/animalSearch/animalSearch";
import CreateDefault from "../common/animalDefaults/createDefault";
import RegistryLanding from "../registry/landing/registryLanding";
import LandingPage from "../common/animalSearch/landingPage";
import {PreprocessorPage} from "../registry/landing/preprocessor/registryPreprocessor";

import { BirthPreprocessorPage } from '../registry/landing/preprocessor/impl/births/birthPreprocessor';
import { TransferPreprocessorPage } from '../registry/landing/preprocessor/impl/transferPreprocessor';
import {DeathPreprocessorPage} from "../registry/landing/preprocessor/impl/deathPreprocessor";

const SessionPage = () => {
  return (
    <Router>
      <div id="app-container">
        <IsolatedMuiScope>
          <Sidebar />
        </IsolatedMuiScope>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/animal-search" element={<AnimalSearch />} />
            <Route path="/create-default" element={<CreateDefault />} />
            <Route path="/registry" element={<RegistryLanding />} />

            {/* Routes that do NOT show up on the side bar: */}

            <Route path="/landing" element={<LandingPage />} />  {/* Note this is only reachable via the animal search page (there is no tab to be selected) */}

            <Route path="/registry/preprocess/births" element={<BirthPreprocessorPage />} />
            <Route path="/registry/preprocess/transfers" element={<TransferPreprocessorPage />} />
            <Route path="/registry/preprocess/deaths" element={<DeathPreprocessorPage />} />
            <Route path="/registry/preprocess/:processType" element={<PreprocessorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default SessionPage;
