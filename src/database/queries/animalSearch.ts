import { getDatabase } from "../dbConnection.js";

export const animalSearch = async () => {
    
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }


  // // const animalQuery = "SELECT animal_name, birth_date, death_date FROM animal_table";
  const animalQuery = "SELECT * FROM animal_table";
  // const animals = db.all(animalQuery); // fixme
  // console.log("IN ANIMALSEARCH DB QUERY");
  // console.log(animals);


    
  return new Promise((resolve, reject) => {
    db.all(animalQuery, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};