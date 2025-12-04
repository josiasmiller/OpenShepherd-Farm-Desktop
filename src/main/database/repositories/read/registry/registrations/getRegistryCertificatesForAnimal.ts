import { Database } from "@database/async";
import { Result, Success, Failure } from "@common/core";
import { RegistryCertificate } from "@app/api";


/**
 * Fetch all registry certificates for a given animal and company.
 *
 * @param db The database instance
 * @param registryCompanyId The company ID
 * @param animalId The animal ID
 * @returns Result array of RegistryCertificate or failure message
 */
export async function getRegistryCertificatesForAnimal(
    db: Database,
    registryCompanyId: string,
    animalId: string
): Promise<Result<RegistryCertificate[], string>> {

  const query = `
    SELECT
      id_registrycertificateprintid AS id,
      id_animalid AS animalId,
      id_companyid AS registryCompanyId,
      id_registrationtypeid AS registrationType,
      printed AS isPrinted
    FROM registry_certificate_print_table
    WHERE id_companyid = ?
      AND id_animalid = ?
    ORDER BY created DESC
  `;

  try {
    const rows = await db.all<RegistryCertificate>(query, [registryCompanyId, animalId]);

    // Map `isPrinted` from INTEGER to boolean
    const certificates = rows.map(r => ({
      ...r,
      isPrinted: Boolean(r.isPrinted),
    }));

    return new Success(certificates);

  } catch (err: any) {
    return new Failure(`Failed to fetch registry certificates: ${err.message}`);
  }
}
