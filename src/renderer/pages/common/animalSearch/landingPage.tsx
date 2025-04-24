import React from "react";
import { useLocation } from "react-router-dom";
import { AnimalSearchResult } from "../../../../database";
import { AnimalInfo } from "../../../../writers/helpers/animalInfo";

const LandingPage = () => {
  const location = useLocation();
  const chosenAnimals: AnimalSearchResult[] = location.state?.chosenAnimals || [];

  const convertToAnimalInfo = (): AnimalInfo[] => {
    return chosenAnimals.map((animal: AnimalSearchResult) => ({
      id: animal.animal_id,
      name: animal.name,
    }));
  };


  const saveEvaluationHistoryCsv = async () => {
    await window.electronAPI.showAlert({
      title: "AnimalTrakker",
      message: "This functionality will come in a future version.",
      type: "warning",
    });
  };
  

  const saveDrugHistoryCsv = async () => {  
    const animalData: AnimalInfo[] = convertToAnimalInfo();
  
    // Use the exposed IPC handler instead of calling writeDrugHistoryCsv directly
    const success = await window.electronAPI.exportDrugHistoryCsv(animalData);
  
    if (success) {
      await window.electronAPI.showAlert({
        title: "AnimalTrakker",
        message: "File saved successfully!",
        type: "info",
      });
    } else {
      await window.electronAPI.showAlert({
        title: "AnimalTrakker",
        message: "There was an error saving the file.",
        type: "error",
      });
    }
  };
    
  
  const saveNoteHistoryCsv = async () => {
    const animalData: AnimalInfo[] = convertToAnimalInfo();
  
    // Use the exposed IPC handler instead of calling writeDrugHistoryCsv directly
    const success = await window.electronAPI.exportAnimalNotesCsv(animalData);
  
    if (success) {
      await window.electronAPI.showAlert({
        title: "AnimalTrakker",
        message: "File saved successfully!",
        type: "info",
      });
    } else {
      await window.electronAPI.showAlert({
        title: "AnimalTrakker",
        message: "There was an error saving the file.",
        type: "error",
      });
    }
  };
  
  
  const saveTissueTestResultHistoryCsv = async () => {    
    const animalData: AnimalInfo[] = convertToAnimalInfo();
  
    // Use the exposed IPC handler instead of calling writeDrugHistoryCsv directly
    const success = await window.electronAPI.exportTissueTestResultsCsv(animalData);
  
    if (success) {
      await window.electronAPI.showAlert({
        title: "AnimalTrakker",
        message: "File saved successfully!",
        type: "info",
      });
    } else {
      await window.electronAPI.showAlert({
        title: "AnimalTrakker",
        message: "There was an error saving the file.",
        type: "error",
      });
    }
  };
  

  return (
    <div className="landing-page-container">
      {/* Top Half */}
      <div className="landing-page-top">
        <h2>Landing Page</h2>
        <p>You selected {chosenAnimals.length} animals.</p>

        {/* Placeholder buttons */}
        <div className="action-buttons">
          <button className="forward-button" onClick={saveEvaluationHistoryCsv}>
            Evaluation History
          </button>
          <button className="forward-button" onClick={saveDrugHistoryCsv}>
            Drug History
          </button>
          <button className="forward-button" onClick={saveNoteHistoryCsv}>
            Note History
          </button>
          <button className="forward-button" onClick={saveTissueTestResultHistoryCsv}>
            Tissue Test Result History
          </button>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="landing-page-bottom">
        {chosenAnimals.length > 0 && (
          <div id="chosenTableContainer" className="scrollable-table">
            <table className="chosen-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Birth Date</th>
                  <th>Death Date</th>
                  <th>Sex</th>
                  <th>Birth Type</th>
                  <th>Sire Name</th>
                  <th>Dam Name</th>
                </tr>
              </thead>
              <tbody>
                {chosenAnimals.map((animal) => (
                  <tr key={animal.animal_id}>
                    <td>{animal.name}</td>
                    <td>{animal.birthDate}</td>
                    <td>{animal.deathDate}</td>
                    <td>{animal.sex}</td>
                    <td>{animal.birthType}</td>
                    <td>{animal.sireName}</td>
                    <td>{animal.damName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
