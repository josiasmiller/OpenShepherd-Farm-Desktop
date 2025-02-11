

export const init = () => {
    console.log("Animal Search Page Loaded");

    const searchButton = document.getElementById("search-btn");
    if (searchButton) {
        searchButton.addEventListener("click", () => {
            console.log("Search button clicked!");
        });
    }
};
  