# How to add new Queries

To add new queries, add a new typescript file in `src/database/queries`. From there, make sure to expose the function in
`src/database/index.ts`; exposing this function will allow the rest of the code to access it, otherwise it will remain hidden from the parts that need to access it.