
console.log("WEWLAD!");
console.log(process.env.APP_VERSION_TYPE);

export const APP_VERSION_TYPE = process.env.APP_VERSION_TYPE || "standard";

console.log(APP_VERSION_TYPE);

export const isRegistryVersion = () => APP_VERSION_TYPE === "registry";
