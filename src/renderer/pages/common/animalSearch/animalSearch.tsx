import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import { BackButton } from "../../../components/backButton/backButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimalSearchRequest, AnimalSearchResult } from "../../../../database";

import Swal from "sweetalert2";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import {isRegistryDesktop} from "../../../../app/appBuild";
import { usePageState } from "../../../context/pageStateContext";

const AnimalSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { savePageState, getPageState } = usePageState();

  // State for search filters
  const [searchParams, setSearchParams] = useState({
    name: "",
    status: "",
    registrationType: "",
    registrationNumber: "",
    birthStartDate: "",
    birthEndDate: "",
    deathStartDate: "",
    deathEndDate: "",
    federalTag: "",
    farmTag: "",
    isAlreadyPrinted: null,
  });

  // State for results
  const [results, setResults] = useState<AnimalSearchResult[]>([]);
  const [chosenAnimals, setChosenAnimals] = useState<AnimalSearchResult[]>([]);
  const [message, setMessage] = useState("Search for animals to display results.");

  // Restore state on mount
  useEffect(() => {
    const saved = getPageState(location.pathname);
    if (saved) {
      if (saved.results) setResults(saved.results);
      if (saved.chosenAnimals) setChosenAnimals(saved.chosenAnimals);
      if (saved.searchParams) setSearchParams(saved.searchParams);
    }
  }, [location.pathname, getPageState]);

  // Save before leaving
  useEffect(() => {
    return () => {
      savePageState(location.pathname, {
        results,
        chosenAnimals,
        searchParams,
      });
    };
  }, [location.pathname, results, chosenAnimals, searchParams, savePageState]);

  const [showSearch, setShowSearch] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [showChosen, setShowChosen] = useState(true);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);


  // state for if an active search is underway
  const [isSearchingForAnimals, setIsSearchingForAnimals] = useState(false);


  const handleChooseAnimals = async () => {
    if (!chosenAnimals || chosenAnimals.length === 0) {
      await Swal.fire({
        title: "No animals selected",
        text: "You must select at least one animal before proceeding.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Confirm Selection`,
      text: `Would you like to select ${chosenAnimals.length} animal${chosenAnimals.length > 1 ? "s" : ""}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      navigate("/landing", { state: { chosenAnimals } });
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    let parsedValue: any = value;

    if (id === "isAlreadyPrinted") {
      if (value === "") {
        parsedValue = null;
      } else if (value === "true") {
        parsedValue = true;
      } else if (value === "false") {
        parsedValue = false;
      }
    }

    setSearchParams((prev) => ({
      ...prev,
      [id]: parsedValue,
    }));
  };


  const fetchAndDisplayAnimals = async () => {

    // exit early if a search is already underway
    if (isSearchingForAnimals) {
      return;
    }

    setIsSearchingForAnimals(true);

    try{
      const animalRequest: AnimalSearchRequest = {};

      if (searchParams.name != null && searchParams.name != "") {
        animalRequest.name = searchParams.name;
      }

      if (searchParams.status != null && searchParams.status != "") {
        animalRequest.status = searchParams.status;
      }

      if (searchParams.registrationType != null && searchParams.registrationType != "") {
        animalRequest.registrationType = searchParams.registrationType;
      }

      if (searchParams.registrationNumber != null && searchParams.registrationNumber != "") {
        animalRequest.registrationNumber = searchParams.registrationNumber;
      }

      if (searchParams.birthStartDate != null && searchParams.birthStartDate != "") {
        animalRequest.birthStartDate = searchParams.birthStartDate;
      }

      if (searchParams.birthEndDate != null && searchParams.birthEndDate != "") {
        animalRequest.birthEndDate = searchParams.birthEndDate;
      }

      if (searchParams.deathStartDate != null && searchParams.deathStartDate != "") {
        animalRequest.deathStartDate = searchParams.deathStartDate;
      }

      if (searchParams.deathEndDate != null && searchParams.deathEndDate != "") {
        animalRequest.deathEndDate = searchParams.deathEndDate;
      }

      if (searchParams.federalTag != null && searchParams.federalTag != "") {
        animalRequest.federalTag = searchParams.federalTag;
      }

      if (searchParams.farmTag != null && searchParams.farmTag != "") {
        animalRequest.farmTag = searchParams.farmTag;
      }

      if (searchParams.isAlreadyPrinted != null) {
        animalRequest.isAlreadyPrinted = searchParams.isAlreadyPrinted;
      }

      const animals: AnimalSearchResult[] = await window.electronAPI.animalSearch(animalRequest);

      if (animals.length === 0) {
        setMessage("No animals found.");
        setResults([]);
      } else {
        setMessage("");
        setResults(animals);
      }

    } catch (err) {
      console.error("Animal search failed:", err);
      await Swal.fire("Error", "An error occurred while searching for animals.", "error");
    } finally {
      setIsSearchingForAnimals(false);
    }
  };

  // Add an animal to chosen list
  const addToChosenAnimals = (animal: AnimalSearchResult) => {
    if (!chosenAnimals.some((a) => a.animal_id === animal.animal_id)) {
      setChosenAnimals([...chosenAnimals, animal]);
      setSelectionMessage(`${animal.name || 'Animal'} selected`);

      // Clear message after 3 seconds
      setTimeout(() => {
        setSelectionMessage(null);
      }, 3000);
    }
  };

  const handleSelectAllClick = () => {
    Swal.fire({
      title: 'Select All Animals?',
      text: `Are you sure you want to select all ${results.length} animals in the list?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, select all',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const existingIds = new Set(chosenAnimals.map((a) => a.animal_id));
        const newAnimals = results.filter((a) => !existingIds.has(a.animal_id));

        if (newAnimals.length > 0) {
          setChosenAnimals([...chosenAnimals, ...newAnimals]);
          setSelectionMessage(`${newAnimals.length} animal(s) selected`);
        } else {
          setSelectionMessage('All animals are already selected');
        }

        setTimeout(() => {
          setSelectionMessage(null);
        }, 3000);

        Swal.fire('Selected!', 'Animals have been added to your selection.', 'success');
      }
    });
  };



  // Remove an animal from chosen list
  const removeFromChosenAnimals = (animalId: string) => {
    const removedAnimal = chosenAnimals.find((animal) => animal.animal_id === animalId);
    setChosenAnimals(chosenAnimals.filter((animal) => animal.animal_id !== animalId));

    if (removedAnimal) {
      setSelectionMessage(`${removedAnimal.name || 'Animal'} removed from selection`);

      setTimeout(() => {
        setSelectionMessage(null);
      }, 3000);
    }
  };

  const handleRemoveAllClick = () => {
    if (chosenAnimals.length === 0) {
      setSelectionMessage('No animals to remove');
      setTimeout(() => setSelectionMessage(null), 3000);
      return;
    }

    Swal.fire({
      title: 'Remove All Selected Animals?',
      text: 'Are you sure you want to remove all animals from your selection?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove all',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setChosenAnimals([]);
        setSelectionMessage('All animals removed');

        setTimeout(() => {
          setSelectionMessage(null);
        }, 3000);

        Swal.fire('Removed!', 'All animals have been removed from your selection.', 'success');
      }
    });
  };

  // Remove duplicates based on animal_id
  const uniqueResults: AnimalSearchResult[] = Array.from(
    new Map<string, AnimalSearchResult>(
      results.map((animal) => [animal.animal_id, animal])
    ).values()
  );
  
  return (
    <div className="animal-search-container">

      <div style={{ display: "flex", justifyContent: "flex-start", padding: "1rem" }}>
        <BackButton />
      </div>

      <CollapsibleSection
        title="Search for Animals"
        isOpen={showSearch}
        onToggle={() => setShowSearch(!showSearch)}
      >
        <div className="search-section">
          <div className="search-filters">
            <div>
              <label htmlFor="name">Animal Name</label>
              <input
                type="text"
                id="name"
                value={searchParams.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />
            </div>
            <div>
              <label htmlFor="searchRegistrationType">Registration Type</label>
              <select id="searchRegistrationType" value={searchParams.registrationType} onChange={handleChange}>
                <option value="">Select Type</option>
              </select>
            </div>
            <div>
              <label htmlFor="registrationNumber">Registration Number</label>
              <input
                type="text"
                id="registrationNumber"
                value={searchParams.registrationNumber}
                onChange={handleChange}
                placeholder="Enter Number"
              />
            </div>
          </div>

          <div className="search-filters">
            <div>
              <label htmlFor="birthStartDate">Birth Date (Start)</label>
              <input
                type="date"
                id="birthStartDate"
                value={searchParams.birthStartDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="birthEndDate">Birth Date (End)</label>
              <input
                type="date"
                id="birthEndDate"
                value={searchParams.birthEndDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="deathStartDate">Death Date (Start)</label>
              <input
                type="date"
                id="deathStartDate"
                value={searchParams.deathStartDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="deathEndDate">Death Date (End)</label>
              <input
                type="date"
                id="deathEndDate"
                value={searchParams.deathEndDate}
                onChange={handleChange}
              />
            </div>
          </div>


          <div className="search-filters">
            <div>
              <label htmlFor="federalTag">Federal Tag</label>
              <input
                type="text"
                id="federalTag"
                value={searchParams.federalTag}
                onChange={handleChange}
                placeholder="Enter Federal Tag"
              />
            </div>
            <div>
              <label htmlFor="farmTag">Farm Tag</label>
              <input
                type="text"
                id="farmTag"
                value={searchParams.farmTag}
                onChange={handleChange}
                placeholder="Enter Farm Tag"
              />
            </div>
          </div>

          {isRegistryDesktop() &&
            <div className="search-filters">
              <div>
                <label htmlFor="isAlreadyPrinted">Registrations Printed</label>
                <select
                  id="isAlreadyPrinted"
                  value={searchParams.isAlreadyPrinted ?? ''}
                  onChange={handleChange}
                >
                  <option value="">Any</option>
                  <option value="true">Printed</option>
                  <option value="false">Not Printed</option>
                </select>
              </div>
            </div>
          }

          <div className="search-button-container">
            <button
              onClick={fetchAndDisplayAnimals}
              className="forward-button wide-button"
              disabled={isSearchingForAnimals}
            >
              {isSearchingForAnimals ? "Searching..." : "Search"}
            </button>
          </div>

        </div>

      </CollapsibleSection>


      {/* RESULTS SECTION */}
      <CollapsibleSection
        title="Results"
        isOpen={showResults}
        onToggle={() => setShowResults(!showResults)}
      >
        <div className="results-section">
          {message && <div className="results-message">{message}</div>}

          {uniqueResults.length > 0 && (

            <div id="resultsTableContainer">

              <div>
                <button
                  className="standard-button"
                  onClick={handleSelectAllClick}
                >
                  Select All
                </button>
              </div>

              <br></br>

              <table className="results-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Flock Prefix</th>
                    <th>Name</th>
                    <th>Registration Number</th>
                    <th>Birth Date</th>
                    <th>Death Date</th>
                    <th>Sex</th> 
                    <th>Birth Type</th>
                    <th>Official ID</th>
                    <th>Farm ID</th>
                    <th>Sire Flock Prefix</th>
                    <th>Sire Name</th>
                    <th>Dam Flock Prefix</th>
                    <th>Dam Name</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueResults.map((animal) => (
                    <tr key={animal.animal_id}>
                      <td>
                        <button
                          onClick={() => addToChosenAnimals(animal)}
                          className="standard-button"
                        >
                          Select
                        </button>
                      </td>
                      <td>{animal.flockPrefix}</td>
                      <td>{animal.name}</td>
                      <td>{animal.registration}</td>
                      <td>{animal.birthDate}</td>
                      <td>{animal.deathDate}</td>
                      <td>{animal.sex}</td> 
                      <td>{animal.birthType}</td>
                      <td>{animal.latestOfficialID}</td>
                      <td>{animal.latestFarmID}</td>
                      <td>{animal.sireFlockPrefix}</td>
                      <td>{animal.sireName}</td>
                      <td>{animal.damFlockPrefix}</td>
                      <td>{animal.damName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CollapsibleSection>
      
      
      {/* CHOSEN SECTION */}
      <CollapsibleSection
        title="Selected Animals"
        isOpen={showChosen}
        onToggle={() => setShowChosen(!showChosen)}
      >
        <div className="chosen-section">
          <div className="chosen-header">
            <button className="wide-button" onClick={handleChooseAnimals}>Choose Animals</button>
          </div>

          {chosenAnimals.length > 0 && (
            <div id="chosenTableContainer">

              <div>
                <button
                  className="cancel-button"
                  onClick={handleRemoveAllClick}
                >
                  Deselect All
                </button>
              </div>

              <br></br>

              <table className="chosen-table">
                <thead>
                  <tr>
                    <th>Remove</th>
                    <th>Flock Prefix</th>
                    <th>Name</th>
                    <th>Registration Number</th>
                    <th>Birth Date</th>
                    <th>Death Date</th>
                    <th>Sex</th> 
                    <th>Birth Type</th>
                    <th>Official ID</th>
                    <th>Farm ID</th>
                    <th>Sire Flock Prefix</th>
                    <th>Sire Name</th>
                    <th>Dam Flock Prefix</th>
                    <th>Dam Name</th>
                  </tr>
                </thead>
                <tbody>
                  {chosenAnimals.map((animal) => (
                    <tr key={animal.animal_id}>
                      <td>
                        <button onClick={() => removeFromChosenAnimals(animal.animal_id)} className="cancel-button">
                          Remove
                        </button>
                      </td>
                      <td>{animal.flockPrefix}</td>
                      <td>{animal.name}</td>
                      <td>{animal.registration}</td>
                      <td>{animal.birthDate}</td>
                      <td>{animal.deathDate}</td>
                      <td>{animal.sex}</td> 
                      <td>{animal.birthType}</td>
                      <td>{animal.latestOfficialID}</td>
                      <td>{animal.latestFarmID}</td>
                      <td>{animal.sireFlockPrefix}</td>
                      <td>{animal.sireName}</td>
                      <td>{animal.damFlockPrefix}</td>
                      <td>{animal.damName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      
      </CollapsibleSection>


      <LoadingIndicator
        isLoading={isSearchingForAnimals}
        message="Searching for animals..."
      />

      {selectionMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "8px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {selectionMessage}
        </div>
      )}


      
    </div>
  );
};

export default AnimalSearch;
