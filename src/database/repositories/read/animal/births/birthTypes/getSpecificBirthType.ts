import { getDatabase } from "../../../../../dbConnections.js";
import { BirthType } from "../../../../../models/read/animal/births/birthType.js";
import { Result, Success, Failure } from "../../../../../../shared/results/resultTypes.js";

interface BirthTypeRow {
  id: string;
  name: string;
  abbrev: string;
  display_order: number;
}

export const getSpecificBirthType = async (id: string): Promise<Result<BirthType, string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const query = `
    SELECT 
      id_birthtypeid AS id, 
      birth_type AS name,
      birth_type_abbrev AS abbrev, 
      birth_type_display_order AS display_order
    FROM birth_type_table
    WHERE id_birthtypeid = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row: BirthTypeRow | undefined) => {
      if (err) {
        reject(new Failure<string>(err.message));
      } else if (!row) {
        resolve(new Failure<string>(`No BirthType found for id: ${id}`));
      } else {
        const result: BirthType = {
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
        };
        resolve(new Success<BirthType>(result));
      }
    });
  });
};
