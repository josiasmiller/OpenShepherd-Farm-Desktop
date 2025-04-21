// this allows us to import images from the `assets` folder like a module
declare module "*.png" {
  const value: string;
  export default value;
}