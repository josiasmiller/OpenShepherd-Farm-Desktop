import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App"; 
import { PageStateProvider } from "./context/pageStateContext";

const root = document.getElementById("root") as HTMLElement;

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <PageStateProvider>
        <App />
      </PageStateProvider>
    </React.StrictMode>
  );
} else {
  console.error('No "root" element found in index.html');
}