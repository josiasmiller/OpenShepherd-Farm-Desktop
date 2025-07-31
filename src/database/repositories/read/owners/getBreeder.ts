import { getDatabase } from "../../../dbConnections.js";
import { Result, Success, Failure, unwrapOrFailWithAnimal } from "../../../../shared/results/resultTypes.js";
import { OwnerType } from "../../../models/read/owners/ownerType.js";
import { Owner } from "../../../models/read/owners/owner.js";
import { Company } from "../../../models/read/owners/company.js";
import { Contact } from "../../../models/read/owners/contact.js";

import {
  REGISTRY_CHOCOLATE_WMSA,
  REGISTRY_COMPANY_ID,
  REGISTRY_WHITE_WMSA,
} from "../../../dbConstants.js";

import { getContactPremise } from "../premises/getContactPremise.js";
import { getCompanyPremise } from "../premises/getCompanyPremise.js";
import { getScrapieFlockInfo } from "../scrapie/getScrapieFlockInfo.js";

type BreederQueryRow = {
  contact_id: string | null;
  first_name: string | null;
  last_name: string | null;
  company_id: string | null;
  company_name: string | null;
  registry_id: string | null;
  membership_number: string | null;
  contact_phone: string | null;
  company_phone: string | null;
};

/**
 * gets the breeder of an animal from the animal's UUID
 * @param animalId UUID of the animal being sought
 * @returns A `Result` containing an `Owner` object on success, 
 *          or a string error message on failure.
 */
export const getBreeder = async (
  animalId: string
): Promise<Result<Owner, string>> => {
  const db = getDatabase();
  if (!db) {
    return new Failure("DB instance is null");
  }

  const breederQuery = `
    SELECT 
      r.id_breeder_id_contactid AS contact_id,
      r.id_breeder_id_companyid AS company_id,
      c.contact_first_name AS first_name,
      c.contact_last_name AS last_name,
      co.company AS company_name,
      r.id_registry_id_companyid AS registry_id,
      o.membership_number,

      (
        SELECT cp.contact_phone
        FROM contact_phone_table cp
        WHERE cp.id_contactid = r.id_breeder_id_contactid
        ORDER BY cp.created ASC
        LIMIT 1
      ) AS contact_phone,

      (
        SELECT cp.company_phone
        FROM company_phone_table cp
        WHERE cp.id_companyid = r.id_breeder_id_companyid
        ORDER BY cp.created ASC
        LIMIT 1
      ) AS company_phone

    FROM animal_registration_table r
    LEFT JOIN contact_table c ON c.id_contactid = r.id_breeder_id_contactid
    LEFT JOIN company_table co ON co.id_companyid = r.id_breeder_id_companyid
    LEFT JOIN owner_registration_table o
      ON (
        (o.id_contactid IS NOT NULL AND o.id_contactid = r.id_breeder_id_contactid)
        OR
        (o.id_companyid IS NOT NULL AND o.id_companyid = r.id_breeder_id_companyid)
      )
    WHERE r.id_animalid = ?
      AND r.id_registry_id_companyid IN (?, ?, ?)
    ORDER BY r.registration_date ASC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(
      breederQuery,
      [animalId, REGISTRY_COMPANY_ID, REGISTRY_CHOCOLATE_WMSA, REGISTRY_WHITE_WMSA],
      async (err, row: BreederQueryRow | undefined) => {
        if (err) {
          resolve(new Failure(`Database query failed: ${err.message}`));
          return;
        }

        if (!row) {
          resolve(new Failure("No breeder found for given animal ID"));
          return;
        }

        if (row.contact_id) {
          const contact: Contact = {
            id: row.contact_id,
            firstName: row.first_name ?? "",
            lastName: row.last_name ?? "",
          };

          const premiseResult = await getContactPremise(contact.id);
          const premise = await unwrapOrFailWithAnimal(premiseResult, "breeder premise", animalId);
          if (premise.tag === "error") return resolve(premise);

          const scrapieResult = await getScrapieFlockInfo(contact.id, false);
          const scrapieId = await unwrapOrFailWithAnimal(scrapieResult, "breeder scrapie flock number", animalId);
          if (scrapieId.tag === "error") return resolve(scrapieId);

          return resolve(
            new Success({
              type: OwnerType.CONTACT,
              contact,
              premise: premise.data,
              scrapieId: scrapieId.data,
              phoneNumber: row.contact_phone ?? "",
              flockId: row.membership_number ?? "",
            })
          );

        } else if (row.company_id) {
          const company: Company = {
            id: row.company_id,
            name: row.company_name ?? "",
            registry_id: row.registry_id ?? undefined,
          };

          const premiseResult = await getCompanyPremise(company.id);
          const premise = await unwrapOrFailWithAnimal(premiseResult, "company premise", animalId);
          if (premise.tag === "error") return resolve(premise);

          const scrapieResult = await getScrapieFlockInfo(company.id, true);
          const scrapieId = await unwrapOrFailWithAnimal(scrapieResult, "company scrapie flock number", animalId);
          if (scrapieId.tag === "error") return resolve(scrapieId);

          return resolve(
            new Success({
              type: OwnerType.COMPANY,
              company,
              premise: premise.data,
              scrapieId: scrapieId.data,
              phoneNumber: row.company_phone ?? "",
              flockId: row.membership_number ?? "",
            })
          );

        } else {
          resolve(new Failure("Breeder has neither contact nor company info"));
        }
      }
    );
  });
};
