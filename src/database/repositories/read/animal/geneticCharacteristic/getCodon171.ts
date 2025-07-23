import { Failure, Result, Success } from "../../../../../shared/results/resultTypes";
import { getDatabase } from "../../../../dbConnections";
import { CodonResponse } from "../../../../models/read/animal/geneticCharacteristic/codonResponse";

type RawCodonRow = {
  codon171alleles: string;
};

/**
 * gets the Codon 171 data for a given animal
 * @param animalId UUID of animal being sought
 * @returns A `Result` containing a`CodonResponse` or `null` object on success, 
 *          or a string error message on failure.
 */
export const getCodon171ForAnimal = async (
  animalId: string
): Promise<Result<CodonResponse | null, string>> => {
  const db = getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT c171.codon171_alleles AS codon171alleles
    FROM animal_genetic_characteristic_table agc
    JOIN genetic_characteristic_table gct
      ON agc.id_geneticcharacteristictableid = gct.id_geneticcharacteristicid
    JOIN genetic_codon171_table c171
      ON agc.id_geneticcharacteristicvalueid = c171.id_geneticcodon171id
    WHERE agc.id_animalid = ?
      AND gct.genetic_characteristic_table_display_name = 'Codon 171'
    ORDER BY agc.genetic_characteristic_date DESC, agc.genetic_characteristic_time DESC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(query, [animalId], (err, row: RawCodonRow) => {
      if (err) return resolve(new Failure(`Query failed: ${err.message}`));
      if (!row) return resolve(new Success(null));

      resolve(new Success({
        codon: "Codon 171",
        alleles: row.codon171alleles,
      }));
    });
  });
};
