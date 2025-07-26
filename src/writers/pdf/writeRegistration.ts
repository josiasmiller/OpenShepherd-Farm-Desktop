import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { PDFDocument } from "pdf-lib";
import { AnimalRegistrationResult, getAnimalRegistrationInfo, PedigreeNode } from "../../database/index.js";
import { Failure, handleResult, Result, Success } from "../../shared/results/resultTypes.js";
import { dialog } from "electron";
import { Owner } from "../../database/models/read/owners/owner.js";
import { idTag } from "../../database/models/read/animal/tags/idTag.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePathBlack = path.join(__dirname, "..", "..", "renderer", "assets", "ABWMSA_registration_template_V3_black.pdf");
const pdfBytesBlack = fs.readFileSync(templatePathBlack);

const templatePathWhite = path.join(__dirname, "..", "..", "renderer", "assets", "AWWMSA_registration_template_V3_white.pdf");
const pdfBytesWhite = fs.readFileSync(templatePathWhite);

export type RegistrationWriteResponse = {
  success: boolean;
  resultingDirectory: string;
  errors: string[];
  warnings: string[];
}

export const writeRegistration = async (
  animalIds: string[],
  registrationType: "black" | "white" | "chocolate",
): Promise<RegistrationWriteResponse> => {

  var errors : string[] = [];
  var warnings : string[] = [];

  // Show the folder selection dialog
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: "Select Folder to Save PDF(s)",
    properties: ["openDirectory", "createDirectory"],
  });

  // Handle user cancellation
  if (canceled || filePaths.length === 0) {
    console.log("User cancelled folder selection.");
    return { 
      success: false, 
      resultingDirectory: "", 
      errors : errors, 
      warnings: warnings,
    };
  }

  const directoryPath = filePaths[0];

  try {
    const registrationResults = await getAnimalRegistrationInfo(animalIds);

    let success = false;

    await handleResult(registrationResults, {
      success: async (data : AnimalRegistrationResult[]) => {
        const result = await _handleRegistrationWrite(data, directoryPath, registrationType);
        if (result instanceof Success) {
          // extract warnings if there are any
          var newWarnings : string[] = result.data;
          warnings.push(...newWarnings);
          success = true;
        } else if (result instanceof Failure) {
          console.error("PDF generation failed:", result.error);
          success = false;
          errors.push(result.error);
        }
      },
      error: (err : string) => {
        console.error("Failed to fetch animal registration data:", err);
        success = false;
        errors.push(err);
      },
    });
    
    return { 
      success: success, 
      resultingDirectory: directoryPath, 
      errors : errors, 
      warnings: warnings,
    };

  } catch (e) {
    console.error("Error setting form fields:", e);
    return { 
      success: false,
      resultingDirectory: directoryPath, 
      errors : errors, 
      warnings: warnings,
    };
  }
};


const _handleRegistrationWrite = async (
  data: AnimalRegistrationResult[],
  directoryPath: string,
  registrationType: "black" | "white" | "chocolate",
): Promise<Result<string[], string>> => {

  var allWarnings : string[] = [];

  const now = new Date();
  const printDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;

  var animalIdx : number = 1;

  for (const regResult of data) {
    // Load the existing PDF and access the form
    let pdfDoc: PDFDocument | undefined;

    if (registrationType === "black") {
      pdfDoc = await PDFDocument.load(pdfBytesBlack);
    } else if (registrationType === "white") {
      pdfDoc = await PDFDocument.load(pdfBytesWhite);
    } else if (registrationType === "chocolate") {
      return new Failure("chocolate registry not yet implemented");
    }

    if (!pdfDoc) {
      return new Failure("Invalid PDF Document in _handleRegistrationWrite");
    }

    // create fields that need to be created
    var fullAnimalName : string = "";
    var bday : string = "";
    if (regResult.animalIdentification != null) {
      fullAnimalName = `${regResult.animalIdentification.flockPrefix} ${regResult.animalIdentification.name}`;

      var bday : string = regResult.animalIdentification.birthDate?.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) ?? ""; // format the string to match "12 Mar 1997" format
    }

    var breederMailingAddress: string = "";
    if (regResult.breeder != null) {
      breederMailingAddress = _getOwnerMailingAddress(regResult.breeder); 
    }
    
    var ownerMailingAddress: string = "";
    if (regResult.owner != null) {
      ownerMailingAddress = _getOwnerMailingAddress(regResult.owner);
    }

    var birthType : string = "";
    var birthWeight : string = "";
    if (regResult.birthInfo != null) {
      var birthType = regResult.birthInfo.birthType.name ?? ""; // first node of the pedigree is the actual animal being searched
      var birthWeight  = regResult.birthInfo.birthWeight.toString() ?? "";
    }

    const form = pdfDoc.getForm();

    if (regResult.animalIdentification != null) {
        form.getTextField("RegNo").setText(regResult.animalIdentification.registrationNumber);
    }

    if (bday != "") {
      form.getTextField("BirthYear").setText(bday);
    }
    if (birthWeight != "") {
      form.getTextField("WgtBirth").setText(birthWeight);
    }
   

    if (regResult.secondWeight != null && regResult.secondWeight != 0) {
      form.getTextField("Wgt2nd").setText(regResult.secondWeight.toString());
    }

    if (fullAnimalName != "") {
      form.getTextField("Name").setText(fullAnimalName);
    }
    
    if (regResult.sex != null) {
      form.getTextField("Sex").setText(regResult.sex.name);
    }
    
    form.getTextField("BirthType").setText(birthType);
    
    if (regResult.officialTag){
      var offical_text: string = _getTagText(regResult.officialTag);
      form.getTextField("OfficialEarTag").setText(offical_text);
    }

    if (regResult.unofficialTag){
      var farm_text: string = _getTagText(regResult.unofficialTag);
      form.getTextField("FarmID").setText(farm_text);
    }

    if (regResult.Codon171) {
      form.getTextField("Codon171").setText(regResult.Codon171.alleles);
    }

    if (regResult.Codon136) {
      form.getTextField("CODON136").setText(regResult.Codon136.alleles);
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // pedigree fields

    // Generation 1
    const sire = regResult.pedigree?.sirePedigree ?? null;
    const dam = regResult.pedigree?.damPedigree ?? null;

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


    // paradoxically, the `BreederInfo` field is actually the field where the mailing address should be ...
    form.getTextField("BreederInfo").setText(breederMailingAddress);

    if (regResult.breeder != null) {

      if (regResult.breeder.scrapieId) {
        form.getTextField("BreederScrapieID").setText(regResult.breeder.scrapieId.scrapieName);
      }

      form.getTextField("BreederFlockID").setText(regResult.breeder.flockId);
      form.getTextField("BTelNo").setText(regResult.breeder.phoneNumber);
    }


    // paradoxically, the `OwnerInfo` field is actually the field where the mailing address should be ...
    form.getTextField("OwnerInfo").setText(ownerMailingAddress);

    if (regResult.owner != null) {
      if (regResult.owner.scrapieId) {
        form.getTextField("OwnerScrapieID").setText(regResult.owner.scrapieId.scrapieName);
      }

      form.getTextField("OwnerFlockID").setText(regResult.owner.flockId);
      form.getTextField("OTelNo").setText(regResult.owner.phoneNumber);
    }

    form.getTextField("PrintDate").setText(printDate);

    const pdfBytes = await pdfDoc.save();

    var filePath : string;

    if (regResult.animalIdentification) {
      const flockName = regResult.animalIdentification.flockPrefix.replace(/ /g, '_'); // replace spaces with underscores
      const animalName = regResult.animalIdentification.name.replace(/ /g, '_');       // replace spaces with underscores
      const registrationNum = regResult.animalIdentification.registrationNumber;

      const filename = `registration_${flockName}_${animalName}_${registrationNum}.pdf`;
      filePath = path.join(directoryPath, filename); 
    } else {
      filePath = path.join(directoryPath, `registration_unknown_${animalIdx}.pdf`);
    }

    // Attempt to write file
    try {
      fs.writeFileSync(filePath, pdfBytes);
    } catch (e: any){
      return new Failure(`Failed to write PDF file: ${e.message}`);
    }

    var specificWarnings : string[] = _generateWarnings(regResult, animalIdx);
    allWarnings.push(...specificWarnings);

    animalIdx++;
  }
  
  return new Success(allWarnings);
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

const _getTagText = (tag: idTag): string => {
  var abbrev_color : string = "";
  if (tag.maleColor.abbrev) {
    abbrev_color = tag.maleColor.abbrev;
  }

  var abbrev_loc : string = "";
  if (tag.location.abbrev) {
    abbrev_loc = tag.location.abbrev;
  }

  var text: string = "";
  if (abbrev_color && abbrev_loc) {
    text = `${abbrev_loc}/${abbrev_color}/${tag.idNumber}`;
  } else {
    text = tag.idNumber;
  }

  return text;
} 

const _generateWarnings = (
  regResult: AnimalRegistrationResult,
  backupAnimalIdx: number
): string[] => {
  const warnings: string[] = [];

  // Determine animal name for context
  const animalName = regResult.animalIdentification?.name ?? `animal_${backupAnimalIdx}`;

  // Utility function to add a warning with consistent phrasing
  const addWarning = (field: string) => warnings.push(`Missing ${field} for ${animalName}.`);

  if (regResult.Codon171 == null) addWarning("Codon171");
  if (regResult.Codon136 == null) addWarning("Codon136");
  if (regResult.animalIdentification == null) addWarning("animal identification");
  if (regResult.officialTag == null) addWarning("official tag");
  if (regResult.unofficialTag == null) addWarning("unofficial tag");
  if (regResult.sex == null) addWarning("sex");
  if (regResult.FMICRON == null) addWarning("FMICRON");
  if (regResult.secondWeight == null) addWarning("second weight");
  if (regResult.Inbreeding == null) addWarning("inbreeding value");
  if (regResult.pedigree == null) addWarning("pedigree");
  if (regResult.breeder == null) addWarning("breeder");
  if (regResult.owner == null) addWarning("owner");
  if (regResult.birthInfo == null) addWarning("birth information");

  return warnings;
};
