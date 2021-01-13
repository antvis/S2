declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
