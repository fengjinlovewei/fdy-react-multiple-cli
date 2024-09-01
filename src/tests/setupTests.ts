// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';

import i18n from '@/i18n';

import { server } from '@/api/mock/index.node.mock';

beforeAll(() => {
  server.listen();
  i18n.init();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
