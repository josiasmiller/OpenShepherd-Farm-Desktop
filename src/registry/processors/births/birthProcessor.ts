import { dialog } from "electron";
import path from "path";


export type BirthProcessorResponse = { 
  success: boolean; 
  didUserCancel: boolean;
  resultingDirectory: string 
};


export const birthProcessor = async (): Promise<BirthProcessorResponse> => {

  // Show the file selection dialog (CSV only)
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select CSV File",
    properties: ["openFile"],
    filters: [
      { name: "CSV Files", extensions: ["csv"] }
    ],
  });

  // Handle user cancellation
  if (canceled || filePaths.length === 0) {
    console.log("User cancelled CSV file selection.");
    return { success: false, didUserCancel: true, resultingDirectory: "" };
  }

  const selectedFile = filePaths[0];
  const directoryPath = path.dirname(selectedFile);
  

  return new Promise((resolve, reject) => {
    
    var resp = {
      success: true,
      didUserCancel: false,
      resultingDirectory: directoryPath,
    } as BirthProcessorResponse;
    
    resolve(resp);
  });
}