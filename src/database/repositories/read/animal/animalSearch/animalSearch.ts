import { getDatabase } from "../../../../dbConnections.js";
import { escapeLikeString } from "../../../../dbUtils.js";
import { AnimalSearchRequest, AnimalSearchResult } from "../../../../models/read/animal/animalSeach/animalSearch.js";

export const animalSearch = async (queryParams: AnimalSearchRequest = {}): Promise<AnimalSearchResult[]> => {
    const db = await getDatabase();
    if (db == null) {
      throw new TypeError("DB Instance is null");
    }
  
    // Base query
    let animalQuery = "SELECT id_animalid, animal_name, birth_date, death_date FROM animal_table";
    const conditions: string[] = [];
    const values: any[] = [];
  
    // Conditionally add WHERE clauses based on provided parameters
    if (queryParams.name) {
      const escapedName = escapeLikeString(queryParams.name);
      conditions.push("animal_name LIKE ?");
      values.push(`%${escapedName}%`);
    }
  
    if (queryParams.registrationType) {
      conditions.push("registration_type = ?");
      values.push(queryParams.registrationType);
    }
  
    if (queryParams.birthStartDate) {
      conditions.push("birth_date >= ?");
      values.push(queryParams.birthStartDate);
    }
  
    if (queryParams.birthEndDate) {
      conditions.push("birth_date <= ?");
      values.push(queryParams.birthEndDate);
    }
  
    if (queryParams.deathStartDate) {
      conditions.push("death_date >= ?");
      values.push(queryParams.deathStartDate);
    }
  
    if (queryParams.deathEndDate) {
      conditions.push("death_date <= ?");
      values.push(queryParams.deathEndDate);
    }
  
    // Append conditions to the query
    if (conditions.length > 0) {
      animalQuery += " WHERE " + conditions.join(" AND ");
    }
  
    // Add limit for safety
    animalQuery += " LIMIT 100";
  
    return new Promise((resolve, reject) => {
      db.all(animalQuery, values, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Map rows to Animal objects
          const animals = rows.map((row: any) => ({
            animal_id: row.id_animalid,
            name: row.animal_name,
            birthDate: row.birth_date,
            deathDate: row.death_date || null,
          })) as AnimalSearchResult[];
          resolve(animals);
        }
      });
    });
  };