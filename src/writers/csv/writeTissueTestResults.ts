import fs from "fs";
import { AnimalIdentification, TissueTestResult, getAnimalIdentification, getTissueTestResults } from "../../database/index";
import { handleResult, Result } from "../../shared/results/resultTypes";
import { dialog } from "electron";


export const writeTissueTestResults = async (animalIds: string[]): Promise<boolean> => {

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
    const csvData = await generateTissueTestResultsCsvFromAnimalIds(animalIds);
    fs.writeFileSync(filePath, csvData, { encoding: "utf8" });
    console.log(`CSV successfully written to ${filePath}`);
    return true;
  } catch (error) {
    console.error("Failed to write CSV file:", error);
    return false;
  }
};
  

export const generateTissueTestResultsCsvFromAnimalIds = async (animalIds: string[]): Promise<string> => {
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

  for (const animalId of animalIds) {
    try {
      const tissueTestResult: Result<TissueTestResult[], string> = await getTissueTestResults(animalId);

      var ttResults: TissueTestResult[] = [];

      handleResult(tissueTestResult, {
        success: (data : TissueTestResult[]) => {
            ttResults = data;
        },
        error: (err) => {
          console.error("Failed to fetch tissue test results:", err);
        },
      });

      // get all pertinent animal Identifications
      const animalIdentificationResult: Result<AnimalIdentification, string> = await getAnimalIdentification(animalId);
      var animalIdentification : AnimalIdentification | null = null;
      var animalIdentificationSucceeded: boolean = false;

      handleResult(animalIdentificationResult, {
        success: (data : AnimalIdentification) => {
          animalIdentification = data;
          animalIdentificationSucceeded = true;
        },
        error: (err) => {
          console.error("Failed to fetch Animal Notes:", err);
        },
      });

      if (!animalIdentificationSucceeded) {
        continue;
      }

      for (const entry of ttResults) {
        const row = [
          animalIdentification!.flockPrefix,
          animalIdentification!.name,
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
      console.error(`Error fetching tissue test results for animalId ${animalId}:`, error);
    }
  }

  return csvRows.join("\n");
};