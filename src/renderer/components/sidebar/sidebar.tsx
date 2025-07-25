import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../../styles/styles.css";
import transparentLogo from "../../assets/AnimalTrakker.png";

import { handleResult } from "../../../shared/results/resultTypes";
import { DefaultSettingsResults } from "../../../database";
import { isRegistryVersion } from "../../../scripts/appVersion";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [dbFileName, setDbFileName] = useState("No database selected");
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [defaultList, setDefaultList] = useState<DefaultSettingsResults[]>([]);
  const [selectedDefault, setSelectedDefault] = useState<string>("");


  // Check if database is already loaded (on mount and after file selection)
  const checkDbStatus = async () => {
    const loaded: boolean = await window.electronAPI.isDatabaseLoaded();
    setIsDbLoaded(loaded);
  };

  useEffect(() => {
    const loadPreviousDefault = async () => {
      try {
        const saved : DefaultSettingsResults | null = await window.electronAPI.getSelectedDefault();

        if (
          saved &&
          defaultList.some((def) => def.id === saved.id)
        ) {
          setSelectedDefault(saved.name);
        }
      } catch (error) {
        console.error("Failed to load previous default:", error);
      }
    };

    if (isDbLoaded && defaultList.length > 0) {
      loadPreviousDefault();
    }
  }, [isDbLoaded, defaultList]);

  const handleDefaultChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const newSelected = defaultList.find((def) => def.name === selectedName);
    if (newSelected) {
      setSelectedDefault(newSelected.name);
      try {
        await window.electronAPI.setSelectedDefault(newSelected);
      } catch (error) {
        console.error("Failed to persist selected default:", error);
      }
    }
  };

  useEffect(() => {
    checkDbStatus();
  }, []);


  const handleSelectDatabase = async () => {
    try {
      const filePath: string | null = await window.electronAPI.selectDatabase();
      if (!filePath) return;

      setDbFileName(filePath);

      // Fetch defaults from DB
      const defaults = await window.electronAPI.getExistingDefaults();

      handleResult(defaults, {
        success: async (data: DefaultSettingsResults[]) => {
          setDefaultList(data);

          try {
            const saved = await window.electronAPI.getSelectedDefault();

            // If saved default exists in the new DB's defaults
            const match = saved && data.find((def) => def.id === saved.id);
            if (match) {
              setSelectedDefault(match.name);
            } else {
              setSelectedDefault(data[0]?.name || "");
            }
          } catch (error) {
            console.error("Failed to restore saved default: ", error);
            setSelectedDefault(data[0]?.name || "");
          }
        },
        error: (err: any) => {
          console.error("Failed to fetch existing defaults:", err);
        },
      });

      await checkDbStatus(); // Refresh DB status
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
        <h2 className="logoTitle">
          {isRegistryVersion() ? 'Registry Desktop' : 'Farm Desktop'}
        </h2>

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

        <li
          onClick={() => handleNavClick("/registry")}
          style={getLinkStyle(isDbLoaded)}
        >
          Registry Features
        </li>
      </ul>

      <div className="database-selector">
        <button onClick={handleSelectDatabase}>Select Database</button>
        <p>{dbFileName}</p>

        {isDbLoaded && (
          <>
            <hr className="db-divider" />
            <label htmlFor="defaultSelector" className="text-sm mt-2">Choose Default:</label>
            <select
              id="defaultSelector"
              className="defaultSelector"
              value={selectedDefault}
              onChange={(e) => handleDefaultChange(e)}
            >
              {defaultList.map((def) => (
                <option key={def.name} value={def.name}>{def.name}</option>
              ))}
            </select>

          </>
        )}
      </div>
    </div>
  );

};

export default Sidebar;
