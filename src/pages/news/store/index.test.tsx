import { renderHook, act } from '@testing-library/react';
import { useStore } from './index';

describe.only('store 测试', () => {
  it('store 测试-1', async () => {
    const { result } = renderHook(useStore);

    result.current.name;

    expect(result.current).toMatchObject({
      level: 10,
      name: 'fengjin',
      setLevel: expect.any(Function),
      setName: expect.any(Function),
    });

    act(() => {
      result.current.setLevel(100);
      result.current.setName('zhangwei');
    });

    expect(result.current.level).toBe(100);
    expect(result.current.name).toBe('zhangwei');
  });
});
