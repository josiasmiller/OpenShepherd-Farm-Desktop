export {};

declare global {
  interface Window {
    electronAPI: {
      selectDatabase: () => Promise<{ message: string }>;
    };
  }
}
