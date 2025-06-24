import { Failure, Result, Success } from "../../../../../shared/results/resultTypes.js";
import { getDatabase } from "../../../../dbConnections.js";
import { CodonResponse } from "../../../../models/read/animal/geneticCharacteristic/codonResponse.js";

type RawCodonRow = {
  codon136alleles: string;
};

export const getCodon136ForAnimal = async (
  animalId: string
): Promise<Result<CodonResponse | null, string>> => {
  const db = await getDatabase();
  if (!db) return new Failure("DB instance is null");

  const query = `
    SELECT c136.codon136_alleles AS codon136alleles
    FROM animal_genetic_characteristic_table agc
    JOIN genetic_characteristic_table gct
      ON agc.id_geneticcharacteristictableid = gct.id_geneticcharacteristicid
    JOIN genetic_codon136_table c136
      ON agc.id_geneticcharacteristicvalueid = c136.id_geneticcodon136id
    WHERE agc.id_animalid = ?
      AND gct.genetic_characteristic_table_display_name = 'Codon 136'
    ORDER BY agc.genetic_characteristic_date DESC, agc.genetic_characteristic_time DESC
    LIMIT 1
  `;

  return new Promise((resolve) => {
    db.get(query, [animalId], (err, row: RawCodonRow) => {
      if (err) return resolve(new Failure(`Query failed: ${err.message}`));
      if (!row) return resolve(new Success(null));

      resolve(new Success({
        codon: "Codon 136",
        alleles: row.codon136alleles,
      }));
    });
  });
};
