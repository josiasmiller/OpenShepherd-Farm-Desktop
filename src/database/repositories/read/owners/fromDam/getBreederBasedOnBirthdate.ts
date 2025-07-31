import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure, unwrapOrFailWithAnimal } from "../../../../../shared/results/resultTypes.js";
import { Owner } from "../../../../models/read/owners/owner.js";
import { Contact } from "../../../../models/read/owners/contact.js";
import { Company } from "../../../../models/read/owners/company.js";
import { getContactPremise } from "../../premises/getContactPremise.js";
import { getCompanyPremise } from "../../premises/getCompanyPremise.js";
import { getScrapieFlockInfo } from "../../scrapie/getScrapieFlockInfo.js";
import { getGestationPeriod } from "../../../../registry/getGestationPeriod.js";
import { OwnerType } from "../../../../client-types.js";

type BreederQueryRow = {
  contact_id: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_phone: string | null;
  company_id: string | null;
  company_name: string | null;
  company_phone: string | null;
  membership_number: string | null;
};

/**
 * gets the breeder of a given animal based on the animal_ownership_history_table
 * 
 * @param damId UUID of the animal's dam (mother)
 * @param speciesId UUID of the species being sought
 * @param childBirthDate the birthdate of the animal as a `Date` object
 * @returns A `Result` containing an `Owner` object on success, 
 *          or a string error message on failure.
 */
export async function getBreederFromOwnershipHistory(
  damId: string,
  speciesId: string,
  childBirthDate: Date
): Promise<Result<Owner, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  // Step 1: Gestation period
  const gestationResult = await getGestationPeriod(speciesId);
  if (gestationResult.tag === "error") return gestationResult;

  const { earlyDays, lateDays } = gestationResult.data;

  const matingStart = new Date(childBirthDate);
  matingStart.setDate(childBirthDate.getDate() - lateDays);

  const matingEnd = new Date(childBirthDate);
  matingEnd.setDate(childBirthDate.getDate() - earlyDays);

  // Step 2: Query dam's owner at time of mating
  const breederQuery = `
    SELECT
      a.to_id_contactid AS contact_id,
      c.contact_first_name,
      c.contact_last_name,
      (
        SELECT cp.contact_phone
        FROM contact_phone_table cp
        WHERE cp.id_contactid = a.to_id_contactid
        ORDER BY cp.created ASC
        LIMIT 1
      ) AS contact_phone,

      a.to_id_companyid AS company_id,
      co.company AS company_name,
      (
        SELECT cp.company_phone
        FROM company_phone_table cp
        WHERE cp.id_companyid = a.to_id_companyid
        ORDER BY cp.created ASC
        LIMIT 1
      ) AS company_phone,

      o.membership_number

    FROM animal_ownership_history_table a
    LEFT JOIN contact_table c ON c.id_contactid = a.to_id_contactid
    LEFT JOIN company_table co ON co.id_companyid = a.to_id_companyid
    LEFT JOIN owner_registration_table o
      ON (
        (o.id_contactid IS NOT NULL AND o.id_contactid = a.to_id_contactid)
        OR
        (o.id_companyid IS NOT NULL AND o.id_companyid = a.to_id_companyid)
      )
    WHERE a.id_animalid = ?
      AND a.transfer_date <= ?
    ORDER BY a.transfer_date DESC
    LIMIT 1
  `;


  let row: BreederQueryRow | undefined;

  try {
    row = await new Promise<BreederQueryRow | undefined>((resolve, reject) => {
      db.get(
        breederQuery,
        [damId, matingEnd.toISOString()],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as BreederQueryRow);
          }
        }
      );
    });
  } catch (err: any) {
    return new Failure(`Database query failed: ${err.message}`);
  }

  if (!row || row instanceof Failure) {
    return row instanceof Failure
      ? row
      : new Failure("No breeder record found for dam in mating window");
  }

  // Step 3: Format result as Owner
  if (row.contact_id) {
    const contact: Contact = {
      id: row.contact_id,
      firstName: row.contact_first_name ?? "",
      lastName: row.contact_last_name ?? "",
    };

    const premiseResult = await getContactPremise(contact.id);
    const premise = await unwrapOrFailWithAnimal(premiseResult, "breeder premise", damId);
    if (premise.tag === "error") return premise;

    const scrapieResult = await getScrapieFlockInfo(contact.id, false);
    const scrapieId = await unwrapOrFailWithAnimal(scrapieResult, "scrapie ID", damId);
    if (scrapieId.tag === "error") return scrapieId;

    return new Success({
      type: OwnerType.CONTACT,
      contact,
      premise: premise.data,
      scrapieId: scrapieId.data,
      phoneNumber: row.contact_phone ?? "",
      flockId: row.membership_number ?? "",
    });
  }

  if (row.company_id) {
    const company: Company = {
      id: row.company_id,
      name: row.company_name ?? "",
    };

    const premiseResult = await getCompanyPremise(company.id);
    const premise = await unwrapOrFailWithAnimal(premiseResult, "breeder premise", damId);
    if (premise.tag === "error") return premise;

    const scrapieResult = await getScrapieFlockInfo(company.id, true);
    const scrapieId = await unwrapOrFailWithAnimal(scrapieResult, "scrapie ID", damId);
    if (scrapieId.tag === "error") return scrapieId;

    return new Success({
      type: OwnerType.COMPANY,
      company,
      premise: premise.data,
      scrapieId: scrapieId.data,
      phoneNumber: row.company_phone ?? "",
      flockId: row.membership_number ?? "",
    });
  }

  return new Failure("No valid breeder found (no contact or company)");
}
