module.exports = {
  // git add . 后， git commit 之前执行的命令
  '*.{js,jsx,ts,tsx}': ['jest', 'prettier --write', 'eslint --fix'],
};
