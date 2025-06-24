import { getDatabase } from "../../../../dbConnections.js";
import { BirthType } from "../../../../models/read/animal/births/birthType.js";
import { BirthInfo } from "../../../../models/read/animal/births/birthInfo.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";

type BirthInfoRow = {
  birth_weight: number | null;
  id: string;
  name: string;
  abbreviation: string;
  display_order: number;
};

export const getBirthInfo = async (
  animalId: string
): Promise<Result<BirthInfo, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB instance is null");
  }

  const query = `
    SELECT 
      a.birth_weight,
      bt.id_birthtypeid AS id,
      bt.birth_type AS name,
      bt.birth_type_abbrev AS abbreviation,
      bt.birth_type_display_order AS display_order
    FROM animal_table a
    LEFT JOIN birth_type_table bt ON bt.id_birthtypeid = a.id_birthtypeid
    WHERE a.id_animalid = ?
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(query, [animalId], (err, row: BirthInfoRow | undefined) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
        return;
      }

      if (!row) {
        resolve(new Failure("No birth info found for the given animal ID"));
        return;
      }

      const birthType: BirthType = {
        id: row.id,
        name: row.name,
        abbreviation: row.abbreviation,
        display_order: row.display_order,
      };

      const birthInfo: BirthInfo = {
        birthType,
        birthWeight: row.birth_weight ?? 0,
      };

      resolve(new Success(birthInfo));
    });
  });
};
