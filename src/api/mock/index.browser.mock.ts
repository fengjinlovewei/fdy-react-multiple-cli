import { setupWorker } from 'msw/browser';
import allMock from './index.mock';

export const worker = setupWorker(...allMock);
