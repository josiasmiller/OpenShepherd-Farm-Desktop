import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimalSearchResult } from "../../../../database";
import Swal from "sweetalert2";
import { isRegistryVersion } from "../../../../scripts/appVersion";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";

const LandingPage = () => {

  const [showRegistryFeatures, setShowRegistryFeatures] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStr, setLoadingStr] = useState<string>("");

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
    if (isLoading) {
      return; // bail out if loading something already
    }
    setLoadingStr("Saving Drug History...");
    setIsLoading(true);
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

    setIsLoading(false);
  };
    
  
  const saveNoteHistoryCsv = async () => {
    if (isLoading) {
      return; // bail out if loading something already
    }

    setLoadingStr("Saving Note History...");
    setIsLoading(true);

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

    setIsLoading(false);
  };
  
  
  const saveTissueTestResultHistoryCsv = async () => {
    if (isLoading) {
      return; // bail out if loading something already
    }  

    setLoadingStr("Saving Tissue Test Results...");
    setIsLoading(true);

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

    setIsLoading(false);
  };

  const printRegistryPapers = async (registrationType: "black" | "white" | "chocolate") => {
    if (isLoading) {
      return; // bail out if loading something already
    }

    setLoadingStr("Saving Registry Papers...");
    setIsLoading(true);

    const animalIds: string[] = getAnimalIds();

    const response = await window.electronAPI.exportRegistration(animalIds, registrationType);

    if (response.success) {

      Swal.fire({
        title: "Success",
        text: "PDF saved successfully",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Open Folder",
        cancelButtonText: "OK",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.electronAPI.openDirectory(response.resultingDirectory);
        }
      });

    } else {
      Swal.fire({
        title: "Error",
        text: "There was an error saving the file",
        icon: "error",
        confirmButtonText: "Continue",
      });
    }

    setIsLoading(false);
  };

  const handleNotImplemented = async () => {
    Swal.fire({
      title: "Not Implemented",
      text: "This is not implemented yet",
      icon: "info",
      confirmButtonText: "Shucks...",
    });
  }

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

      {isRegistryVersion() &&
        <CollapsibleSection
          title="Registry Features"
          isOpen={showRegistryFeatures}
          onToggle={() => setShowRegistryFeatures(!showRegistryFeatures)}
        >
          <div className="action-buttons registry-section">
            <button className="forward-button" onClick={() => {printRegistryPapers("black")}}>
              Print Black Welsh Registration
            </button>

            <button className="forward-button" onClick={() => {printRegistryPapers("white")}}>
              Print White Welsh Registration
            </button>

            {/* <button className="forward-button" onClick={() => {printRegistryPapers("chocolate")}}> */}
            <button className="forward-button" onClick={handleNotImplemented}>
              Print Chocolate Welsh Registration
            </button>
          </div>
        </CollapsibleSection>
      }

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


      <LoadingIndicator isLoading={isLoading} message={loadingStr} />
    </div>
  );
};

export default LandingPage;
