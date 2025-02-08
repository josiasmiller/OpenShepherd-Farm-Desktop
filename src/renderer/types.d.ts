export {};

declare global {
  interface Window {
    electronAPI: {
      requestData: () => Promise<{ message: string }>;
    };
  }
}
