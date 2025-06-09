

export const isRegistryVersion = () => {
  return process.env.APP_VERSION_TYPE === 'registry';
}