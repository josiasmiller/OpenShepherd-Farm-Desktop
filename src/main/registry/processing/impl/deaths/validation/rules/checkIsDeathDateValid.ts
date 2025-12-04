import { ValidationResponse, AnimalDeath } from '@app/api';

export function checkDeathDateFormat(row: AnimalDeath): ValidationResponse {
    const errors: string[] = [];
    const { deathDate, animalId, name } = row;

    // if not provided, exit check early
    if (deathDate === null || deathDate === undefined) {
        errors.push(
            `deathDate for animal ID='${animalId}' and name='${name}' was not provided.`
        );
        return { checkName: "checkDeathDateFormat", errors, passed: errors.length === 0 };
    }

    // Regex: YYYY-MM-DD where MM = 01–12 and DD = 01–31
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(deathDate)) {
        errors.push(
            `Invalid deathDate format for animal ID='${animalId}' and name='${name}'. Expected 'YYYY-MM-DD', got '${deathDate}'.`
        );
    } else {
        // Extra check: verify it's a real calendar date
        const d = new Date(deathDate);
        const [y, m, day] = deathDate.split('-').map(Number);

        const valid =
            d.getUTCFullYear() === y &&
            d.getUTCMonth() + 1 === m &&
            d.getUTCDate() === day;

        if (!valid) {
            errors.push(
                `deathDate for animal ID='${animalId}' and name='${name}' is not a valid calendar date ('${deathDate}').`
            );
        }
    }

    return { checkName: "checkDeathDateFormat", errors, passed: errors.length === 0 };
}
