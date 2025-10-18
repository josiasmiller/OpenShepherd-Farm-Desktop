import {Database} from "sqlite3";
import { Result, Success, Failure } from "packages/core";
import { Premise, State } from "packages/api";

// Updated row type to include full state fields
type PremiseRow = {
  premise_id: string;
  address_one: string;
  city: string;
  postcode: string;
  country_name: string;
  state_id: string | null;
  state_name: string | null;
  state_abbrev: string | null;
  state_display_order: number | null;
  state_country_id: string | null;
};

/**
 * gets a specific premise from the DB
 *
 * @param db The Database to act on
 * @param premiseId UUID of the premise being sought
 * @returns A `Result` containing a `Premise` object on success, 
 *          or a string error message on failure.
 */
export const getPremiseSpecific = async (db: Database, premiseId: string): Promise<Result<Premise, string>> => {

  const premiseQuery = `
    SELECT 
        p.id_premiseid AS premise_id, 
        p.premise_address1 AS address_one,
        p.premise_city AS city,
        p.premise_postcode AS postcode,
        c.country_name AS country_name,
        s.id_stateid AS state_id,
        s.state_name AS state_name,
        s.state_abbrev AS state_abbrev,
        s.state_display_order AS state_display_order,
        s.id_countryid AS state_country_id
    FROM premise_table p
    JOIN country_table c ON p.premise_id_countryid = c.id_countryid
    LEFT JOIN state_table s ON p.premise_id_stateid = s.id_stateid
    WHERE p.id_premiseid = ?
    LIMIT 1`;

  return new Promise((resolve) => {
    db.get(premiseQuery, [premiseId], (err, row: PremiseRow | undefined) => {
      if (err) {
        resolve(new Failure(`Database query failed: ${err.message}`));
      } else if (!row) {
        resolve(new Failure(`No premise found with ID: ${premiseId}`));
      } else {
        const result: Premise = {
          id: row.premise_id,
          address: row.address_one,
          city: row.city,
          postcode: row.postcode,
          country: row.country_name,
          state: {
            id: row.state_id ?? "",
            name: row.state_name ?? "",
            abbreviation: row.state_abbrev ?? "",
            display_order: row.state_display_order ?? 0,
            country_id: row.state_country_id ?? "",
          } as State,
        };

        resolve(new Success(result));
      }
    });
  });
};
