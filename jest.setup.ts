import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

beforeAll(() => {
  window.electronAPI = {
    selectDatabase: jest.fn().mockResolvedValue("fake/path/to/db.sqlite"),
    isDatabaseLoaded: jest.fn().mockResolvedValue(true),
  };
});