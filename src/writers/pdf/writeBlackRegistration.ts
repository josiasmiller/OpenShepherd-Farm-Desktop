import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { PDFDocument } from "pdf-lib";
import { AnimalRegistrationResult, getAnimalRegistrationInfo } from "../../database/index.js";
import { Failure, handleResult, Result, Success } from "../../shared/results/resultTypes.js";
import { dialog } from "electron";
import { Owner } from "../../database/models/read/owners/owner.js";
// import { OwnerType } from "../../database/client-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "..", "..", "renderer", "assets", "ABWMSA_registration_template_V3_black.pdf");
const existingPdfBytes = fs.readFileSync(templatePath);

export const writeBlackRegistration = async (
  animalIds: string[]
): Promise<{ success: boolean; resultingDirectory: string }> => {

  // Show the folder selection dialog
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select Folder to Save PDF(s)",
    properties: ["openDirectory", "createDirectory"],
  });

  // Handle user cancellation
  if (canceled || filePaths.length === 0) {
    console.log("User cancelled folder selection.");
    return { success: false, resultingDirectory: "" };
  }

  const directoryPath = filePaths[0];

  try {
    const registrationResults = await getAnimalRegistrationInfo(animalIds);

    let success = false;

    await handleResult(registrationResults, {
      success: async (data) => {
        const result = await _handleRegistrationWrite(data, directoryPath);
        if (result instanceof Success) {
          success = true;
        } else if (result instanceof Failure) {
          console.error("PDF generation failed:", result.error);
          success = false;
        }
      },
      error: (err) => {
        console.error("Failed to fetch existing defaults:", err);
        success = false;
      },
    });

    
    return { success: true, resultingDirectory: directoryPath };

  } catch (e) {
    console.error("Error setting form fields:", e);
    return { success: false, resultingDirectory: directoryPath };
  }
};


const _handleRegistrationWrite = async (
  data: AnimalRegistrationResult[],
  directoryPath: string
): Promise<Result<void, string>> => {

  const now = new Date();
  const printDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;

  for (const regResult of data) {
    // Load the existing PDF and access the form
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // create fields that need to be created
    var fullAnimalName : string = `${regResult.animalIdentification.flockPrefix} ${regResult.animalIdentification.name}`;

    var breederMailingAddress: string = _getOwnerMailingAddress(regResult.breeder);
    var ownerMailingAddress: string = _getOwnerMailingAddress(regResult.owner);

    const form = pdfDoc.getForm();

    console.log("MITCH DEBUG!!!");
    for (const field of form.getFields()) {
      const name = field.getName();
      const type = field.constructor.name; // e.g., PDFTextField, PDFCheckBox, etc.
      console.log(`Field: ${name}, Type: ${type}`);
    }

    form.getTextField("RegNo").setText(regResult.animalIdentification.registrationNumber);
    form.getTextField("BirthYear").setText(regResult.animalIdentification.birthDate.getUTCFullYear().toString());
    form.getTextField("UKRegNo").setText(regResult.UKRegNo);
    form.getTextField("FarmID").setText(regResult.FarmID);
    form.getTextField("Codon171").setText(regResult.Codon171);
    form.getTextField("WgtBirth").setText(regResult.WgtBirth);
    form.getTextField("DESC").setText(regResult.DESC);
    form.getTextField("Name").setText(fullAnimalName);
    form.getTextField("Sex").setText(regResult.sex.name);
    form.getTextField("BirthType").setText(regResult.BirthType);
    form.getTextField("OfficialEarTag").setText(regResult.OfficialEarTag);
    form.getTextField("FMICRON").setText(regResult.FMICRON);
    form.getTextField("CODON136").setText(regResult.CODON136);
    form.getTextField("Wgt2nd").setText(regResult.Wgt2nd);
    form.getTextField("Inbreeding").setText(regResult.Inbreeding);

    // pedigree fields
    form.getTextField("SireSpecial").setText(regResult.pedigree.sirePedigree?.registryName);
    form.getTextField("DamSpecial").setText(regResult.pedigree.damPedigree?.registryName);

    // Generation 2
    form.getTextField("ssSpecial").setText(regResult.pedigree.sirePedigree?.sirePedigree?.registryName);
    form.getTextField("sdSpecial").setText(regResult.pedigree.sirePedigree?.damPedigree?.registryName);
    form.getTextField("dsSpecial").setText(regResult.pedigree.damPedigree?.sirePedigree?.registryName);
    form.getTextField("ddSpecial").setText(regResult.pedigree.damPedigree?.damPedigree?.registryName);

    // Generation 3
    form.getTextField("sssSpecial").setText(regResult.pedigree.sirePedigree?.sirePedigree?.sirePedigree?.registryName);
    form.getTextField("ssdSpecial").setText(regResult.pedigree.sirePedigree?.sirePedigree?.damPedigree?.registryName);
    form.getTextField("sdsSpecial").setText(regResult.pedigree.sirePedigree?.damPedigree?.sirePedigree?.registryName);
    form.getTextField("sddSpecial").setText(regResult.pedigree.sirePedigree?.damPedigree?.damPedigree?.registryName);

    form.getTextField("dssSpecial").setText(regResult.pedigree.damPedigree?.sirePedigree?.sirePedigree?.registryName);
    form.getTextField("dsdSpecial").setText(regResult.pedigree.damPedigree?.sirePedigree?.damPedigree?.registryName);
    form.getTextField("ddsSpecial").setText(regResult.pedigree.damPedigree?.damPedigree?.sirePedigree?.registryName);
    form.getTextField("dddSpecial").setText(regResult.pedigree.damPedigree?.damPedigree?.damPedigree?.registryName);

    // Generation 4
    form.getTextField("ssssSpecial").setText(regResult.pedigree.sirePedigree?.sirePedigree?.sirePedigree?.sirePedigree?.registryName);
    form.getTextField("sssdSpecial").setText(regResult.pedigree.sirePedigree?.sirePedigree?.sirePedigree?.damPedigree?.registryName);
    form.getTextField("ssdsSpecial").setText(regResult.pedigree.sirePedigree?.sirePedigree?.damPedigree?.sirePedigree?.registryName);
    form.getTextField("ssddSpecial").setText(regResult.pedigree.sirePedigree?.sirePedigree?.damPedigree?.damPedigree?.registryName);

    form.getTextField("sdssSpecial").setText(regResult.pedigree.sirePedigree?.damPedigree?.sirePedigree?.sirePedigree?.registryName);
    form.getTextField("sdsdSpecial").setText(regResult.pedigree.sirePedigree?.damPedigree?.sirePedigree?.damPedigree?.registryName);
    form.getTextField("sddsSpecial").setText(regResult.pedigree.sirePedigree?.damPedigree?.damPedigree?.sirePedigree?.registryName);
    form.getTextField("sdddSpecial").setText(regResult.pedigree.sirePedigree?.damPedigree?.damPedigree?.damPedigree?.registryName);

    form.getTextField("dsssSpecial").setText(regResult.pedigree.damPedigree?.sirePedigree?.sirePedigree?.sirePedigree?.registryName);
    form.getTextField("dssdSpecial").setText(regResult.pedigree.damPedigree?.sirePedigree?.sirePedigree?.damPedigree?.registryName);
    form.getTextField("dsdsSpecial").setText(regResult.pedigree.damPedigree?.sirePedigree?.damPedigree?.sirePedigree?.registryName);
    form.getTextField("dsddSpecial").setText(regResult.pedigree.damPedigree?.sirePedigree?.damPedigree?.damPedigree?.registryName);

    form.getTextField("ddssSpecial").setText(regResult.pedigree.damPedigree?.damPedigree?.sirePedigree?.sirePedigree?.registryName);
    form.getTextField("ddsdSpecial").setText(regResult.pedigree.damPedigree?.damPedigree?.sirePedigree?.damPedigree?.registryName);
    form.getTextField("dddsSpecial").setText(regResult.pedigree.damPedigree?.damPedigree?.damPedigree?.sirePedigree?.registryName);
    form.getTextField("ddddSpecial").setText(regResult.pedigree.damPedigree?.damPedigree?.damPedigree?.damPedigree?.registryName);

    form.getTextField("BreederMailingAddress").setText(breederMailingAddress);
    form.getTextField("BreederScrapieID").setText("WEWLAD_BreederScrapieID");
    form.getTextField("BreederInfo").setText("WEWLAD_BreederInfo");
    form.getTextField("BreederFlockID").setText(regResult.breeder.flockId);
    form.getTextField("BTelNo").setText(regResult.BTelNo);
    
    // form.getTextField("BreederScrapieID").setText(regResult.BreederScrapieID);
    form.getTextField("OwnerMailingAddress").setText(ownerMailingAddress);
    form.getTextField("OTelNo").setText(regResult.OTelNo);


    form.getTextField("OwnerFlockID").setText(regResult.owner.flockId);
    // form.getTextField("BreederInfo").setText(regResult.BreederInfo);
    // form.getTextField("OwnerInfo").setText(regResult.OwnerInfo);
    // form.getTextField("OwnerScrapieID").setText(regResult.OwnerScrapieID);


    form.getTextField("PrintDate").setText(printDate);


    const pdfBytes = await pdfDoc.save();

    const flockName = regResult.animalIdentification.flockPrefix.replace(/ /g, '_'); // replace spaces with underscores
    const animalName = regResult.animalIdentification.name.replace(/ /g, '_');       // replace spaces with underscores
    const registrationNum = regResult.animalIdentification.registrationNumber;

    const filename = `registration_${flockName}_${animalName}_${registrationNum}.pdf`;
    const filePath = path.join(directoryPath, filename); 
    // Write file, wrap in try/catch to catch fs errors
    try {
      fs.writeFileSync(filePath, pdfBytes);
    } catch (e: any){
      return new Failure(`Failed to write PDF file: ${e.message}`);
    }    
  }
  
  return new Success(undefined);
} 

const _getOwnerMailingAddress = (o : Owner): string => {
  const premAddress = o.premise.address;
  const premCity = o.premise.city;
  const premState = o.premise.state.name;
  const premPost = o.premise.postcode;

  var name : string;

  if (o.type == "contact") {
    name = `${o.contact.firstName} ${o.contact.lastName}`;
  } else if (o.type == "company") {
    name = o.company.name;
  } else {
    throw new Error("Invalid Owner Type");
  }

  return `${name}, ${premAddress}, ${premCity}, ${premState}, ${premPost}`;
}