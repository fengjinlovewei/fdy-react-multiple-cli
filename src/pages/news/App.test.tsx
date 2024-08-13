import { render, screen } from '@testing-library/react';
import useEvent from '@testing-library/user-event';
import App from './App';

describe('App 测试', () => {
  it('测试-1', () => {
    render(<App />);
    const linkElement = screen.getByText('我是主题颜色哈');
    // console.log('linkElement', linkElement);
    expect(linkElement).toBeInTheDocument();
  });

  it('测试-2', () => {
    const text = 'hello';
    render(<App />);
    useEvent.type(screen.getByPlaceholderText('请输入'), text);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
