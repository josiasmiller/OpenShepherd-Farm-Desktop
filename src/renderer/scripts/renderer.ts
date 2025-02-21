
const content = document.getElementById("content");
const navLinks = document.querySelectorAll(".sidebar a");

// Attach page-specific JavaScript logic
const pageScripts: Record<string, () => Promise<any>> = {
  home: () => import("./common/home.js").then((module) => module.init()),
};

// mapping of HTML pages to their paths
const htmlPaths: Record<string, string> = {
  home: "common/home.html",
};

// mapping of TypeScript pages to their paths
const scriptPaths: Record<string, string> = {
  home: "./common/home.js",
};

// Function to load a page dynamically
const loadPage = async (page: string) => {
  try {
    if (!htmlPaths[page]) {
      throw new Error("Page not found in map");
    }

    // Load HTML
    const response = await fetch(`${htmlPaths[page]}`);
    if (!response.ok) throw new Error("Page not found");

    const html = await response.text();
    const content = document.getElementById("content");
    if (content) {
      content.innerHTML = html;
    }

    if (!pageScripts[page]) {
      throw new Error("Page not found in map");
    }

    const scriptPath = `${scriptPaths[page]}`

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

// Load the default page (Home)
loadPage("home");
