// Allow importing CSS modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// (Optional) also allow Sass modules
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
