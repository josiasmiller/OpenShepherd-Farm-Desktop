import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dialog } from "electron";
import { PDFDocument } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const writeTestPdf = async (animalIds: string[]): Promise<boolean> => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "Save Test PDF",
    defaultPath: "test.pdf",
    filters: [{ name: "PDF file", extensions: ["pdf"] }],
  });

  if (canceled || !filePath) {
    console.log("User cancelled the file selection.");
    return false;
  }

  console.log("Loading PDF template...");

  // Path to existing PDF template
  const templatePath = path.join(__dirname, "..", "..", "renderer", "assets", "ABWMSA_registration_template_V2.pdf");
  console.log("DEBUG PATH");
  console.log(templatePath);
  const existingPdfBytes = fs.readFileSync(templatePath);

  // Load the existing PDF and access the form
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();

  fields.forEach(field => {
    const name = field.getName();
    const type = field.constructor.name;
    console.log(`Found field: "${name}" (${type})`);
  });

  // Set dummy values in form fields (for now, will update with actual data)
  try {

    const fields: string[] = [
      "RegNo",
      "BirthYear",
      "UKRegNo",
      "FarmID",
      "Codon171",
      "WgtBirth",
      "DESC",
      "Name",
      "Sex",
      "BirthType",
      "OfficialEarTag",
      "FMICRON",
      "CODON136",
      "Wgt2nd",
      "Inbreeding",
      "ssssSpecial",
      "sssSpecial",
      "sssdSpecial",
      "ssdsSpecial",
      "ssdSpecial",
      "ssddSpecial",
      "SireSpecial",
      "sdssSpecial",
      "sdsSpecial",
      "sdSpecial",
      "sddsSpecial",
      "sddSpecial",
      "sdddSpecial",
      "dsssSpecial",
      "dssSpecial",
      "dssdSpecial",
      "dsSpecial",
      "dsdsSpecial",
      "dsdSpecial",
      "dsddSpecial",
      "DamSpecial",
      "ddssSpecial",
      "ddsSpecial",
      "ddsdSpecial",
      "ddSpecial",
      "dddsSpecial",
      "dddSpecial",
      "ddddSpecial",
      "BreederMailingAddress",
      "BTelNo",
      "BreederScrapieID",
      "OwnerMailingAddress",
      "OTelNo",
      "OwnerScrapieID",
      "PrintDate",
      "ssSpecial",
      "sdsdSpecial",
      "BreederFlockID",
      "OwnerFlockID",
      "BreederInfo",
      "OwnerInfo"
    ];

    fields.forEach(fieldName => {
      form.getTextField(fieldName).setText("Proof of concept PDF populating");
    });

  } catch (e) {
    console.error("Error setting form fields:", e);
    return false;
  }

  // Ensure fields are not editable (double check requirements before committing)
  // form.flatten();

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);

  console.log("PDF written to:", filePath);
  return true;
};
