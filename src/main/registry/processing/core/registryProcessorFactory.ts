import { RegistryProcessType } from '@app/api';
import { RegistryProcessor } from './types'

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
    case 'registrations':
      return {
        validateRegistryRows: validateRegistrationRows,
        processRegistryRows: processRegistrationRows,
      };
    default:
      throw new Error(`Unknown process type: ${type}`);
  }
};
