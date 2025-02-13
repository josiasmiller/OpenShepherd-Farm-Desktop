

export const showErrorPopup = (errorMessage: string) => {
  // Check for existing popups and remove them
  const existingPopup = document.getElementById("error-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create the popup container
  const errorPopup = document.createElement("div");
  errorPopup.id = "error-popup"; // The CSS will handle the styling

  // Create the error message
  const errorText = document.createElement("p");
  errorText.textContent = `Error: ${errorMessage}`;

  // Create a close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    errorPopup.remove();
  });

  // Append everything
  errorPopup.appendChild(errorText);
  errorPopup.appendChild(closeButton);
  document.body.appendChild(errorPopup); // Ensure it goes into the body

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorPopup) errorPopup.remove();
  }, 5000);
};
