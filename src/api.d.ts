// global.d.ts

interface Api {
  updateQuery: (query: string) => Promise<void>;
  askQuery: (query: string) => Promise<any>;
  getDolar: () => Promise<any>;
}

interface Window {
  api: Api;
}
