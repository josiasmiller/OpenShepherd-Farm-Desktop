
const content = document.getElementById("content");
const navLinks = document.querySelectorAll(".sidebar a");

// Attach page-specific JavaScript logic
const pageScripts: Record<string, () => Promise<any>> = {
  // home:         () => import("./renderer/scripts/common/home.js").then((module) => module.init()),
  home:         () => import("./common/home.js").then((module) => module.init()),
  animalSearch: () => import("./common/animalSearch.js").then((module) => module.init()),
};

// Define a mapping of pages to their paths
const pagePaths: Record<string, string> = {
  home: "common/home.html",
  animalSearch: "common/animalSearch.html",
};

// Function to load a page dynamically
const loadPage = async (page: string) => {
  try {
    if (!pagePaths[page]) {
      throw new Error("Page not found in map");
    }

    // Load HTML
    const response = await fetch(`${pagePaths[page]}`);
    if (!response.ok) throw new Error("Page not found");

    const html = await response.text();
    const content = document.getElementById("content");
    if (content) {
      content.innerHTML = html;
    }

    // Dynamically import page-specific JS
    const scriptPath = `./common/${page}.js`;
    import(scriptPath)
      .then((module) => {
        if (module.init) module.init();
      })
      .catch((err) => console.error(`Failed to load ${scriptPath}`, err));
  } catch (error) {
    console.error("Error loading page:", error);
  }
};

const attachPageScripts = (page: string) => {
  const loadScript = pageScripts[page];
  if (loadScript) {
    loadScript();
  } else {
    console.warn(`No script found for page: ${page}`);
  }
};

// Add event listeners to sidebar buttons
navLinks.forEach((button) => {
  button.addEventListener("click", (event) => {
    const target = event.currentTarget as HTMLButtonElement;
    const page = target.dataset.page;
    if (page) loadPage(page);
  });
});

// allow user to click on the button at the bottom of the left sidebar to select a new DB file
document.addEventListener("DOMContentLoaded", () => {
  const selectDbButton = document.getElementById("selectDbButton") as HTMLButtonElement;
  const dbFileName = document.getElementById("dbFileName") as HTMLParagraphElement;

  if (selectDbButton && dbFileName) {
      // Request main process to open file dialog
      selectDbButton.addEventListener("click", async () => {
          const filePath: string | null = await (window as any).electronAPI.selectDatabase();
          if (filePath) {
              dbFileName.textContent = filePath; // Display chosen database file
          }
      });
  }
});

console.log("window.electronAPI:", (window as any).electronAPI);



// Load the default page (Home)
loadPage("home");
