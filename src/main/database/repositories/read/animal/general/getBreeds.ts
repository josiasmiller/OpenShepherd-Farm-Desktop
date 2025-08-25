import { getDatabase } from "../../../../dbConnections";
import { Result, Success, Failure, handleResult } from "packages/core";
import { Breed, BreedRequest } from "packages/api";

/**
 * gets all breeds from the DB, or just breeds of a given species when requested
 * @param queryParams parameters for the breed search
 * @returns A `Result` containing an array of `Breed` objects on success, 
 *          or a string error message on failure.
 */
export const getBreeds = async (queryParams: BreedRequest): Promise<Result<Breed[], string>> => {
  const db = getDatabase();
  if (db == null) {
    return new Failure<string>("DB Instance is null"); // Return Failure with a string error message if DB instance is null
  }

  try {
    let breeds: Breed[];

    // If species_id is provided, fetch breeds by species_id
    if (queryParams.species_id != null) {
      breeds = await getBreedsById(db, queryParams.species_id);
    } else {
      // If no species_id, fetch all breeds
      breeds = await getAllBreeds(db);
    }

    return new Success<Breed[]>(breeds); // Return Success with the fetched breeds
  } catch (error) {
    return new Failure<string>(String(error)); // Return Failure if any error occurs during fetching
  }
};

// Get breed by species ID
const getBreedsById = (db: any, id: string): Promise<Breed[]> => {
  const query = `
    SELECT 
        id_breedid AS id, 
        breed_name AS name,
        breed_display_order AS display_order,
        id_speciesid AS species_id
    FROM breed_table
    WHERE id_speciesid = ?`;

  return executeQuery(db, query, [id]);
};

// Get all breeds (default)
const getAllBreeds = (db: any): Promise<Breed[]> => {
  const query = `
    SELECT 
        id_breedid AS id, 
        breed_name AS name,
        breed_display_order AS display_order,
        id_speciesid AS species_id
    FROM breed_table`;

  return executeQuery(db, query, []);
};

// Helper function to execute queries and return the breed data directly
const executeQuery = (db: any, query: string, params: any[]): Promise<Breed[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err: any, rows: any[]) => {
      if (err) {
        reject("Error executing query");
      } else {
        const results: Breed[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          display_order: row.display_order,
          species_id: row.species_id,
        }));

        resolve(results);
      }
    });
  });
};