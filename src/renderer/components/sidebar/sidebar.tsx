import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../../styles/styles.css";
import transparentLogo from "../../../assets/AnimalTrakker_icon_512x512.png";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [dbFileName, setDbFileName] = useState("No database selected");
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  // Check if database is already loaded (on mount and after file selection)
  const checkDbStatus = async () => {
    const loaded: boolean = await window.electronAPI.isDatabaseLoaded();
    setIsDbLoaded(loaded);
  };

  useEffect(() => {
    checkDbStatus();
  }, []);

  const handleSelectDatabase = async () => {
    try {
      const filePath: string | null = await window.electronAPI.selectDatabase();
      if (filePath) {
        setDbFileName(filePath);
        await checkDbStatus(); // recheck DB loaded state after selection
      }
    } catch (err) {
      console.error("Failed to select database:", err);
    }
  };

  const handleNavClick = (path: string) => {
    if (!isDbLoaded && path !== "/") {
      Swal.fire({
        title: "Please select a valid database file first.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }
    navigate(path);
  };

  const getLinkStyle = (enabled: boolean) => ({
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.5,
  });

  return (
    <div className="sidebar">
      <img 
        src={transparentLogo}
        alt="App Icon" 
        className="w-full h-auto max-h-32 object-contain p-4" 
      />
      <h2>AnimalTrakker Farm Desktop</h2>
      <ul>
        <li onClick={() => handleNavClick("/")}>Home</li>
        <li
          onClick={() => handleNavClick("/animal-search")}
          style={getLinkStyle(isDbLoaded)}
        >
          Animal Search
        </li>
        <li
          onClick={() => handleNavClick("/create-default")}
          style={getLinkStyle(isDbLoaded)}
        >
          Create Defaults
        </li>
        <li
          onClick={() => handleNavClick("/edit-default")}
          style={getLinkStyle(isDbLoaded)}
        >
          Edit Defaults
        </li>
      </ul>

      <div className="database-selector">
        <button onClick={handleSelectDatabase}>Select Database</button>
        <p>{dbFileName}</p>
      </div>
    </div>
  );
};

export default Sidebar;
