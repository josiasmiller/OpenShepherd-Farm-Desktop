import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./common/home"
import AnimalSearch from "./common/animalSearch/animalSearch"
import CreateDefault from "./common/animalDefaults/createDefault"
import EditDefault from "./common/animalDefaults/editDefault";
import Sidebar from "../components/sidebar/sidebar";
import LandingPage from "./common/animalSearch/landingPage";

import "../styles/styles.css";

const App: React.FC = () => {
  return (
    <Router>
      <div id="app-container">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/animal-search" element={<AnimalSearch />} />
            <Route path="/create-default" element={<CreateDefault />} />
            <Route path="/edit-default" element={<EditDefault />} />
            
            <Route path="/landing" element={<LandingPage />} />  {/* Note this is only reachable via the animal search page (there is no tab to be selected) */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
