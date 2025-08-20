import { dialog } from "electron";

export const pngFileDialog = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: "Select PNG File",
    properties: ["openFile"],
    filters: [{ name: "PNG file", extensions: ["PNG", "png"] }],
  });

  if (filePaths.length > 0) {
    const pngPath = filePaths[0];
    return pngPath;
  }

  return null; // No file selected
};