import fs from "fs";
import { handleResult, Result } from "../../shared/results/resultTypes.js";
import { dialog } from "electron";
import { getEvaluationHistory, EvaluationEvent, AnimalIdentification, getAnimalIdentification} from "../../database/index.js";


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
    "Animal ID",
    "Flock Prefix",
    "Animal Name",
    "Trait ID",
    "Trait Name",
    "Trait Score",
    "Trait Units ID",
  ];
  csvRows.push(header.join(","));

  for (const animalId of animalIds) {
    try {
      const evalHistoryResult: Result<EvaluationEvent[], string> = await getEvaluationHistory(animalId);
      
      var evalEvents: EvaluationEvent[] = [];

      handleResult(evalHistoryResult, {
        success: (data : EvaluationEvent[]) => {
            evalEvents = data;
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

      for (const entry of evalEvents) {
        const row = [
          animalIdentification!.id,
          animalIdentification!.flockPrefix,
          animalIdentification!.name,
          entry.traitId,
          entry.traitReadable,
          entry.traitScore,
          entry.traitUnits,
        ];
        csvRows.push(row.map(value => `"${(value ?? "").toString().trim()}"`).join(","));
      }
      
    } catch (error) {
      console.error(`Error fetching Evaluation History for animalId ${animalId}:`, error);
    }
  }

  return csvRows.join("\n");
};