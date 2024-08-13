import { PureComponent } from 'react';
import { Button, Space } from 'antd-mobile';

import person from '@/assets/images/person.jpeg';
import xiaoxiao from '@/assets/images/xiaoxiao.jpeg';
import w1 from '@/assets/images/w1.webp';

import { isDev, DateFormat } from '@/utils/index';

// 装饰器为,组件添加age属性
function addAge(Target: any) {
  Target.prototype.age = 111;
}

// 使用装饰圈
@addAge
class TestClass extends PureComponent {
  age?: number;

  render() {
    return (
      <>
        <h2>
          我是类组件---{this.age}--{isDev()}
        </h2>
        <Space wrap>
          <Button color='primary' fill='solid'>
            Solid
          </Button>
          <Button color='primary' fill='outline'>
            Outline
          </Button>
          <Button color='primary' fill='none'>
            None
          </Button>
        </Space>
        <h3>{DateFormat()}</h3>
        <h4>{DateFormat()}</h4>
        <img src={person} alt='' />
        <img src={xiaoxiao} alt='' />
        <img src={w1} alt='' />
      </>
    );
  }
}

export default TestClass;
