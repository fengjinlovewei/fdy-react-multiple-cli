const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

/**
 * https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#%E6%A3%80%E6%9F%A5%E8%B7%AF%E5%BE%84path%E7%B1%BB%E5%9E%8B
 * babel手册
 */

const zh_CN_json = require('../../src/i18n/locales/zh_CN.json');

const getPathMap = (object) => {
  const pathOrigin = {};
  const pathMap = {};
  const is = (o) => typeof o === 'object' && o !== null;
  if (!is(object)) return { pathOrigin, pathMap };
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
  return { pathOrigin, pathMap };
};

const { pathOrigin, pathMap } = getPathMap(zh_CN_json);

function run(content) {
  const ast = parser.parse(content, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators-legacy'],
  });

  // console.log(ast);

  traverse(ast, {
    CallExpression(path) {
      if (
        types.isIdentifier(path.node.callee) &&
        path.node.callee.name === 't'
      ) {
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

          value = value.replace(/\{\{((?:.|\n)+?)\}\}/g, (...arg) => {
            const key = arg[1];

            console.log(arg);
            return objData[`_${key}`];
          });
        }

        const ast = template.ast(
          `<span style={{color: 'red'}}>${value}</span>`,
          {
            plugins: ['jsx'],
          },
        );

        path.replaceWith(ast);
        // 当前节点已经被替换了，所以旧的节点的子节点没必要再遍历了
        path.skip();
      }
    },
  });

  const { code } = generate(ast, { sourceMaps: false });

  return code;
}

module.exports = function (content, map, meta) {
  return run(content);
};
