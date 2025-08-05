import { RegistryProcessor, RegistryProcessType, ValidationResult } from './types';

// births
import { processBirthRows } from '../impl/births/processor/birthProcessor';
import { validateBirthRows } from '../impl/births/validation/birthValidator';

// registrations
import { processRegistrationRows } from '../impl/registrations/processor/registrationProcessor';
import { validateRegistrationRows } from '../impl/registrations/validation/registrationsValidator';

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
    // here is where more processors will be added as they are implemented
    //   return {
    //     validate: new DeathValidator().validate,
    //     process: new DeathProcessor().process,
    //   };
    default:
      throw new Error(`Unknown process type: ${type}`);
  }
};
