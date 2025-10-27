import React from "react";
import ReactDOM from "react-dom/client";
import { PageStateProvider } from "./context/pageStateContext";
import SessionPage from "./pages/session/SessionPage";

const root = document.getElementById("root") as HTMLElement;

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <PageStateProvider>
        <SessionPage />
      </PageStateProvider>
    </React.StrictMode>
  );
} else {
  console.error('No "root" element found in index.html');
}
