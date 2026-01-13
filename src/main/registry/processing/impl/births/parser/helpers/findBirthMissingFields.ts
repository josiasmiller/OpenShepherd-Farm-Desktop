/**
 * checks to see if there are any missing fields of a Births JSON file
 * @param fileContents
 */
export function findBirthMissingFields(fileContents: any): string[] {
  const missing: string[] = [];

  // Check births array
  if (!fileContents?.births || !Array.isArray(fileContents.births)) {
    missing.push("births (missing or not an array)");
    return missing; // cannot inspect further
  }

  fileContents.births.forEach((b: any, i: number) => {
    const base = (field: string) => `births[${i}].${field}`;

    // Helper to check required keys
    const ensure = (obj: any, field: string) => {
      if (obj === undefined || obj === null) missing.push(base(field));
    };

    ensure(b, "breeder");
    ensure(b?.breeder?.key, "breeder.key");
    ensure(b?.breeder?.value, "breeder.value");

    ensure(b, "isStillborn");
    ensure(b, "animalName");

    ensure(b, "sex");
    ensure(b?.sex?.key, "sex.key");
    ensure(b?.sex?.value, "sex.value");

    ensure(b, "birth");
    ensure(b?.birth?.date, "birth.date");
    ensure(b?.birth?.type?.key, "birth.type.key");
    ensure(b?.birth?.type?.value, "birth.type.value");
    ensure(b?.birth?.service?.key, "birth.service.key");
    ensure(b?.birth?.service?.value, "birth.service.value");

    ensure(b, "parents");
    ensure(b?.parents?.sireId, "parents.sireId");
    ensure(b?.parents?.damId, "parents.damId");

    ensure(b, "prefix");
    ensure(b?.prefix?.key, "prefix.key");
    ensure(b?.prefix?.value, "prefix.value");

    ensure(b, "coatColor");
    ensure(b?.coatColor?.tableKey, "coatColor.tableKey");
    ensure(b?.coatColor?.key, "coatColor.key");
    ensure(b?.coatColor?.value, "coatColor.value");

    ensure(b, "weight");
    ensure(b?.weight?.units?.key, "weight.units.key");
    ensure(b?.weight?.units?.value, "weight.units.value");

    // we only check if tags are non-null when animal is not stillborn
    if (b?.isStillborn === false) {
      ensure(b, "tags");

      const tagTypes: ("federal" | "farm")[] = ["federal", "farm"];
      for (const tagType of tagTypes) {
        ensure(b?.tags?.[tagType], `tags.${tagType}`);
        ensure(b?.tags?.[tagType]?.type?.key, `tags.${tagType}.type.key`);
        ensure(b?.tags?.[tagType]?.type?.value, `tags.${tagType}.type.value`);
        ensure(b?.tags?.[tagType]?.color?.key, `tags.${tagType}.color.key`);
        ensure(b?.tags?.[tagType]?.color?.value, `tags.${tagType}.color.value`);
        ensure(b?.tags?.[tagType]?.location?.key, `tags.${tagType}.location.key`);
        ensure(b?.tags?.[tagType]?.location?.value, `tags.${tagType}.location.value`);
      }
    }
  });

  return missing;
}
