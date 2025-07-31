import { getDatabase } from "../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../shared/results/resultTypes.js";
import { Contact } from "../../../models/read/owners/contact.js";
import { Company } from "../../../models/read/owners/company.js";
import { getContactPremise } from "../premises/getContactPremise.js";
import { getCompanyPremise } from "../premises/getCompanyPremise.js";
import { getScrapieFlockInfo } from "../scrapie/getScrapieFlockInfo.js";
import { OwnerType } from "../../../client-types.js";
import { Owner } from "../../../models/read/owners/owner.js";
import { handleResult } from "../../../../shared/results/resultTypes.js";
import { ScrapieFlockInfo } from "../../../models/read/scrapie/scrapieFlockInfo.js";
import { Premise } from "../../../models/read/premises/premise.js";

export async function getBreederById(
  breederId: string,
  isCompany: boolean
): Promise<Result<Owner, string>> {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  try {
    if (isCompany) {
      const row = await new Promise<any>((resolve, reject) => {
        db.get(
          `
          SELECT
            c.id_companyid AS company_id,
            c.company AS company_name,
            (
              SELECT cp.company_phone
              FROM company_phone_table cp
              WHERE cp.id_companyid = c.id_companyid
              ORDER BY cp.created ASC
              LIMIT 1
            ) AS company_phone,
            o.membership_number
          FROM company_table c
          LEFT JOIN owner_registration_table o ON o.id_companyid = c.id_companyid
          WHERE c.id_companyid = ?
          `,
          [breederId],
          (err, row) => (err ? reject(err) : resolve(row))
        );
      });

      if (!row) return new Failure(`No company breeder found for ID: ${breederId}`);

      const company: Company = {
        id: row.company_id,
        name: row.company_name ?? "",
      };

      const premiseResult = await getCompanyPremise(company.id);
      let premise: Premise;
      const premiseHandled = await handleResult(premiseResult, {
        success: (data : Premise) => {
          premise = data;
          return null;
        },
        error: (e) => new Failure(`Failed to get breeder premise: ${e}`)
      });
      if (premiseHandled instanceof Failure) return premiseHandled;

      const scrapieResult = await getScrapieFlockInfo(company.id, true);
      let scrapieId: ScrapieFlockInfo | null;
      const scrapieHandled = await handleResult(scrapieResult, {
        success: (data : ScrapieFlockInfo | null) => {
          scrapieId = data;
          return null;
        },
        error: (e) => new Failure(`Failed to get scrapie ID: ${e}`)
      });
      if (scrapieHandled instanceof Failure) return scrapieHandled;

      scrapieId = scrapieId!;
      premise = premise!;

      return new Success({
        type: OwnerType.COMPANY,
        company,
        premise,
        scrapieId,
        phoneNumber: row.company_phone ?? "",
        flockId: row.membership_number ?? "",
      });

    } else {
      const row = await new Promise<any>((resolve, reject) => {
        db.get(
          `
          SELECT
            c.id_contactid AS contact_id,
            c.contact_first_name,
            c.contact_last_name,
            (
              SELECT cp.contact_phone
              FROM contact_phone_table cp
              WHERE cp.id_contactid = c.id_contactid
              ORDER BY cp.created ASC
              LIMIT 1
            ) AS contact_phone,
            o.membership_number
          FROM contact_table c
          LEFT JOIN owner_registration_table o ON o.id_contactid = c.id_contactid
          WHERE c.id_contactid = ?
          `,
          [breederId],
          (err, row) => (err ? reject(err) : resolve(row))
        );
      });

      if (!row) return new Failure(`No contact breeder found for ID: ${breederId}`);

      const contact: Contact = {
        id: row.contact_id,
        firstName: row.contact_first_name ?? "",
        lastName: row.contact_last_name ?? "",
      };

      const premiseResult = await getContactPremise(contact.id);
      let premise: Premise;
      const premiseHandled = await handleResult(premiseResult, {
        success: (data : Premise) => {
          premise = data;
          return null;
        },
        error: (e) => new Failure(`Failed to get breeder premise: ${e}`)
      });
      if (premiseHandled instanceof Failure) return premiseHandled;

      const scrapieResult = await getScrapieFlockInfo(contact.id, false);
      let scrapieId: ScrapieFlockInfo | null;
      const scrapieHandled = await handleResult(scrapieResult, {
        success: (data : ScrapieFlockInfo | null) => {
          scrapieId = data;
          return null;
        },
        error: (e) => new Failure(`Failed to get scrapie ID: ${e}`)
      });
      if (scrapieHandled instanceof Failure) return scrapieHandled;

      scrapieId = scrapieId!;
      premise = premise!;

      return new Success({
        type: OwnerType.CONTACT,
        contact,
        premise,
        scrapieId,
        phoneNumber: row.contact_phone ?? "",
        flockId: row.membership_number ?? "",
      });
    }
  } catch (err: any) {
    return new Failure(`Failed to fetch breeder by ID: ${err.message}`);
  }
}
