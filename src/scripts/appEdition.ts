
export const isRegistryEdition = () => {
  return process.env.APP_EDITION === 'registry';
};