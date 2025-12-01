import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimalSearchResult } from '@app/api';
import Swal from "sweetalert2";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import { BackButton } from "../../../components/buttons/backButton";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import { isRegistryDesktop } from '@app/buildVariant';

const LandingPage = () => {

  const [showRegistryFeatures, setShowRegistryFeatures] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStr, setLoadingStr] = useState<string>("");
  const [signaturePath, setSignaturePath] = useState<string | null>(null);

  const location = useLocation();
  const chosenAnimals: AnimalSearchResult[] = location.state?.chosenAnimals || [];

  useEffect(() => {
    const loadData = async () => {

      const signatureFp = await window.storeAPI.getSelectedSignatureFilePath();

      if (signatureFp) {
        setSignaturePath(signatureFp);
      }
    }; // end loadData definition
  
    loadData();
  }, []); 

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
    const success = await window.exportAPI.drugHistoryCsv(animalIds);

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
    const success = await window.exportAPI.notesCsv(animalIds);
  
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
    const success = await window.exportAPI.tissueTestResultsCsv(animalIds);
  
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

    const response = await window.exportAPI.registration(
      animalIds, 
      registrationType, 
      signaturePath ?? null,
    );

    if (response.success) {

      var warnings : string[] = response.warnings;

      // Format warnings as HTML
      const warningHtml = warnings.length
        ? `<div style="text-align: left;">
            <h4>Warnings:</h4>
            <ul>
              ${warnings.map(w => `<li>${w}</li>`).join("")}
            </ul>
          </div>`
        : "";

      Swal.fire({
        title: "Success",
        html: `PDF saved successfully.<br/><br/>${warningHtml}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Open Folder",
        cancelButtonText: "OK",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.systemAPI.openDirectory(response.resultingDirectory);
        }
      });

    } else {
      const errorListHtml = response.errors.map(error => `<li>${error}</li>`).join("");

      Swal.fire({
        title: "Error",
        html: `
          <p>There was an error saving the file:</p>
          <ul>${errorListHtml}</ul>
        `,
        icon: "error",
        confirmButtonText: "Continue",
      });
    }

    setIsLoading(false);
  };

  const handleChooseSignature = async () => {
    const fp : string = await window.systemAPI.selectPngFile();
    
    if (fp) {
      setSignaturePath(fp);
      await window.storeAPI.setSelectedSignatureFilePath(fp);
    }
  };

  return (
    <div className="landing-page-container">
      
      <div style={{ display: "flex", justifyContent: "flex-start", padding: "1rem" }}>
        <BackButton />
      </div>

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

      {isRegistryDesktop() &&
        <CollapsibleSection
          title="Registry Features"
          isOpen={showRegistryFeatures}
          onToggle={() => setShowRegistryFeatures(!showRegistryFeatures)}
        >
          <div className="action-buttons registry-section">

            <div style={{ marginBottom: "1rem" }}>
              <button className="forward-button" onClick={handleChooseSignature}>
                Choose Signature Image
              </button>
              {signaturePath && (
                <span style={{ marginLeft: "1rem" }}>
                  Selected: {signaturePath}
                </span>
              )}
            </div>


            <button className="forward-button" onClick={() => {printRegistryPapers("black")}}>
              Print Black Welsh Registration
            </button>

            <button className="forward-button" onClick={() => {printRegistryPapers("white")}}>
              Print White Welsh Registration
            </button>

            <button className="forward-button" onClick={() => {printRegistryPapers("chocolate")}}>
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
