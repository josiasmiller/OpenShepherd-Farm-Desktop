import { getDatabase } from "../../../../../dbConnections.js";
import { BirthType } from "../../../../../models/read/animal/births/birthType.js";
import { Result, Success, Failure } from "../../../../../../shared/results/resultTypes.js";

export const getBirthTypes = async (): Promise<Result<BirthType[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  const birthTypeQuery = `
    SELECT 
        id_birthtypeid AS id, 
        birth_type AS name,
        birth_type_abbrev as abbrev, 
        birth_type_display_order as display_order
    FROM birth_type_table`;

  return new Promise((resolve, reject) => {
    db.all(birthTypeQuery, [], (err, rows) => {
      if (err) {
        reject(new Failure<string>(err.message));  // Reject with failure, sending error message
      } else {
        const results: BirthType[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
        }));

        resolve(new Success<BirthType[]>(results));  // Resolve with success and results
      }
    });
  });
};
