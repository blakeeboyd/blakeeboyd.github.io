/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*?worker&inline' {
  const WorkerConstructor: {
    new (): Worker;
  };
  export default WorkerConstructor;
}
