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

  const price = Math.ceil(Math.random() * 100);

  return (
    <div className={styles.app}>
      <div>
        <div>{t('您需要要支付 {{price}} 元', { price, _price: 64 })}</div>
        <div>{t('翠鸟')}</div>
        <div>
          {t('翠鸟喜欢停在水边的苇秆上，一双红色的小爪子紧紧地抓住苇秆。')}
        </div>
        asdasd
        <div>{t('要支付 {{price}} 元', { price, _price: 64 })}</div>
        <div>{t('小猪')}</div>
        <div>{t('小猪骑在猴子的身上不断打人')}</div>asdasd
      </div>
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
