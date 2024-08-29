import { useState, useEffect } from 'react';
import './App.less';

import TestClass from '@/pages/news/components/TestClass';
import { LazyDemo, LazyNone } from '@/pages/news/lazyComponents';
import { LazyDemoCommon } from '@/lazyComponents/';
import TodoList from '@/pages/news/components/TodoList';
import Footer from '@/pages/news/components/Footer';

import { homeServer } from '@/api';

import { initTheme } from '@/styles/theme';

import { isDev, DateFormat } from '@/utils/index';

import uniqueId from 'lodash/uniqueId';

// 哈哈哈
function App() {
  const [lazyShow, setLazyShow] = useState(false);
  const [text, setText] = useState('');
  const [userList, setUserList] = useState<UserType[]>([]);

  useEffect(() => {
    (async function () {
      const list = await homeServer.getUserList();
      // console.log(list);
      setUserList(list);
    })();
  }, []);

  // 点击事件中动态引入css, 设置show为true d
  const onClick = () => {
    //import('./app.css');
    setLazyShow(true);
  };

  const setDark = () => {
    initTheme('dark');
  };

  const getName = () => {
    homeServer
      .getName()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className='box'>
        <div className='theme-title' onClick={setDark}>
          <span>我是主题颜色哈</span>
          222
        </div>
        <button onClick={getName}>getName</button>
        <TodoList></TodoList>
        <div>
          {userList.map((item) => {
            return (
              <div key={item.userId} data-testid='user-item'>
                {item.username}
              </div>
            );
          })}
        </div>
        <div>
          text: <span>{text}</span>
        </div>
        <div>
          <input
            type='text'
            placeholder='请输入'
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
        <button onClick={onClick}>lazyShow</button>
        {lazyShow && <LazyDemo></LazyDemo>}
        {lazyShow && <LazyDemoCommon></LazyDemoCommon>}
        {lazyShow && <LazyNone></LazyNone>}
        <h2>222webpack22225222-react-tswwddddssddd {isDev()}</h2>
        <h3>
          {DateFormat()}-{uniqueId()}
        </h3>
        <TestClass></TestClass>
      </div>

      <Footer></Footer>
    </>
  );
}
export default App;
