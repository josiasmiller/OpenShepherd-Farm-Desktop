import React from "react";

import logo from "../../assets/images/AnimalTrakker.png";
import "../../styles/styles.css";

const Home: React.FC = () => {
  const handleExternalLinkClick = () => {
    window.open("https://support.animaltrakker.com/", "_blank");
  };

  return (
    <div className="home-container">
      <img src={logo} alt="App Logo" className="home-logo" />
      <h1 className="home-title">Welcome to AnimalTrakker</h1>
      <p className="home-subtext">
        Visit our{" "}
        <span className="external-link" onClick={handleExternalLinkClick}>
          website
        </span>{" "}
        for documentation and updates.
      </p>
    </div>
  );
};

export default Home;
