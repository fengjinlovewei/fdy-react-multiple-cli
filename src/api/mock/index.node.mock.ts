import { setupServer } from 'msw/node';
import allMock from './index.mock';

export const server = setupServer(...allMock);
