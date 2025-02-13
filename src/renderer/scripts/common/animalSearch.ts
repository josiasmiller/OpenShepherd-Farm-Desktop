import { Animal } from "../../../database";

export const init = () => {
  console.log("Animal Search Page Loaded");

  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
      searchButton.addEventListener("click", async () => {
          console.log("Search button clicked!");
          await fetchAndDisplayAnimals();
      });
  }
};

const fetchAndDisplayAnimals = async () => {
  try {
      const animals = await (window as any).electronAPI.animalSearch();
      console.log("🐾 Animals retrieved:", animals);

      const resultsTable = document.getElementById("resultsTable");
      if (resultsTable == null) {
        throw new TypeError("reusltsTable is null");
      }

      const resultsTableBody = resultsTable.getElementsByTagName("tbody")[0];

      // Clear any previous search results
      resultsTableBody.innerHTML = '';

      // Loop through the animals and create rows
      animals.forEach((animal: Animal) => {
          const row = resultsTableBody.insertRow();

          const nameCell = row.insertCell();
          nameCell.textContent = animal.name;

          const birthCell = row.insertCell();
          birthCell.textContent = animal.birthDate;

          const deathCell = row.insertCell();
          birthCell.textContent = animal.deathDate;
      });
  } catch (error) {
      console.error("Failed to load animals:", error);
  }
};

