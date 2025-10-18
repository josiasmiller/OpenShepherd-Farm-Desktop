import fs from 'fs';
import { dialog } from 'electron';
import {Database} from "sqlite3";
import { handleResult, Result } from 'packages/core';
import { AnimalIdentification, AnimalNote } from 'packages/api'
import { getAnimalIdentification, getAnimalNotes } from '../../database';

export const writeAnimalNotesCsv = async (db: Database, animalIds: string[]): Promise<boolean> => {

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
    const csvData = await generateNotesCsvFromAnimalIds(db, animalIds);
    fs.writeFileSync(filePath, csvData, { encoding: "utf8" });
    console.log(`CSV successfully written to ${filePath}`);
    return true;
  } catch (error) {
    console.error("Failed to write CSV file:", error);
    return false;
  }
};
  

export const generateNotesCsvFromAnimalIds = async (db: Database, animalIds: string[]): Promise<string> => {
  let csvRows: string[] = [];

  // Headers
  const header = [
    "Flock Prefix",
    "Animal Name",
    "Note",
    "Predefined Note",
    "Note Date",
    "Note Time"
  ];
  csvRows.push(header.join(","));

  for (const animalId of animalIds) {
    try {
      // get the naimal Notes
      const animalNoteResult: Result<AnimalNote[], string> = await getAnimalNotes(db, animalId);

      var animalNotes: AnimalNote[] = [];
      var animalNoteSuccessed: boolean = false;

      handleResult(animalNoteResult, {
        success: (data : AnimalNote[]) => {
          animalNotes = data;
          animalNoteSuccessed = true;
        },
        error: (err) => {
          console.error("Failed to fetch Animal Notes:", err);
        },
      });

      if (!animalNoteSuccessed) {
        continue;
      }

      // get all pertinent animal Identifications
      const animalIdentificationResult: Result<AnimalIdentification, string> = await getAnimalIdentification(db, animalId);
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

      for (const entry of animalNotes) {
        const row = [
          animalIdentification!.flockPrefix,
          animalIdentification!.name,
          entry.noteText,
          entry.predefinedNote,
          entry.noteDate,
          entry.noteTime
        ];
        csvRows.push(row.map(value => `"${(value ?? "").toString().trim()}"`).join(","));
      }
    } catch (error) {
      console.error(`Error fetching Animal Notes for animalId ${animalId}:`, error);
    }
  }

  return csvRows.join("\n");
};