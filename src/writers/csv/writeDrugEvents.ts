import fs from "fs";
import { AnimalIdentification, DrugEvent, getAnimalIdentification, getDrugHistory } from "../../database";
import { handleResult, Result } from "../../shared/results/resultTypes";
import { dialog } from "electron";


export const writeDrugHistoryCsv = async (animalIds: string[]): Promise<boolean> => {

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "Save Drug History CSV",
    defaultPath: "drug-history.csv",
    filters: [{ name: "CSV file", extensions: ["csv"] }],
  });
  
  if (canceled || !filePath) {
    console.log("User cancelled the file selection.");
    return false;
  }  

  try {
    const csvData = await generateCsvFromAnimalIds(animalIds);
    fs.writeFileSync(filePath, csvData, { encoding: "utf8" });
    console.log(`CSV successfully written to ${filePath}`);
    return true;
  } catch (error) {
    console.error("Failed to write CSV file:", error);
    return false;
  }
};
  

export const generateCsvFromAnimalIds = async (animalIds: string[]): Promise<string> => {
  let csvRows: string[] = [];

  // Header
  const header = [
    "Flock Prefix",
    "Animal Name",
    "Drug Lot",
    "Drug Trade Name",
    "Drug Generic Name",
    "Date On",
    "Time On",
    "Date Off",
    "Time Off",
    "Dosage",
    "Location Name"
  ];
  csvRows.push(header.join(","));

  for (const animalId of animalIds) {
    try {
      const drugEventsResult: Result<DrugEvent[], string> = await getDrugHistory(animalId);

      var drugEvents: DrugEvent[] = [];

      handleResult(drugEventsResult, {
        success: (data : DrugEvent[]) => {
          drugEvents = data;
        },
        error: (err) => {
          console.error("Failed to fetch drug history:", err);
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

      for (const entry of drugEvents) {
        const row = [
          animalIdentification!.flockPrefix,
          animalIdentification!.name,
          entry.drugLot,
          entry.tradeName,
          entry.genericDrugName,
          entry.dateOn,
          entry.timeOn,
          entry.dateOff ?? "",
          entry.timeOff ?? "",
          entry.dosage,
          entry.locationName
        ];
        csvRows.push(row.map(value => `"${(value ?? "").toString().trim()}"`).join(","));
      }
    } catch (error) {
      console.error(`Error fetching drug history for animalId ${animalId}:`, error);
    }
  }

  return csvRows.join("\n");
};