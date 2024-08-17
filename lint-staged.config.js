module.exports = {
  // git add . 后， git commit 之前执行的命令
  // lint-staged 作用 对已经通过 git add 加入到 提交区 stage 的文件进行扫描即可。
  // --passWithNoTests 表示没有测试用例返回0，而不是1
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
};
