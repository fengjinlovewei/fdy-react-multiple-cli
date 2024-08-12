import { render, screen } from '@testing-library/react';
import App from './App';

describe('App 测试', () => {
  it('测试-1', () => {
    render(<App />);
    const linkElement = screen.getByText('我是主题颜色哈哈');
    expect(linkElement).toBeInTheDocument();
  });
});
