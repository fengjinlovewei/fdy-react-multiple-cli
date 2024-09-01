const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

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
            obj.properties = obj.properties.filter((item) => {
              return item.key.name.indexOf('_') !== 0;
            });
          }
          return;
        }

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
      }
    },
  });

  const { code } = generate(ast, { sourceMaps: false });

  return code;
}

module.exports = function (content, map, meta) {
  return run(content);
};
