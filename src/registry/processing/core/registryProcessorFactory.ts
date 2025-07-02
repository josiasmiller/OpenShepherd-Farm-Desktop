import { RegistryProcessor, ValidationResult } from './types.js';
import { processBirthRows } from '../births/birthProcessor.js';
import { validateBirthRows } from '../births/validation/birthValidator.js';
// import { DeathProcessor } from '../deaths/deathProcessor';
// import { DeathValidator } from '../deaths/deathValidator';

const stubValidate = async () => {
  return [];
};

const stubProcess = async () => {
  return { success: true, insertedRowCount: 0 };
};

export const registryProcessorFactory = (type: string): RegistryProcessor => {
  switch (type) {
    case 'births':
      return {
        validateRegistryRows: validateBirthRows,
        processRegistryRows: processBirthRows,
      };
      // return {
      //   validateRegistryRows: stubValidate,
      //   processRegistryRows: processBirthRows,
      // };
    case 'deaths':
    //   return {
    //     validate: new DeathValidator().validate,
    //     process: new DeathProcessor().process,
    //   };
    default:
      throw new Error(`Unknown process type: ${type}`);
  }
};
