import { render, screen } from '@testing-library/react';
import { TodoForm } from './TodoForm';
import userEvent from '@testing-library/user-event';

describe('TodoForm', () => {
  it('TodoForm-item-add', async () => {
    const addTodo = jest.fn();

    render(<TodoForm addTodo={addTodo}></TodoForm>);

    // '{enter}' = 输入空字符，然后回车
    userEvent.type(screen.getByTestId('input'), '{enter}');

    expect(addTodo).not.toBeCalled();

    // '123{enter}' = 输入123，然后回车
    userEvent.type(screen.getByTestId('input'), '123{enter}');

    expect(addTodo).toBeCalledWith('123');
  });
});
