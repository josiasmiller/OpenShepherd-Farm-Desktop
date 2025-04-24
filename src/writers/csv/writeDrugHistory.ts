import fs from "fs";
import { DrugHistory, getDrugHistory } from "../../database/index.js";
import { handleResult, Result } from "../../shared/results/resultTypes.js";
import { AnimalInfo } from "../helpers/animalInfo";
import { dialog } from "electron";


export const writeDrugHistoryCsv = async (animals: AnimalInfo[]): Promise<boolean> => {

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
    const csvData = await generateCsvFromAnimalIds(animals);
    fs.writeFileSync(filePath, csvData, { encoding: "utf8" });
    console.log(`CSV successfully written to ${filePath}`);
    return true;
  } catch (error) {
    console.error("Failed to write CSV file:", error);
    return false;
  }
};
  

export const generateCsvFromAnimalIds = async (animals: AnimalInfo[]): Promise<string> => {
  let csvRows: string[] = [];

  // Header
  const header = [
    "Animal ID",
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

  for (const animal of animals) {
    try {
      const drugHistoryResult: Result<DrugHistory[], string> = await getDrugHistory(animal.id);

      var drugHistory: DrugHistory[] = [];

      handleResult(drugHistoryResult, {
        success: (data : DrugHistory[]) => {
          drugHistory = data;
        },
        error: (err) => {
          console.error("Failed to fetch drug history:", err);
        },
      });

      for (const entry of drugHistory) {
        const row = [
          animal.name,
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
        csvRows.push(row.map(value => `"${value}"`).join(","));
      }
    } catch (error) {
      console.error(`Error fetching drug history for animalId ${animal.id}, Name ${animal.name}:`, error);
    }
  }

  return csvRows.join("\n");
};