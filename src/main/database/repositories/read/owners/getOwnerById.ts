import { getDatabase } from "../../../dbConnections";
import { getContactPremise } from "../premises/getContactPremise";
import { getCompanyPremise } from "../premises/getCompanyPremise";
import { getScrapieFlockInfo } from "../scrapie/getScrapieFlockInfo";
import { Owner, OwnerType, Contact, Company } from "packages/api";
import { Result, Success, Failure } from "packages/core";

type OwnerByIdRow = {
  id_contactid?: string | null;
  id_companyid?: string | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  company_name?: string | null;
  registry_id?: string | null;
  membership_number?: string | null;
  contact_phone?: string | null;
  company_phone?: string | null;
};

/**
 * Public API
 * Gets an owner by their UUID, knowing if it's a company or contact.
 */
export const getOwnerById = async (
  ownerId: string,
  isCompany: boolean
): Promise<Result<Owner, string>> => {
  const db = getDatabase();
  if (!db) {
    return new Failure("DB instance is null");
  }

  return isCompany
    ? _getCompanyOwnerById(db, ownerId)
    : _getContactOwnerById(db, ownerId);
};

/**
 * Private helper: Fetches a contact owner
 */
const _getContactOwnerById = async (
  db: any,
  ownerId: string
): Promise<Result<Owner, string>> => {
  const contactQuery = `
    WITH first_phone AS (
      SELECT
        cp.id_contactid,
        cp.contact_phone,
        ROW_NUMBER() OVER (
          PARTITION BY cp.id_contactid
          ORDER BY cp.created ASC
        ) AS rn
      FROM contact_phone_table cp
    )
    SELECT 
      c.id_contactid,
      c.contact_first_name,
      c.contact_last_name,
      o.membership_number,
      fp.contact_phone
    FROM contact_table c
    LEFT JOIN owner_registration_table o
      ON o.id_contactid = c.id_contactid
    LEFT JOIN first_phone fp
      ON fp.id_contactid = c.id_contactid
      AND fp.rn = 1
    WHERE c.id_contactid = ?
    LIMIT 1;
  `;

  const row: OwnerByIdRow | undefined = await new Promise((resolve, reject) => {
    db.get(contactQuery, [ownerId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  }).catch(err => {
    return new Failure(`Database query failed: ${err.message}`);
  });

  if (row instanceof Failure) return row;

  if (!row || !row.id_contactid) {
    return new Failure(`No contact record found for ID: ${ownerId}`);
  }

  const contact: Contact = {
    id: row.id_contactid,
    firstName: row.contact_first_name ?? "",
    lastName: row.contact_last_name ?? "",
  };

  const premiseResult = await getContactPremise(contact.id);
  if (premiseResult.tag === "error") return premiseResult;

  const scrapieResult = await getScrapieFlockInfo(contact.id, false);
  if (scrapieResult.tag === "error") return scrapieResult;

  return new Success({
    type: OwnerType.CONTACT,
    contact,
    premise: premiseResult.data,
    scrapieId: scrapieResult.data,
    phoneNumber: row.contact_phone ?? "",
    flockId: row.membership_number ?? "",
  });
};


/**
 * Private helper: Fetches a company owner
 */
const _getCompanyOwnerById = async (
  db: any,
  ownerId: string
): Promise<Result<Owner, string>> => {
  const companyQuery = `
    WITH first_phone AS (
      SELECT
        cp.id_companyid,
        cp.company_phone,
        ROW_NUMBER() OVER (
          PARTITION BY cp.id_companyid
          ORDER BY cp.created ASC
        ) AS rn
      FROM company_phone_table cp
    )
    SELECT 
      co.id_companyid,
      co.company AS company_name,
      r.id_registry_id_companyid AS registry_id,
      o.membership_number,
      fp.company_phone
    FROM company_table co
    LEFT JOIN owner_registration_table o
      ON o.id_companyid = co.id_companyid
    LEFT JOIN animal_registration_table r
      ON r.id_registry_id_companyid = co.id_companyid
    LEFT JOIN first_phone fp
      ON fp.id_companyid = co.id_companyid
      AND fp.rn = 1
    WHERE co.id_companyid = ?
    LIMIT 1;
  `;

  const row: OwnerByIdRow | undefined = await new Promise((resolve, reject) => {
    db.get(companyQuery, [ownerId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  }).catch(err => {
    return new Failure(`Database query failed: ${err.message}`);
  });

  if (row instanceof Failure) return row;
  
  if (!row || !row.id_companyid) {
    return new Failure(`No company record found for ID: ${ownerId}`);
  }

  const company: Company = {
    id: row.id_companyid,
    name: row.company_name ?? "",
    registry_id: row.registry_id ?? undefined,
  };

  const premiseResult = await getCompanyPremise(company.id);
  if (premiseResult.tag === "error") return premiseResult;

  const scrapieResult = await getScrapieFlockInfo(company.id, true);
  if (scrapieResult.tag === "error") return scrapieResult;

  return new Success({
    type: OwnerType.COMPANY,
    company,
    premise: premiseResult.data,
    scrapieId: scrapieResult.data,
    phoneNumber: row.company_phone ?? "",
    flockId: row.membership_number ?? "",
  });
};
