import { isTest } from '@/utils';
describe('index', () => {
  it('测试', () => {
    expect(isTest()).toBe(true);
  });
});
