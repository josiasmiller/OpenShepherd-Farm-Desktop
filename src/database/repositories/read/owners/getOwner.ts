import { getDatabase } from "../../../dbConnections.js";
import { Result, Success, Failure, handleResult } from "../../../../shared/results/resultTypes.js";
import { Owner } from "../../../models/read/owners/owner.js";
import { OwnerType } from "../../../models/read/owners/ownerType.js";
import { getContactPremise } from "../premises/getContactPremise.js";
import { getCompanyPremise } from "../premises/getCompanyPremise.js";
import { Contact } from "../../../models/read/owners/contact.js";
import { Company } from "../../../models/read/owners/company.js";

import { REGISTRY_CHOCOLATE_WMSA, REGISTRY_COMPANY_ID, REGISTRY_WHITE_WMSA } from "../../../dbConstants.js";


type OwnerQueryRow = {
  to_id_contactid: string | null;
  to_id_companyid: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  company_name: string | null;
  registry_id: string | null;
};

export const getOwner = async (
  animalId: string
): Promise<Result<Owner, string>> => {
  const db = await getDatabase();
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
      r.id_registry_id_companyid AS registry_id
    FROM animal_ownership_history_table a
    LEFT JOIN contact_table c ON c.id_contactid = a.to_id_contactid
    LEFT JOIN company_table co ON co.id_companyid = a.to_id_companyid
    LEFT JOIN animal_registration_table r ON r.id_animalid = a.id_animalid
    WHERE a.id_animalid = ? 
      AND id_registry_id_companyid IN (?, ?, ?)
    ORDER BY a.transfer_date DESC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(ownerQuery, [animalId, REGISTRY_COMPANY_ID, REGISTRY_CHOCOLATE_WMSA, REGISTRY_WHITE_WMSA], async (err, row: OwnerQueryRow | undefined) => {
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

        return handleResult(premiseResult, {
          success: (premise) => resolve(new Success({
            type: OwnerType.CONTACT,
            contact,
            premise,
            scrapieId: "FIXME",
          })),
          error: (errMsg) => resolve(new Failure(`Failed to get premise for contact: ${errMsg}`)),
        });

      } else if (row.to_id_companyid) {
        const company: Company = {
          id: row.to_id_companyid,
          name: row.company_name ?? "",
          registry_id: row.registry_id ?? undefined,
        };

        const premiseResult = await getCompanyPremise(company.id);

        return handleResult(premiseResult, {
          success: (premise) => resolve(new Success({
            type: OwnerType.COMPANY,
            company,
            premise,
            scrapieId: "FIXME",
          })),
          error: (errMsg) => resolve(new Failure(`Failed to get premise for company: ${errMsg}`)),
        });

      } else {
        resolve(new Failure("Ownership record has neither contact nor company ID"));
      }
    });
  });
};