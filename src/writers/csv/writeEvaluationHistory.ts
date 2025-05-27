import fs from "fs";
// import { handleResult, Result } from "../../shared/results/resultTypes.js";
import { dialog } from "electron";


export const writeEvaluationHistoryCsv = async (animalIds: string[]): Promise<boolean> => {

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "Save Evaluation Hisypry CSV",
    defaultPath: "evaluation-history.csv",
    filters: [{ name: "CSV file", extensions: ["csv"] }],
  });
  
  if (canceled || !filePath) {
    console.log("User cancelled the file selection.");
    return false;
  }  

  try {
    const csvData = await generateEvaluationCsvFromAnimalIds(animalIds);
    fs.writeFileSync(filePath, csvData, { encoding: "utf8" });
    console.log(`CSV successfully written to ${filePath}`);
    return true;
  } catch (error) {
    console.error("Failed to write CSV file:", error);
    return false;
  }
};
  

export const generateEvaluationCsvFromAnimalIds = async (animalIds: string[]): Promise<string> => {
  let csvRows: string[] = [];

  // Headers
  const header = [
    "Flock Prefix",
    "Animal Name",
    "TODO",
  ];
  csvRows.push(header.join(","));

  for (const animalId of animalIds) {
    try {
      // get evaluation history for single animal


      
    } catch (error) {
      console.error(`Error fetching Evaluation History for animalId ${animalId}:`, error);
    }
  }

  return csvRows.join("\n");
};