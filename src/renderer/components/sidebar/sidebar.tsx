import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/styles.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [dbFileName, setDbFileName] = useState("No database selected");

  const handleSelectDatabase = async () => {
    try {
      const filePath: string | null = await (window as any).electronAPI.selectDatabase();
      if (filePath) {
        setDbFileName(filePath);
      }
    } catch (err) {
      console.error("Failed to select database:", err);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <h2>AnimalTrakker Farm Desktop</h2>
      <ul>
        <li onClick={() => handleNavClick("/")}>Home</li>
        <li onClick={() => handleNavClick("/animal-search")}>Animal Search</li>
        <li onClick={() => handleNavClick("/create-default")}>Create Defaults</li>
        <li onClick={() => handleNavClick("/edit-default")}>Edit Defaults</li>
      </ul>

      <div className="database-selector">
        <button onClick={handleSelectDatabase}>Select Database</button>
        <p>{dbFileName}</p>
      </div>
    </div>
  );
};

export default Sidebar;
