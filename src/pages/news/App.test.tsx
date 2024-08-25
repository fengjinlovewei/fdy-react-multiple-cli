import { render, screen } from '@testing-library/react';
import useEvent from '@testing-library/user-event';
import App from './App';

describe('App 测试', () => {
  it('测试-1', async () => {
    render(<App />);

    expect(await screen.findAllByTestId('user-item')).toHaveLength(5);
    // await waitFor(() => {
    //   expect(screen.getAllByTestId('user-item')).toHaveLength(5);
    // });
  });

  it.skip('测试-2', () => {
    const text = 'hello';
    render(<App />);
    useEvent.type(screen.getByPlaceholderText('请输入'), text);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
