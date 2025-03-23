import { AnimalSearchResult } from "../../../database";
import { showErrorPopup } from "./utils/notifications.js";

export const init = () => {
  console.log("Animal Search Page Loaded");

  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
      searchButton.addEventListener("click", async () => {
          console.log("Search button clicked!");
          await fetchAndDisplayAnimals();
      });
  }

  const nextPageButton = document.getElementById("moveToNextPage");
  if (nextPageButton) {
      nextPageButton.addEventListener("click", async () => {
          console.log("move button clicked!");
          await moveToNextPage();
      });
  }
};

const moveToNextPage = async () => {
  console.log("Moving to next page with selected animals!");

  const chosenTable = document.querySelector("#chosenTableContainer table");
  if (!chosenTable) {
      console.log("No chosen table found.");
      return;
  }

  const rows = chosenTable.querySelectorAll("tbody tr");
  if (rows.length === 0) {
      console.log("No selected animals found.");
      return;
  }

  rows.forEach((row, index) => {
    const rowData: string[] = []; // Explicitly define rowData as a string array
    row.querySelectorAll("td").forEach((cell) => {
        rowData.push(cell.textContent?.trim() || ""); // Use optional chaining to prevent null issues
    });
    console.log(`Row ${index + 1}:`, rowData);
  });

};

const fetchAndDisplayAnimals = async () => {
  try {
    const name = (document.getElementById("searchName") as HTMLInputElement).value;
    const status = (document.getElementById("searchStatus") as HTMLSelectElement).value;
    const registrationType = (document.getElementById("searchRegistrationType") as HTMLSelectElement).value;
    const registrationNumber = (document.getElementById("searchRegistrationNumber") as HTMLInputElement).value;
  
    const birthStartDate = (document.getElementById("searchBirthDateStart") as HTMLInputElement).value;
    const birthEndDate = (document.getElementById("searchBirthDateEnd") as HTMLInputElement).value;
    const deathStartDate = (document.getElementById("searchDeathDateStart") as HTMLInputElement).value;
    const deathEndDate = (document.getElementById("searchDeathDateEnd") as HTMLInputElement).value;
  
    const queryParams = {
      name: name || null,
      status: status || null,
      registrationType: registrationType || null,
      registrationNumber: registrationNumber || null,
      birthStartDate: birthStartDate || null,
      birthEndDate: birthEndDate || null,
      deathStartDate: deathStartDate || null,
      deathEndDate: deathEndDate || null,
    };

    const animals = await (window as any).electronAPI.animalSearch(queryParams);
    console.log("-- Animals retrieved:", animals);

    const resultsMessage = document.getElementById("resultsMessage");
    const resultsTableContainer = document.getElementById("resultsTableContainer");

    if (!resultsMessage || !resultsTableContainer) {
      throw new TypeError("Results message or table container is null.");
    }

    // Clear previous results
    resultsTableContainer.innerHTML = '';

    if (animals.length === 0) {
      resultsMessage.textContent = "No animals found.";
      resultsMessage.style.display = "block";
      return;
    }

    resultsMessage.style.display = "none";

    // Create results table
    const resultsTable = createTable("resultsTable");
    const resultsTableBody = resultsTable.getElementsByTagName("tbody")[0];
    resultsTableBody.innerHTML = ''; // Clear previous results

    // Populate table
    animals.forEach((animal: AnimalSearchResult) => {
      const row = resultsTableBody.insertRow();

      // Create button cell
      const buttonCell = row.insertCell();
      buttonCell.style.textAlign = "center"; // Center the button within the cell

      const selectButton = document.createElement("button");
      selectButton.textContent = "Select";
      selectButton.classList.add("standard-button"); // Add a CSS class for styling

      selectButton.addEventListener("click", () => addToChosenAnimals(animal));

      buttonCell.appendChild(selectButton);

      // Name cell
      const nameCell = row.insertCell();
      nameCell.textContent = animal.name;

      // Birth date cell
      const birthCell = row.insertCell();
      birthCell.textContent = animal.birthDate;

      // Death date cell
      const deathCell = row.insertCell();
      deathCell.textContent = animal.deathDate;
    });

    resultsTableContainer.appendChild(resultsTable);
  } catch (error) {
    console.error("Failed to load animals:", error);
    showErrorPopup(String(error));
  }
};


const addToChosenAnimals = (animal: AnimalSearchResult) => {
  const chosenTableContainer = document.getElementById("chosenTableContainer");

  if (!chosenTableContainer) {
    console.error("Chosen table container not found!");
    return;
  }

  // Create or get the chosen table
  let chosenTable = document.getElementById("chosenTable") as HTMLTableElement;
  if (!chosenTable) {
    chosenTable = createTable("chosenTable");
    chosenTableContainer.appendChild(chosenTable);
  }

  const chosenTableBody = chosenTable.getElementsByTagName("tbody")[0];

  // TODO: update how this logic is performed
  // Check if animal is already added
  if (Array.from(chosenTableBody.rows).some(row => row.cells[1].textContent === animal.name)) {
    console.warn("Animal already selected:", animal.name);
    return;
  }

  // Add new row
  const row = chosenTableBody.insertRow();

  // Create button cell for "Remove"
  const buttonCell = row.insertCell();
  buttonCell.style.textAlign = "center"; // Center the button within the cell

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("cancel-button"); // Add a CSS class for styling

  removeButton.addEventListener("click", () => row.remove());

  buttonCell.appendChild(removeButton);


  // Name cell
  const nameCell = row.insertCell();
  nameCell.textContent = animal.name;

  // Birth date cell
  const birthCell = row.insertCell();
  birthCell.textContent = animal.birthDate;

  // Death date cell
  const deathCell = row.insertCell();
  deathCell.textContent = animal.deathDate;
};


const createTable = (tableId: string): HTMLTableElement => {
  let table = document.getElementById(tableId) as HTMLTableElement;
  
  // If table exists, return it
  if (table) return table;

  // Otherwise, create a new table
  table = document.createElement("table");
  table.id = tableId;
  table.classList.add("results-table"); // Apply shared styles

  // Create table header
  const tableHeader = table.createTHead();
  const headerRow = tableHeader.insertRow();
  const headers = ["Select", "Name", "Birth Date", "Death Date"];
  
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  // Append a tbody
  table.appendChild(document.createElement("tbody"));

  return table;
};
