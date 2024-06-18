## 1.安装

```bash
#推荐pnpm
pnpm i
```

```bash
yarn
```

```bash
npm i
```

## 2.运行

比如目录有news,search,shared三个页面，现在要使用dev启动news,search，有两种方式

##### 第1种

```bash
npm run dev
```

可以根据操作选择页面

![avatar](./markdown/tools-dev.jpg)

##### 第2种

```bash
# 用英文逗号分隔package
env PACKAGE=news,search npm run dev
```

这个会直接启动dev，不会出现可视化配置窗口。

还有其他命令也是一样

"build": "npm run tools && cross-env NODE_ENV=production webpack -c script/webpack.prod.js",
"build:analy": "npm run tools && cross-env NODE_ENV=production webpack -c script/webpack.analy.js",
"build:open": "npm run tools && cross-env NODE_ENV=production SERVER_HTTP=true webpack -c script/webpack.prod.js && http-server dist -p 3002 -d false --no-dotfiles -o index",

```bash
# 打包命令
npm run build # 可视化
env PACKAGE=news,search npm run build

# 依赖分析，资源消耗分析
npm run build:analy  # 可视化
env PACKAGE=news,search npm run build:analy

# 打完包，然后本地启动服务看看这是打包后的线上效果
npm run build:open  # 可视化
env PACKAGE=news,search npm run build:open
```
