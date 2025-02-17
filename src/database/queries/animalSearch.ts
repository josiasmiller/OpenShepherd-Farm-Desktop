import { getDatabase } from "../dbConnection.js";

export interface AnimalSearchResults {
  flock_prefix: string | null,
  name: string;
  birthDate: string | null;
  deathDate: string | null;
}

export interface AnimalSearchQueryParameters {
  name?: string | null;
  status?: string | null;         // Status could be a dropdown field
  registrationType?: string | null;  // Registration Type
  registrationNumber?: string | null;
  birthStartDate?: string | null;   // Start date for birth range
  birthEndDate?: string | null;     // End date for birth range
  deathStartDate?: string | null;   // Start date for death range
  deathEndDate?: string | null;     // End date for death range
}

export const animalSearch = async (queryParams: AnimalSearchQueryParameters = {}): Promise<AnimalSearchResults[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  // Base query
  let animalQuery = "SELECT animal_name, birth_date, death_date FROM animal_table";
  const conditions: string[] = [];
  const values: any[] = [];

  // Conditionally add WHERE clauses based on provided parameters
  if (queryParams.name) {
    conditions.push("animal_name LIKE ?");
    values.push(`%${queryParams.name}%`); // Using LIKE for partial match
  }
  // if (queryParams.status) {
  //   conditions.push("status = ?");
  //   values.push(queryParams.status);
  // }
  if (queryParams.registrationType) {
    conditions.push("registration_type = ?");
    values.push(queryParams.registrationType);
  }
  // if (queryParams.registrationNumber) {
  //   conditions.push("registration_number LIKE ?");
  //   values.push(queryParams.registrationNumber);
  // }
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

  console.log("Final Query:", animalQuery);
  console.log("Query Values:", values);

  return new Promise((resolve, reject) => {
    db.all(animalQuery, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Map rows to Animal objects
        const animals = rows.map((row: any) => ({
          name: row.animal_name,
          birthDate: row.birth_date,
          deathDate: row.death_date || null,
        })) as AnimalSearchResults[];
        resolve(animals);
      }
    });
  });
};

