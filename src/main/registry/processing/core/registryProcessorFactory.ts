import { RegistryProcessType, ValidationResult } from '@app/api';
import { RegistryProcessor } from './types'

// births
import { processBirthRows } from '../impl/births/processor/birthProcessor';
import { validateBirthRows } from '../impl/births/validation/birthValidator';

// registrations
import { processRegistrationRows } from '../impl/registrations/processor/registrationProcessor';
import { validateRegistrationRows } from '../impl/registrations/validation/registrationsValidator';
import { validateTransferRows } from '../impl/transfers/validation/transferValidator';
import { processTransferRows } from '../impl/transfers/processor/transferProcessor';

// deaths
import { processDeathRows } from '../impl/deaths/processor/deathProcessor';
import { validateDeathRows } from '../impl/deaths/validation/deathValidator';

/**
 * Factory for retrieving the pertinent validator and processor for a given RegistryProcessType
 * @param type type of registry process being handled
 * @returns RegistryProcessor
 */
export const registryProcessorFactory = (type: RegistryProcessType): RegistryProcessor => {
  switch (type) {
    case 'births':
      return {
        validateRegistryRows: validateBirthRows,
        processRegistryRows: processBirthRows,
      };
    case 'registrations':
      return {
        validateRegistryRows: validateRegistrationRows,
        processRegistryRows: processRegistrationRows,
      };
    case 'deaths':
      return {
        validateRegistryRows: validateDeathRows,
        processRegistryRows: processDeathRows,
      };
    case 'transfers':
      return {
        validateRegistryRows: validateTransferRows,
        processRegistryRows: processTransferRows,
      }
    default:
      throw new Error(`Unknown process type: ${type}`);
  }
};
