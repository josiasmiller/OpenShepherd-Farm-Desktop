import React from "react";
import { useLocation } from "react-router-dom";
import { AnimalSearchResult } from "../../../../database";
import Swal from "sweetalert2";
import { isRegistryEdition } from "../../../../scripts/appEdition";

const LandingPage = () => {
  const location = useLocation();
  const chosenAnimals: AnimalSearchResult[] = location.state?.chosenAnimals || [];

  const getAnimalIds = (): string[] => {
    return chosenAnimals.map(animal => animal.animal_id);
  };

  const saveEvaluationHistoryCsv = async () => {
    Swal.fire({
      title: "Not implemented (yet!)",
      text: "We are working on this functionality-- you should be able to use it soon :)",
      icon: "warning",
      confirmButtonText: "OK",
    });
  };
  

  const saveDrugHistoryCsv = async () => {  
    const animalIds: string[] = getAnimalIds();  
    const success = await window.electronAPI.exportDrugHistoryCsv(animalIds);

    if (success) {
      Swal.fire({
        title: "Success",
        text: "File saved successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "There was an error saving the file",
        icon: "error",
        confirmButtonText: "Continue",
      });
    }
  };
    
  
  const saveNoteHistoryCsv = async () => {
    const animalIds: string[] = getAnimalIds();
    const success = await window.electronAPI.exportAnimalNotesCsv(animalIds);
  
    if (success) {
      Swal.fire({
        title: "Success",
        text: "File saved successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "There was an error saving the file",
        icon: "error",
        confirmButtonText: "Continue",
      });
    }
  };
  
  
  const saveTissueTestResultHistoryCsv = async () => {    
    const animalIds: string[] = getAnimalIds();
    const success = await window.electronAPI.exportTissueTestResultsCsv(animalIds);
  
    if (success) {
      Swal.fire({
        title: "Success",
        text: "File saved successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "There was an error saving the file",
        icon: "error",
        confirmButtonText: "Continue",
      });
    }
  };

  const handleRegistryFeature = async () => {    
    Swal.fire({
      title: "This is a registry version!",
      text: "it built correctly!",
      icon: "success",
      confirmButtonText: "Cool!",
    });
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

          {isRegistryEdition() && (
            <button className="forward-button" onClick={handleRegistryFeature}>
              Registry Feature
            </button>
          )}
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
