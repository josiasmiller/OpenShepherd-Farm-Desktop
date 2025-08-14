import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure, handleResult } from "../../../../../shared/results/resultTypes";
import { 
  REGISTRATION_CHOCOLATE_WELSH,
  REGISTRATION_REGISTERED,
  REGISTRATION_WHITE_WELSH,
  REGISTRY_CHOCOLATE_WMSA, 
  REGISTRY_COMPANY_ID, 
  REGISTRY_WHITE_WMSA,
} from "../../../../dbConstants";
import { getCoatColorForAnimal } from "../../../read/animal/coatColor/getCoatColor";
import { CoatColor } from "../../../../models/read/animal/coatColor/coatColor";

/**
 * Inserts a row into the registry_certificate_print_table for an animal
 * based on its coat color (which determines registry and registration type).
 * @param animalId UUID of the animal
 */
export async function markRegistryCertificateNotPrinted(
  animalId : string,
): Promise<Result<null, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  var ccResult = await getCoatColorForAnimal(animalId);

  var success : boolean = false;
  var coatColor : CoatColor; 
  var coatColorErrMsg : string;

  await handleResult(ccResult, {
    success: async (data : CoatColor) => {
      coatColor = data;
      success = true;
    },
    error: (err : string) => {
      console.error("Failed to fetch animal coat color:", err);
      coatColorErrMsg = err;
    },
  });

  if (!success) {
    return new Failure(coatColorErrMsg!);
  }

  coatColor = coatColor!;

  const id = uuidv4();

  let companyId: string | undefined;
  let registrationTypeId: string | undefined;

  // Determine company and registration type based on coat color
  switch (coatColor.name.toLowerCase()) {
    case "white":
      companyId = REGISTRY_WHITE_WMSA;
      registrationTypeId = REGISTRATION_WHITE_WELSH;
      break;
    case "black":
    case "badger face":
      companyId = REGISTRY_COMPANY_ID;
      registrationTypeId = REGISTRATION_REGISTERED;
      break;
    case "chocolate":
      companyId = REGISTRY_CHOCOLATE_WMSA;
      registrationTypeId = REGISTRATION_CHOCOLATE_WELSH;
      break;
    default:
      return new Failure(`Unhandled coat color: '${coatColor.name}'`);
  }

  const query = `
    INSERT INTO registry_certificate_print_table (
      id_registrycertificateprintid,
      id_companyid,
      id_animalid,
      id_registrationtypeid,
      printed,
      created,
      modified
    )
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  const values = [
    id,
    companyId,
    animalId,
    registrationTypeId,
    0, // when initially inserting, the papers are NOT printed.
  ];

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(query, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return new Success(null);
  } catch (err: any) {
    return new Failure(`Failed to insert registry certificate print row: ${err.message}`);
  }
}
