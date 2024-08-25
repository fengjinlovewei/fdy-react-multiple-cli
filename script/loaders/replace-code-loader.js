//const loaderUtils = require('loader-utils');
const { isProd } = require('../common.js');

const List = {
  "import('@/api/mock/index.browser.mock')": '{ worker: { start: () => {} } }',
};

module.exports = function (content, map, meta) {
  debugger;
  // const options = loaderUtils.getOptions(this);
  // console.log('loader1', content);
  if (isProd) {
    for (const [key, value] of Object.entries(List)) {
      content = content.replaceAll(key, value);
    }
  }
  return content;
};
