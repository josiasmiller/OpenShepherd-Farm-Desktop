import { getDatabase } from '../../../../dbConnections';
import { v4 as uuidv4 } from 'uuid';
import { InsertAnimalTableInput } from '../../../../models/write/animal/animalTable/animalTableInput';
import { getCurrentDateTime } from '../../../../dbUtils';

/**
 * uploads an animal into the `animal_table`
 * 
 * @param input all pertinent data for uploading to the `animal_table`
 * @returns the generated UUID of the animal inserted
 */
export async function insertIntoAnimalTable(input: InsertAnimalTableInput): Promise<string> {
  const db = getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  const id = uuidv4();

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO animal_table (
        id_animalid,
        animal_name,
        id_sexid,
        sex_change_date,
        birth_date,
        birth_time,
        id_birthtypeid,
        birth_weight,
        birth_weight_id_unitsid,
        birth_order,
        rear_type,
        weaned_date,
        death_date,
        id_deathreasonid,
        sire_id,
        dam_id,
        foster_dam_id,
        surrogate_dam_id,
        hand_reared,
        id_managementgroupid,
        created,
        modified
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );`

    const todayDt : String = getCurrentDateTime();

    // handle cases where only the weight units are provided, but not the brith weight
    var birthWeight : number | null = null;
    var birthWeightUnitsId : String | null = null;

    if (input.birthWeight != null && input.birthWeightUnitsId != null) {
      birthWeight = input.birthWeight;
      birthWeightUnitsId = input.birthWeightUnitsId;
    }

    const values = [
      id,
      input.name,
      input.sexId,
      null, // sex_change_date
      input.birthdate,
      input.birthTime ?? "00:00:00",
      input.birthTypeId ?? '7585ea2e-dcdf-41cb-94c1-4d133d624c1e', // this UUID is also the default in the schema,
      birthWeight,
      birthWeightUnitsId,
      input.birthOrder ?? 1,
      input.rearType?.id ?? null,
      null, // weaned_date
      input.deathDate ?? null,
      input.deathReasonId ?? null,
      input.sireId ?? null,
      input.damId ?? null,
      input.fosterDamId ?? null, // foster dam id
      input.surrogateDamId ?? null, // surrogate_dam_id
      input.handReared ?? false,    // hand_reared
      null, // id_managemangegroupdid
      todayDt, // creafted
      todayDt, //modified
    ];

    db.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(id);
      }
    });
  });
}
