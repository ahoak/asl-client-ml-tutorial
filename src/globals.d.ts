declare type Point3D = {
  x: number;
  y: number;
  z: number;
};
declare module '*.ts?raw' {
  const contents: string;
  export default contents;
}
declare module '*.html' {
  const contents: string;
  export default contents;
}
