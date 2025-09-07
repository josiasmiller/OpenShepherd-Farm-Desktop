import { getDatabase } from '../../../../dbConnections';
import { getCurrentDateTime } from '../../../../dbUtils';
import { v4 as uuidv4 } from 'uuid';
import { InsertWeightRecordInput } from '../../../../models/write/animal/weightEvaluation/animalEvaluationWeightInput';


/**
 * inserts a row into the `animal_evaluation_table`
 * 
 * @param input pertinent weight record data
 * @returns A `Result` containing the UUID of the inserted row on success, 
 *          or a string error message on failure.
 */
export async function insertWeightRecord(input: InsertWeightRecordInput): Promise<string> {
  const db = getDatabase();
  if (db == null) {
    throw new TypeError("DB instance is null");
  }

  const id = uuidv4();

  const query = `
    INSERT INTO animal_evaluation_table (
      id_animalevaluationid,
      id_animalid,
      trait_name11,
      trait_score11,
      trait_units11,
      eval_date,
      eval_time,
      age_in_days,
      created,
      modified
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
  `;

  const todayDt : String = getCurrentDateTime();

  const values = [
    id,
    input.animalId,
    '44d307ab-5c32-44c7-bb06-e65c11269716', // UUID for Weight in `evaluation_trait_table`
    input.weight,
    input.weightUnitId,
    input.evalDate,
    input.evalTime,
    input.ageInDays,
    todayDt,
    todayDt,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(id);
      }
    });
  });
}
