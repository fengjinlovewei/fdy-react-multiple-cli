//const inquirer = require('inquirer');

import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { dirname } from 'dirname-filename-esm';

import { pages, getPackages, isDev } from './common.js';
import packageReadonly from './package-readonly.js';
// import server from '../src/api/mock/index.mock.mjs';

const __dirname = dirname(import.meta);

const packages = getPackages();

// 要操作的文件路径，相对路径
const jsonPath = path.join(__dirname, './package-readonly.json');

const PACKAGE = process.env.PACKAGE;

function writeJson(packages, isMock) {
  // pkg写入文件
  fs.writeFileSync(
    jsonPath,
    JSON.stringify({
      ...packageReadonly,
      packages,
      isMock,
    }),
  );
}

if (PACKAGE) {
  // pkg写入文件
  writeJson(PACKAGE.split(','), false);
} else {
  tools();
}

function tools() {
  const pagesObj = pages.map((name) => ({ name }));

  const promptList = [
    {
      type: 'list',
      message: `是否使用 mock 数据？`,
      name: 'isMock',
      when: () => isDev,
      choices: [
        {
          name: 'Yes',
          value: true,
        },
        {
          name: 'No',
          value: false,
        },
      ],
    },
    {
      type: 'list',
      message: `上次操作的目录为 ${chalk.green(packages.join(','))} ，是否继续使用？`,
      name: 'goon',
      when: () => !!packages.length,
      choices: [
        {
          name: 'Yes',
          value: true,
        },
        {
          name: 'No',
          value: false,
        },
      ],
    },
    {
      type: 'checkbox',
      message: '请使用 Space键 选一个或多个择操作目录，Enter键 确定。',
      name: 'pages',
      loop: false,
      validate: function (value) {
        const done = this.async();
        if (value.length === 0) {
          done('至少选择一个！');
          return;
        }
        done(null, true);
      },
      when: ({ goon }) => !goon,
      choices: pagesObj,
    },
  ];

  inquirer
    .prompt(promptList)
    .then(async ({ goon, pages, isMock }) => {
      writeJson(goon ? packages : pages, isMock);
    })
    .catch((error) => {
      console.log(error);
    });
}
