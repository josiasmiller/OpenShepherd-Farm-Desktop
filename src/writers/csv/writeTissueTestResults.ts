import fs from "fs";
import { TissueTestResult, getTissueTestResults } from "../../database/index.js";
import { handleResult, Result } from "../../shared/results/resultTypes.js";
import { AnimalInfo } from "../helpers/animalInfo";
import { dialog } from "electron";


export const writeTissueTestResults = async (animals: AnimalInfo[]): Promise<boolean> => {

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "Save Tissue Test Results CSV",
    defaultPath: "tissue-tests.csv",
    filters: [{ name: "CSV file", extensions: ["csv"] }],
  });
  
  if (canceled || !filePath) {
    console.log("User cancelled the file selection.");
    return false;
  }  

  try {
    const csvData = await generateTissueTestResultsCsvFromAnimalIds(animals);
    fs.writeFileSync(filePath, csvData, { encoding: "utf8" });
    console.log(`CSV successfully written to ${filePath}`);
    return true;
  } catch (error) {
    console.error("Failed to write CSV file:", error);
    return false;
  }
};
  

export const generateTissueTestResultsCsvFromAnimalIds = async (animals: AnimalInfo[]): Promise<string> => {
  let csvRows: string[] = [];

  // Header
  const header = [
    "Flock Prefix",
    "Animal Name",
    "Company",
    "Tissue Sample Type Name",
    "Tissue Sample Test Name",
    "Tissue Sample Date",
    "Tissue Sample Time",
    "Tissue Test Result Date",
    "Tissue Test Result Time",
    "Tissue Test Results",
  ];
  csvRows.push(header.join(","));

  for (const animal of animals) {
    try {
      const tissueTestResult: Result<TissueTestResult[], string> = await getTissueTestResults(animal.id);

      var ttResults: TissueTestResult[] = [];

      handleResult(tissueTestResult, {
        success: (data : TissueTestResult[]) => {
            ttResults = data;
        },
        error: (err) => {
          console.error("Failed to fetch tissue test results:", err);
        },
      });

      for (const entry of ttResults) {
        const row = [
          entry.flockPrefix,
          entry.animalName,
          entry.company,
          entry.tissueSampleTypeName,
          entry.tissueSampleTestName,
          entry.tissueSampleDate,
          entry.tissueSampleTime,
          entry.tissueTestResultsDate,
          entry.tissueTestResultsTime,
          entry.tissueTestResults,
        ];
        csvRows.push(row.map(value => `"${(value ?? "").toString().trim()}"`).join(","));

      }
    } catch (error) {
      console.error(`Error fetching tissue test results for animalId ${animal.id}, Name ${animal.name}:`, error);
    }
  }

  return csvRows.join("\n");
};