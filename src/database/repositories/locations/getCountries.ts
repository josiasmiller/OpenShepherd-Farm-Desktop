import { getDatabase } from "../../dbConnections.js";
import { CountryInfo } from "../../models/locations/country.js";

export const getCountries = async (): Promise<CountryInfo[]> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  let countryQuery = `
    SELECT 
        id_countryid AS id, 
        country_name AS name,
        country_abbrev as abbrev, 
        country_name_display_order as display_order
    FROM country_table`;

  return new Promise((resolve, reject) => {
    db.all(countryQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: CountryInfo[] = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          abbreviation: row.abbrev,
          display_order: row.display_order,
        }));

        resolve(results);
      }
    });
  });
};