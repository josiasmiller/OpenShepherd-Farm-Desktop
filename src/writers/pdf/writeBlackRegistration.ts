import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { PDFDocument } from "pdf-lib";
import { AnimalRegistrationResult, getAnimalRegistrationInfo, PedigreeNode } from "../../database/index.js";
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

    var bday : string = regResult.animalIdentification.birthDate?.getUTCFullYear().toString() ?? "";

    var bday : string = regResult.animalIdentification.birthDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) ?? ""; // format the string to match "12 Mar 1997" format

    var birthType : string = regResult.birthInfo.birthType.name ?? ""; // first node of the pedigree is the actual animal being searched
    var birthWeight : string = regResult.birthInfo.birthWeight.toString() ?? "";

    const form = pdfDoc.getForm();

    form.getTextField("RegNo").setText(regResult.animalIdentification.registrationNumber);
    form.getTextField("BirthYear").setText(bday);
    form.getTextField("UKRegNo").setText(regResult.UKRegNo);
    form.getTextField("FarmID").setText(regResult.FarmID);
    form.getTextField("Codon171").setText(regResult.Codon171);
    form.getTextField("WgtBirth").setText(birthWeight);
    form.getTextField("DESC").setText(regResult.DESC);
    form.getTextField("Name").setText(fullAnimalName);
    form.getTextField("Sex").setText(regResult.sex.name);
    form.getTextField("BirthType").setText(birthType);
    form.getTextField("OfficialEarTag").setText(regResult.OfficialEarTag);
    form.getTextField("FMICRON").setText(regResult.FMICRON);
    form.getTextField("CODON136").setText(regResult.CODON136);
    form.getTextField("Wgt2nd").setText(regResult.Wgt2nd);
    form.getTextField("Inbreeding").setText(regResult.Inbreeding);

    /////////////////////////////////////////////////////////////////////////////////////////
    // pedigree fields

    // Generation 1
    const sire = regResult.pedigree.sirePedigree ?? null;
    const dam = regResult.pedigree.damPedigree ?? null;

    // Generation 2
    const ss = sire?.sirePedigree ?? null;
    const sd = sire?.damPedigree ?? null;
    const ds = dam?.sirePedigree ?? null;
    const dd = dam?.damPedigree ?? null;

    // Generation 3
    const sss = ss?.sirePedigree ?? null;
    const ssd = ss?.damPedigree ?? null;
    const sds = sd?.sirePedigree ?? null;
    const sdd = sd?.damPedigree ?? null;

    const dss = ds?.sirePedigree ?? null;
    const dsd = ds?.damPedigree ?? null;
    const dds = dd?.sirePedigree ?? null;
    const ddd = dd?.damPedigree ?? null;

    // Generation 4
    const ssss = sss?.sirePedigree ?? null;
    const sssd = sss?.damPedigree ?? null;
    const ssds = ssd?.sirePedigree ?? null;
    const ssdd = ssd?.damPedigree ?? null;

    const sdss = sds?.sirePedigree ?? null;
    const sdsd = sds?.damPedigree ?? null;
    const sdds = sdd?.sirePedigree ?? null;
    const sddd = sdd?.damPedigree ?? null;

    const dsss = dss?.sirePedigree ?? null;
    const dssd = dss?.damPedigree ?? null;
    const dsds = dsd?.sirePedigree ?? null;
    const dsdd = dsd?.damPedigree ?? null;

    const ddss = dds?.sirePedigree ?? null;
    const ddsd = dds?.damPedigree ?? null;
    const ddds = ddd?.sirePedigree ?? null;
    const dddd = ddd?.damPedigree ?? null;

    // Generation 1
    form.getTextField("SireSpecial").setText(_buildRegistryName(sire));
    form.getTextField("DamSpecial").setText(_buildRegistryName(dam));

    // Generation 2
    form.getTextField("ssSpecial").setText(_buildRegistryName(ss));
    form.getTextField("sdSpecial").setText(_buildRegistryName(sd));
    form.getTextField("dsSpecial").setText(_buildRegistryName(ds));
    form.getTextField("ddSpecial").setText(_buildRegistryName(dd));

    // Generation 3
    form.getTextField("sssSpecial").setText(_buildRegistryName(sss));
    form.getTextField("ssdSpecial").setText(_buildRegistryName(ssd));
    form.getTextField("sdsSpecial").setText(_buildRegistryName(sds));
    form.getTextField("sddSpecial").setText(_buildRegistryName(sdd));

    form.getTextField("dssSpecial").setText(_buildRegistryName(dss));
    form.getTextField("dsdSpecial").setText(_buildRegistryName(dsd));
    form.getTextField("ddsSpecial").setText(_buildRegistryName(dds));
    form.getTextField("dddSpecial").setText(_buildRegistryName(ddd));

    // Generation 4
    form.getTextField("ssssSpecial").setText(_buildRegistryName(ssss));
    form.getTextField("sssdSpecial").setText(_buildRegistryName(sssd));
    form.getTextField("ssdsSpecial").setText(_buildRegistryName(ssds));
    form.getTextField("ssddSpecial").setText(_buildRegistryName(ssdd));

    form.getTextField("sdssSpecial").setText(_buildRegistryName(sdss));
    form.getTextField("sdsdSpecial").setText(_buildRegistryName(sdsd));
    form.getTextField("sddsSpecial").setText(_buildRegistryName(sdds));
    form.getTextField("sdddSpecial").setText(_buildRegistryName(sddd));

    form.getTextField("dsssSpecial").setText(_buildRegistryName(dsss));
    form.getTextField("dssdSpecial").setText(_buildRegistryName(dssd));
    form.getTextField("dsdsSpecial").setText(_buildRegistryName(dsds));
    form.getTextField("dsddSpecial").setText(_buildRegistryName(dsdd));

    form.getTextField("ddssSpecial").setText(_buildRegistryName(ddss));
    form.getTextField("ddsdSpecial").setText(_buildRegistryName(ddsd));
    form.getTextField("dddsSpecial").setText(_buildRegistryName(ddds));
    form.getTextField("ddddSpecial").setText(_buildRegistryName(dddd));


    // paradoxically, the `BreederInfo` field is actual the field where the mailing address should be ...
    form.getTextField("BreederInfo").setText(breederMailingAddress);
    // form.getTextField("BreederMailingAddress").setText(breederMailingAddress);
    form.getTextField("BreederScrapieID").setText(regResult.breeder.scrapieId);
    form.getTextField("BreederFlockID").setText(regResult.breeder.flockId);
    form.getTextField("BTelNo").setText(regResult.breeder.phoneNumber);


    // paradoxically, the `OwnerInfo` field is actual the field where the mailing address should be ...
    form.getTextField("OwnerInfo").setText(ownerMailingAddress);
    // form.getTextField("OwnerMailingAddress").setText(ownerMailingAddress)
    form.getTextField("OwnerScrapieID").setText(regResult.owner.scrapieId);
    form.getTextField("OwnerFlockID").setText(regResult.owner.flockId);
    form.getTextField("OTelNo").setText(regResult.owner.phoneNumber);

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

const _buildRegistryName = (pn : PedigreeNode | null): string => {

  if (!pn) {
    return "---INVALID DATA---";
  }

  let birthDateFormatted: string | null = null;

  if (pn.birthDate) {
    try {
      if (!isNaN(pn.birthDate.getTime())) {
        birthDateFormatted = pn.birthDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }); // e.g., "19 Apr 2007"
      } else {
        birthDateFormatted = "---BDAY ISNAN---";
      }

    } catch (e) {
      birthDateFormatted = "---ERROR---";
      console.error("Failed to parse birth date:", e);
    }
  }

  // Join flockPrefix and animalName with a space instead of comma
  const namePart = [pn.flockPrefix, pn.animalName]
    .filter((part) => part && part.trim() !== "")
    .join(" "); // space instead of comma

  // Other fields joined with commas
  const otherParts = [
    pn.registrationNumber,
    pn.sexName,
    birthDateFormatted,
    pn.birthType,
  ].filter((part) => part && part.trim() !== "")
    .join(", ");

  // Final registryName
  const registryName = [namePart, otherParts]
    .filter((part) => part && part.trim() !== "")
    .join(", ");

  return registryName;
}