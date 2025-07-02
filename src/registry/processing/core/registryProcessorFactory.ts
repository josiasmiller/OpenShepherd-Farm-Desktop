import { RegistryProcessor } from './types.js';
import { BirthProcessor } from '../births/birthProcessor.js';
import { BirthValidator } from '../births/validation/birthValidator.js';
// import { DeathProcessor } from '../deaths/deathProcessor';
// import { DeathValidator } from '../deaths/deathValidator';

export const registryProcessorFactory = (type: string): RegistryProcessor => {
  switch (type) {
    case 'births':
      return {
        validate: new BirthValidator().validate,
        process: new BirthProcessor().process,
      };
    case 'deaths':
    //   return {
    //     validate: new DeathValidator().validate,
    //     process: new DeathProcessor().process,
    //   };
    default:
      throw new Error(`Unknown process type: ${type}`);
  }
};
