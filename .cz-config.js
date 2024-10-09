'use strict';
module.exports = {
  types: [
    { value: 'feat', name: 'feat:       新增内容' },
    { value: 'fix', name: 'fix:        修复Bug' },
    {
      value: 'docs',
      name: 'docs:       修改文档，比如 README.md、CHANGELOG.md 等',
    },
    { value: 'style', name: 'style:      空格, 分号, UI, CSS等格式修复' },
    {
      value: 'refactor',
      name: '️refactor:   重构代码（即改进代码结构，不增加新功能或修复bug）',
    },
    { value: 'perf', name: '️️perf:       提升性能' },
    { value: 'test', name: 'test:       添加一个测试' },
    { value: 'build', name: 'build:      开发工具变动(构建、脚手架工具等)' },
  ],
  scopes: [
    { name: 'css' },
    { name: 'js,ts' },
    { name: 'jsx,tsx' },
    { name: 'node' },
  ],
  // it needs to match the value for field type. Eg.: 'fix'
  /*  scopeOverrides: {
	fix: [
	  {name: 'merge'},
	  {name: 'style'},
	  {name: 'e2eTest'},
	  {name: 'unitTest'}
	]
  },  */
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?(yes/no)',
  },
  allowCustomScopes: false,
  allowBreakingChanges: ['特性', '修复'],
  skipQuestions: ['scope', 'body'],
  // limit subject length d
  subjectLimit: 100,
};
