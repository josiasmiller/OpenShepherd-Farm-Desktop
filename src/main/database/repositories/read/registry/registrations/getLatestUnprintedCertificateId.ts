import { Database } from "sqlite3";
import { Result, Success, Failure } from "@common/core";

export async function getLatestUnprintedCertificateId(
  db: Database,
  registryCompanyId: string,
  animalId: string
): Promise<Result<string, string>> {

  const query = `
    SELECT
      id_registrycertificateprintid
    FROM registry_certificate_print_table
    WHERE id_companyid = ?
      AND id_animalid = ?
      AND printed = 0
    ORDER BY
      created DESC       -- Newest unprinted record first
    LIMIT 1
  `;

  try {
    const row = await new Promise<{ id_registrycertificateprintid: string } | undefined>((resolve, reject) => {
      db.get(query, [registryCompanyId, animalId], (err, row) => {
        if (err) reject(err);
        else resolve(row as { id_registrycertificateprintid: string } | undefined);
      });
    });

    if (!row) {
      return new Failure(
        `No unprinted certificate record found for company=${registryCompanyId}, animal=${animalId}`
      );
    }

    return new Success(row.id_registrycertificateprintid);

  } catch (err: any) {
    return new Failure(`Database error: ${err.message}`);
  }
}

