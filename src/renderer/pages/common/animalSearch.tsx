import React from "react";
import { useState } from "react";
import { AnimalSearchResult } from "../../../database";

const AnimalSearch: React.FC = () => {
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
  });

  // State for results
  const [results, setResults] = useState<AnimalSearchResult[]>([]);
  const [chosenAnimals, setChosenAnimals] = useState<AnimalSearchResult[]>([]);
  const [message, setMessage] = useState("Search for animals to display results.");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, [e.target.id]: e.target.value });
  };

  const fetchAndDisplayAnimals = async () => {
    console.log("Fetching animals with:", searchParams);

    // Simulate API call
    const animals: AnimalSearchResult[] = await (window as any).electronAPI.animalSearch(searchParams);

    if (animals.length === 0) {
      setMessage("No animals found.");
      setResults([]);
    } else {
      setMessage("");
      setResults(animals);
    }
  };

  // Add an animal to chosen list
  const addToChosenAnimals = (animal: AnimalSearchResult) => {
    if (!chosenAnimals.some((a) => a.animal_id === animal.animal_id)) {
      setChosenAnimals([...chosenAnimals, animal]);
    }
  };

  // Remove an animal from chosen list
  const removeFromChosenAnimals = (animalId: string) => {
    setChosenAnimals(chosenAnimals.filter((animal) => animal.animal_id !== animalId));
  };

  return (
    <div className="animal-search-container">
      {/* SEARCH SECTION */}
      <div className="search-section">
        <h2>Search for an Animal</h2>
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
            <label htmlFor="searchStatus">Animal Status</label>
            <select id="searchStatus" value={searchParams.status} onChange={handleChange}>
              <option value="">Select Status</option>
            </select>
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


        <div className="search-filters">
          <button onClick={fetchAndDisplayAnimals} className="forward-button">Search</button>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="results-section">
        <h2>Results</h2>
        {message && <div className="results-message">{message}</div>}

        {results.length > 0 && (
          <div id="resultsTableContainer">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Birth Date</th>
                  <th>Death Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((animal) => (
                  <tr key={animal.animal_id}>
                    <td>
                      <button
                        onClick={() => addToChosenAnimals(animal)}
                        className="standard-button"
                      >
                        Select
                      </button>
                    </td>
                    <td>{animal.name}</td>
                    <td>{animal.birthDate}</td>
                    <td>{animal.deathDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CHOSEN SECTION */}
      <div className="chosen-section">
        <div className="chosen-header">
          <h2>Selected Animals</h2>
          <button className="forward-button">Choose Animals</button>
        </div>

        {chosenAnimals.length > 0 && (
          <div id="chosenTableContainer">
            <table className="chosen-table">
              <thead>
                <tr>
                  <th>Remove</th>
                  <th>Name</th>
                  <th>Birth Date</th>
                  <th>Death Date</th>
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
                    <td>{animal.name}</td>
                    <td>{animal.birthDate}</td>
                    <td>{animal.deathDate}</td>
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

export default AnimalSearch;
