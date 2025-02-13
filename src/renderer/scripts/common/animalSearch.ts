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

      const animalList = document.getElementById("animalList");
      if (animalList) {
          animalList.innerHTML = animals
              .map((animal: any) => `<li>${animal.name}</li>`)
              .join("");
      }
  } catch (error) {
      console.error("Failed to load animals:", error);
  }
};
