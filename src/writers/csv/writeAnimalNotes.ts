import fs from "fs";
import { AnimalNote, getAnimalNotes } from "../../database/index.js";
import { handleResult, Result } from "../../shared/results/resultTypes.js";
import { AnimalInfo } from "../helpers/animalInfo";
import { dialog } from "electron";


export const writeAnimalNotesCsv = async (animals: AnimalInfo[]): Promise<boolean> => {

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "Save Animal Note CSV",
    defaultPath: "animal-notes.csv",
    filters: [{ name: "CSV file", extensions: ["csv"] }],
  });
  
  if (canceled || !filePath) {
    console.log("User cancelled the file selection.");
    return false;
  }  

  try {
    const csvData = await generateNotesCsvFromAnimalIds(animals);
    fs.writeFileSync(filePath, csvData, { encoding: "utf8" });
    console.log(`CSV successfully written to ${filePath}`);
    return true;
  } catch (error) {
    console.error("Failed to write CSV file:", error);
    return false;
  }
};
  

export const generateNotesCsvFromAnimalIds = async (animals: AnimalInfo[]): Promise<string> => {
  let csvRows: string[] = [];

  // Header
  const header = [
    "Animal Name",
    "Note",
    "Predefined Note",
    "Note Date",
    "Note Time"
  ];
  csvRows.push(header.join(","));

  for (const animal of animals) {
    try {
      const animalNoteResult: Result<AnimalNote[], string> = await getAnimalNotes(animal.id);

      var animalNotes: AnimalNote[] = [];

      handleResult(animalNoteResult, {
        success: (data : AnimalNote[]) => {
          animalNotes = data;
        },
        error: (err) => {
          console.error("Failed to fetch Animal Notes:", err);
        },
      });

      for (const entry of animalNotes) {
        const row = [
          animal.name,
          entry.noteText,
          entry.predefinedNote,
          entry.noteDate,
          entry.noteTime
        ];
        csvRows.push(row.map(value => `"${value}"`).join(","));
      }
    } catch (error) {
      console.error(`Error fetching Animal Notes for animalId ${animal.id}, Name ${animal.name}:`, error);
    }
  }

  return csvRows.join("\n");
};