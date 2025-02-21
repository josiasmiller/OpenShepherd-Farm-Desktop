

export const init = () => {
    console.log("Home Page Loaded");
  
    const homeButton = document.getElementById("home-btn");
    if (homeButton) {
      homeButton.addEventListener("click", () => {
        console.log("Home button clicked!");
      });
    }
  };