import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../../styles/styles.css";
// import transparentLogo from "../../../assets/AnimalTrakker_icon_512x512.png";
import transparentLogo from "../../../assets/AnimalTrakker.png";

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

  const openAnimalTrakkerPage = async () => {
    const url = "https://animaltrakker.com";
    await window.electronAPI.openExternalURL(url);
    return;
  }

  return (
    <div className="sidebar bg-gray-100 p-4">
      <div 
        className="logoBox"
        onClick={openAnimalTrakkerPage}
      >
        <img 
          src={transparentLogo}
          alt="App Icon"
          className="logoImage"
        />
        <h2 className="logoTitle">Farm Desktop</h2>
      </div>

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
