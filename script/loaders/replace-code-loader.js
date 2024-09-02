const { isProd } = require('../common.js');

const List = {
  'api/mock/init.ts': 'export function enableMocking() {}',
};

module.exports = function (content, map, meta) {
  // debugger;
  // const options = this.getOptions();
  // console.log('loader1', content);
  // const filename = path.basename(this.resourcePath);
  // console.log('当前编辑的文件名:', filename);

  if (isProd) {
    for (const [path, replaceArr] of Object.entries(List)) {
      if (this.resourcePath.endsWith(path)) {
        if (typeof replaceArr === 'string') {
          content = replaceArr;
        } else {
          for (const [key, value] of replaceArr) {
            content = content.replaceAll(key, value);
          }
        }
      }
    }
  }
  return content;
};
