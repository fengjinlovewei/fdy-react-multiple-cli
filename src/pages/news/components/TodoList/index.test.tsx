import { render, screen, within } from '@testing-library/react';
import TodoList from './index';
import userEvent from '@testing-library/user-event';

describe('TodoList', () => {
  it.only('TodoList-item', () => {
    render(<TodoList></TodoList>);
    //const { container } = render(<TodoList></TodoList>);
    // console.log(container.innerHTML);
    // 快照暂时还是不用了
    // expect(container).toMatchSnapshot();

    expect(screen.getAllByTestId('todo-item')).toHaveLength(3);
  });

  it('TodoList-item-add', async () => {
    render(<TodoList></TodoList>);

    // 这里必须用await，在其他测试组件里，没用await结果也是正确的，但是这个就是不行，很奇怪
    await userEvent.type(screen.getByTestId('input'), 'go home{enter}');

    expect(screen.getAllByTestId('todo-item')).toHaveLength(4);
  });

  it('TodoList-item-remove', async () => {
    render(<TodoList></TodoList>);

    // 这里必须用await，在其他测试组件里，没用await结果也是正确的，但是这个就是不行，很奇怪
    await userEvent.click(
      // 直接screen.getByText('Learn about').getByTestId('remove-todo') 是不行的
      // 需要借助 within 实现链式调用
      within(screen.getByText('Learn about')).getByTestId('remove-todo'),
    );

    expect(screen.getAllByTestId('todo-item')).toHaveLength(2);
  });

  it('TodoList-item-change', async () => {
    render(<TodoList></TodoList>);

    // 这里必须用await，在其他测试组件里，没用await结果也是正确的，但是这个就是不行，很奇怪
    await userEvent.click(
      within(screen.getByText('Learn about')).getByText('Complete'),
    );

    expect(screen.getByText('Redo')).toBeInTheDocument();
  });
});
