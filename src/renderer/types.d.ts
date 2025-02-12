export {};

declare global {
  interface Window {
    electronAPI: {
      requestData: () => Promise<{ message: string }>;
      selectDatabase: () => Promise<{ message: string }>;
    };
  }
}
