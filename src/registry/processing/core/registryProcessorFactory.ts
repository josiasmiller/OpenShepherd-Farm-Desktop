import { RegistryProcessor, ValidationResult } from './types.js';
import { processBirthRows } from '../impl/births/processor/birthProcessor.js';
import { validateBirthRows } from '../impl/births/validation/birthValidator.js';


export const registryProcessorFactory = (type: string): RegistryProcessor => {
  switch (type) {
    case 'births':
      return {
        validateRegistryRows: validateBirthRows,
        processRegistryRows: processBirthRows,
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
