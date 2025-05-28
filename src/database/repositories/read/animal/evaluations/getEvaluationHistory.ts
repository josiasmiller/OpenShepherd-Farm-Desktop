import { getDatabase } from "../../../../dbConnections.js";
import { Result, Success, Failure } from "../../../../../shared/results/resultTypes.js";
import { EvaluationEvent } from "../../../../models/read/animal/evaluations/evaluationEvent.js";


export const getEvaluationHistory = async (animalId : string): Promise<Result<EvaluationEvent[], string>> => {
  const db = await getDatabase();
  if (db == null) {
    return new Failure("DB Instance is null");
  }

  let evalQuery = `
    WITH animal_eval AS (
      SELECT * FROM animal_evaluation_table WHERE id_animalid = ?
    ),

    trait_data AS (
      SELECT 'trait01' AS trait_id, trait_name01 AS trait_uuid, trait_score01 AS trait_score, NULL AS trait_units FROM animal_eval
      UNION ALL
      SELECT 'trait02', trait_name02, trait_score02, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait03', trait_name03, trait_score03, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait04', trait_name04, trait_score04, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait05', trait_name05, trait_score05, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait06', trait_name06, trait_score06, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait07', trait_name07, trait_score07, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait08', trait_name08, trait_score08, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait09', trait_name09, trait_score09, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait10', trait_name10, trait_score10, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait11', trait_name11, trait_score11, trait_units11 FROM animal_eval
      UNION ALL
      SELECT 'trait12', trait_name12, trait_score12, trait_units12 FROM animal_eval
      UNION ALL
      SELECT 'trait13', trait_name13, trait_score13, trait_units13 FROM animal_eval
      UNION ALL
      SELECT 'trait14', trait_name14, trait_score14, trait_units14 FROM animal_eval
      UNION ALL
      SELECT 'trait15', trait_name15, trait_score15, trait_units15 FROM animal_eval
      UNION ALL
      SELECT 'trait16', trait_name16, trait_score16, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait17', trait_name17, trait_score17, NULL FROM animal_eval
      UNION ALL
      SELECT 'trait18', trait_name18, trait_score18, NULL FROM animal_eval
    )

    SELECT 
      td.trait_id,
      td.trait_uuid,
      et.trait_name AS trait_readable_name,
      td.trait_score,
      COALESCE(ut.units_abbrev, td.trait_units) AS trait_units,
      et.id_evaluationtraitid,
      et.id_evaluationtraittypeid,
      et.evaluation_trait_display_order
    FROM trait_data td
    LEFT JOIN evaluation_trait_table et ON et.id_evaluationtraitid = td.trait_uuid
    LEFT JOIN custom_evaluation_traits_table cet ON cet.custom_evaluation_item = td.trait_uuid
    LEFT JOIN units_table ut 
      ON ut.id_unitsid = et.id_unitstypeid OR ut.id_unitsid = cet.id_evaluationtraitid
    WHERE td.trait_uuid IS NOT NULL
    ORDER BY et.evaluation_trait_display_order, td.trait_id;
  `;


  return new Promise((resolve, reject) => {
    db.all(evalQuery, [animalId], (err, rows) => {
      if (err) {
        reject(new Failure(err.message));
      } else {
        const results: EvaluationEvent[] = rows.map((row: any) => ({
          evaluationId: row.trait_uuid,
          traitId: row.trait_id,
          traitReadable: row.trait_readable_name,
          traitScore: row.trait_score,
        }));

        resolve(new Success(results));
      }
    });
  });
};