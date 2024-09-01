import { render, screen } from '@testing-library/react';
import useEvent from '@testing-library/user-event';

import { server } from '@/api/mock/index.node.mock';
import App from './App';

import { http, HttpResponse } from 'msw';

describe.only('App 测试', () => {
  it('测试-1', async () => {
    render(<App />);

    // 可以单独做拦截
    server.use(
      http.get('/api/getUserList', async () => {
        return HttpResponse.json([
          {
            userId: '22',
            username: 'aaa',
          },
          {
            userId: '22',
            username: 'aaa',
          },
          {
            userId: '22',
            username: 'aaa',
          },
        ]);
      }),
    );

    expect(await screen.findAllByTestId('user-item')).toHaveLength(3);
    // expect(await screen.findAllByTestId('user-item')).toHaveLength(5);
  });

  it.skip('测试-2', async () => {
    const text = 'hello';
    render(<App />);
    await useEvent.type(screen.getByPlaceholderText('请输入'), text);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
