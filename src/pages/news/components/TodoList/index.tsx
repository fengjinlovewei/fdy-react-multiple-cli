import { useState } from 'react';
import { Todo } from './Todo';
import { TodoForm } from './TodoForm';
import { toggleOneTodo } from './toggleOneTodo';
import * as styles from './index.module.less';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([
    {
      text: 'Learn about dd',
      isCompleted: false,
    },
    {
      text: 'Meet friend for lunch',
      isCompleted: false,
    },
    {
      text: 'Build really cool todo app',
      isCompleted: false,
    },
  ]);

  const addTodo = (text: string) => {
    const newTodos = [...todos, { text }];
    setTodos(newTodos);
  };

  const toggleTodo = (index: number) => {
    const newTodos = toggleOneTodo(todos, index);
    setTodos(newTodos);
  };

  const removeTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div className={styles.app}>
      <div className={styles['todo-list']}>
        {todos.map((todo, index) => (
          <Todo key={index} index={index} todo={todo} toggleTodo={toggleTodo} removeTodo={removeTodo} />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;
