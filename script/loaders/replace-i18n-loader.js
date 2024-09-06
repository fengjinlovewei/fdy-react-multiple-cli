const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

const merge = require('lodash/merge');

/**
 * https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#%E6%A3%80%E6%9F%A5%E8%B7%AF%E5%BE%84path%E7%B1%BB%E5%9E%8B
 * babel手册
 */

let pathOrigin = null;
let pathMap = null;

const reg = /\{\{((?:.|\n)+?)\}\}/g;

const getPathMap = (object) => {
  if (pathOrigin) return;

  pathOrigin = {};
  pathMap = {};

  const is = (o) => typeof o === 'object' && o !== null;

  if (!is(object)) return;

  const flat = (obj, path) => {
    for (const [key, value] of Object.entries(obj)) {
      let newPath = path ? path + '.' + key : key;
      if (!is(value)) {
        newPath = newPath.replace(/\.(\d+)/g, '[$1]');
        pathMap[value] = newPath;
        pathOrigin[newPath] = true;
      } else {
        flat(value, newPath);
      }
    }
  };

  flat(object);
};

const contentType = {
  string: types.stringLiteral,
  jsx: (value) => {
    // 注意， template.expression 与 template.ast 区别
    // template.expression 是直接生成node节点
    // template.ast 生成的东西会在 node 外再包一层
    return template.expression(value, {
      plugins: ['jsx'],
    })();
  },
};

function run(content, newOption = {}) {
  const { element = {}, funcName } = newOption;
  const ast = parser.parse(content, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators-legacy'],
  });

  // console.log(ast);

  traverse(ast, {
    CallExpression(path) {
      // 如果带新增标记，那就跳过
      if (path.isNew) return;

      // 之前使用types.isIdentifier(path.node.callee) && path.node.callee.name === 't，不好用
      // 现在改用 generate(path.node.callee).code
      const calleeName = generate(path.node.callee).code;

      // 注意，return 只是把当前的path跳过了，当前path的子元素还会继续遍历！
      if (calleeName !== funcName) return;

      let value = path.node.arguments[0].value;
      const obj = path.node.arguments[1];

      // 如果使用传统的key获取方法，就不去处理
      if (pathOrigin[value]) {
        return;
      }

      // 如果文件中有对应的多语言，那就直接返回对应的key就好了
      if (pathMap[value]) {
        // throw new Error(` map 中不存在 ${value} `);
        path.node.arguments[0].value = pathMap[value];

        if (obj && types.isObjectExpression(obj)) {
          // <div>{t('要支付 {{price}} 元', { price, _price: 64 })}</div>
          // 删除掉测试变量，比如_price
          obj.properties = obj.properties.filter((item) => {
            return item.key.name.indexOf('_') !== 0;
          });
        }
        return;
      }

      // <div>{t('要支付 {{price}} 元', { price, _price: 64 })}</div>
      // 当没有匹配到 '要支付 {{price}} 元' 时，将会用 _price 测试数据进行替换
      // 显示：'要支付 64 元'，并且当前字符是红色文字，表示没有对应的多语言
      if (obj && types.isObjectExpression(obj)) {
        const objData = obj.properties.reduce((per, cur) => {
          if (cur.key.name.indexOf('_') === 0) {
            per[cur.key.name] = cur.value.value;
          }
          return per;
        }, {});

        value = value.replace(reg, (...arg) => {
          const [, key] = arg;
          return objData[`_${key.trim()}`];
        });
      }

      // 走到这，说明多语言没有定义当前节点，需要使用测试数据
      debugger;
      value = element.content.replace(reg, (...arg) => {
        const [origin, key] = arg;
        return key.trim() === 'value' ? value : origin;
      });

      const getNode = contentType[element.contentType];

      if (!getNode) {
        throw new Error('replace-i18n-loader 没有节点处理函数');
      }

      const newNode = getNode(value);

      if (!newNode) {
        throw new Error('replace-i18n-loader 节点处理函数出错，请检查');
      }

      newNode.isNew = true;

      path.replaceWith(newNode);
      // 当前节点已经被替换了，所以旧的节点的子节点没必要再遍历了
      // path.skip() 的作用就是不继续遍历当前元素的子元素。
      path.skip();
    },
  });

  return generate(ast, { sourceMaps: false }).code;
}

module.exports = function (content, map, meta) {
  //debugger;

  const option = this.getOptions();

  const newOption = merge(
    {},
    {
      languageJson: '',
      funcName: 't',
      element: {
        content: '{{value}}',
        contentType: 'string', // 'string'  'jsx'
      },
    },
    option,
  );

  if (!newOption.languageJson) {
    return content;
  }

  getPathMap(newOption.languageJson);

  return run(content, newOption);
};
