import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TodoItem from './TodoItem';
import { TodoForm } from './TodoForm';
import { toggleOneTodo } from './toggleOneTodo';
import * as styles from './index.module.less';

function App() {
  const { t, i18n } = useTranslation();
  const [todos, setTodos] = useState<TodoType[]>([
    {
      text: 'Learn about',
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

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh_CN' : 'en');
  };

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
      <div>{t('book.title')}</div>
      <div>{t('book.content')}</div>
      <button onClick={changeLanguage}>{i18n.language}</button>
      <div className={styles['todo-list']}>
        {todos.map((todo, index) => (
          <TodoItem
            key={index}
            index={index}
            todo={todo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;
