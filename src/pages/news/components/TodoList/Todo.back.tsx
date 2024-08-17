import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Todo } from './Todo';

describe('todo-item', () => {
  it('todo-item-[show, handle]', () => {
    const todo = {
      id: 1,
      text: 'haha',
      isCompleted: true,
    };

    const toggleTodo = jest.fn();
    const removeTodo = jest.fn();

    render(
      <Todo
        todo={todo}
        toggleTodo={toggleTodo}
        removeTodo={removeTodo}
        index={todo.id}
      />,
    );
    expect(screen.getByText('haha')).toBeInTheDocument();
    expect(screen.getByText('Redo')).toBeInTheDocument();

    userEvent.click(screen.getByText('Redo'));
    expect(toggleTodo).toHaveBeenCalledTimes(1);

    // ps：点击过后的效果在单元测试是不应该关心的，那些应该在集成测试去做
    // 单元测试只需要关心本单元的基本方法已经触发了，保证基本功能可以用就行。
    // expect(screen.getByText('Complete')).toBeInTheDocument();

    userEvent.click(screen.getByText('x'));
    expect(removeTodo).toHaveBeenCalledTimes(1);
  });

  it('todo-item-[show, isCompleted-false]', () => {
    const todo = {
      id: 1,
      text: 'haha',
      isCompleted: false,
    };

    const toggleTodo = jest.fn();
    const removeTodo = jest.fn();

    render(
      <Todo
        todo={todo}
        toggleTodo={toggleTodo}
        removeTodo={removeTodo}
        index={todo.id}
      />,
    );

    expect(screen.getByText('Complete')).toBeInTheDocument();
  });
});
