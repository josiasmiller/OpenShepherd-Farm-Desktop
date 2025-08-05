import { getDatabase } from "../../../dbConnections";
import { Result, Success, Failure, unwrapOrFailWithAnimal } from "../../../../shared/results/resultTypes";
import { Owner } from "../../../models/read/owners/owner";
import { OwnerType } from "../../../models/read/owners/ownerType";
import { getContactPremise } from "../premises/getContactPremise";
import { getCompanyPremise } from "../premises/getCompanyPremise";
import { Contact } from "../../../models/read/owners/contact";
import { Company } from "../../../models/read/owners/company";
import { getScrapieFlockInfo } from "../scrapie/getScrapieFlockInfo";

import {
  REGISTRY_CHOCOLATE_WMSA,
  REGISTRY_COMPANY_ID,
  REGISTRY_WHITE_WMSA,
} from "../../../dbConstants";

type OwnerQueryRow = {
  to_id_contactid: string | null;
  to_id_companyid: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  company_name: string | null;
  registry_id: string | null;
  membership_number: string | null;
  contact_phone: string | null;
  company_phone: string | null;
};

/**
 * gets the owner of an animal
 * @param animalId UUID of the animal whose owner you are searching for
 * @returns A `Result` containing an `Owner` object on success, 
 *          or a string error message on failure.
 */
export const getOwner = async (
  animalId: string
): Promise<Result<Owner, string>> => {
  const db = getDatabase();
  if (!db) {
    return new Failure("DB instance is null");
  }

  const ownerQuery = `
    SELECT
      a.to_id_contactid,
      a.to_id_companyid,
      c.contact_first_name,
      c.contact_last_name,
      co.company AS company_name,
      r.id_registry_id_companyid AS registry_id,
      o.membership_number,

      (
        SELECT cp.contact_phone
        FROM contact_phone_table cp
        WHERE cp.id_contactid = a.to_id_contactid
        ORDER BY cp.created ASC
        LIMIT 1
      ) AS contact_phone,

      (
        SELECT cp.company_phone
        FROM company_phone_table cp
        WHERE cp.id_companyid = a.to_id_companyid
        ORDER BY cp.created ASC
        LIMIT 1
      ) AS company_phone

    FROM animal_ownership_history_table a
    LEFT JOIN contact_table c ON c.id_contactid = a.to_id_contactid
    LEFT JOIN company_table co ON co.id_companyid = a.to_id_companyid
    LEFT JOIN animal_registration_table r ON r.id_animalid = a.id_animalid
    LEFT JOIN owner_registration_table o
      ON (
        (o.id_contactid IS NOT NULL AND o.id_contactid = a.to_id_contactid)
        OR
        (o.id_companyid IS NOT NULL AND o.id_companyid = a.to_id_companyid)
      )
    WHERE a.id_animalid = ? 
      AND r.id_registry_id_companyid IN (?, ?, ?)
    ORDER BY a.transfer_date DESC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(
      ownerQuery,
      [animalId, REGISTRY_COMPANY_ID, REGISTRY_CHOCOLATE_WMSA, REGISTRY_WHITE_WMSA],
      async (err, row: OwnerQueryRow | undefined) => {
        if (err) {
          resolve(new Failure(`Database query failed: ${err.message}`));
          return;
        }

        if (!row) {
          resolve(new Failure("No ownership record found for given animal ID"));
          return;
        }

        if (row.to_id_contactid) {
          const contact: Contact = {
            id: row.to_id_contactid,
            firstName: row.contact_first_name ?? "",
            lastName: row.contact_last_name ?? "",
          };

          const premiseResult = await getContactPremise(contact.id);
          const premise = await unwrapOrFailWithAnimal(premiseResult, "owner premise", animalId);
          if (premise.tag === "error") return resolve(premise);

          const scrapieResult = await getScrapieFlockInfo(contact.id, false);
          const scrapieId = await unwrapOrFailWithAnimal(scrapieResult, "owner scrapie flock number", animalId);
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

        } else if (row.to_id_companyid) {
          const company: Company = {
            id: row.to_id_companyid,
            name: row.company_name ?? "",
            registry_id: row.registry_id ?? undefined,
          };

          const premiseResult = await getCompanyPremise(company.id);
          const premise = await unwrapOrFailWithAnimal(premiseResult, "owner premise", animalId);
          if (premise.tag === "error") return resolve(premise);

          const scrapieResult = await getScrapieFlockInfo(company.id, true);
          const scrapieId = await unwrapOrFailWithAnimal(scrapieResult, "owner scrapie flock number", animalId);
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
          resolve(new Failure("Ownership record has neither contact nor company ID"));
        }
      }
    );
  });
};
