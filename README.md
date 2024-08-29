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

```bash
# dll 打包，如果dll中的依赖变更，需要用这个命令重新打包
npm run dll:core
```

## 3.打包产物

![avatar](./markdown/build.jpg)

注意

1. 红色部分，每一个页面用到的图片会单独打包到这个页面目录
2. 蓝色部分是dll分离出来的包，打包后会自动注入到dist，并且注入到打包页面中。

## 4.提交代码

```bash
# 先执行
git add .
```

然后执行 git commit，这是可视化的提交

```bash
# 先执行
git commit
```

![avatar](./markdown/commit.jpg)

按照提示操作就可以了

但是如果你的commit符合规范，那么就不会出现这个提示，可以直接提交，但是我更推荐是用可视化，因为可以避免输入错误的麻烦。

```bash
# 符合规范的提交将不会出现可视化
git commit -m 'feat: 这是一个新的需求'
```

## 5.问题记录

1. 开发模式时，dll的 mode 也必须是 development ，否则热更新不生效。

2. node --trace-deprecation ./node_modules/.bin/webpack 不性，
   需要 node --trace-deprecation node_modules/webpack/bin/webpack.js --mode production 才能找到报警堆栈信息。

3. npx msw init ./public  
   作用是将msw需要用到的 mockServiceWorker.js 文件 放到公共目录，以便msw在客户端使用。
   ps：安装的2.2.5版本报错 Cannot read properties of undefined (reading 'url')
   解决办法：降级到2.1.4（注意把版本锁死！不能使用^或者~），因为新版本都有问题。然后删除 pnpm-lock.yaml 和 node_modules 重新安装，重新 npx msw init ./public。

4. jest使用msw有各种坑，以下为代表
   https://github.com/mswjs/msw/issues/1810
   https://github.com/mswjs/msw/issues/1796
   https://github.com/mswjs/msw/discussions/1934?sort=old

5. 有入口A-chunck，引入可异步 B-chunk，A和B都引用了 1.png ，打包的时候A的chunk中有
   "1.png(或者id)": () => 绝对路径1 的模块，B中没有这个木块的id，因为B是引用A中的id的

   但如果现在又有一个入口C-chunk，它也引用了异步B-chunk，这时 B-chunk 的模块中就会产生一个
   "1.png(或者id)": () => 绝对路径2 的模块，因为C中没有1.png ，所以B-chunk没法复用，只能创建。

   当C-chunk来捣乱后，那么此时 A-chunck 和 B-chunk又产生了新问题：

   "1.png(或者id)": () => 绝对路径1 的模块，b也有 "1.png(或者id)": () => 绝对路径2 的模块, 由于B是异步的，那么A先执行，把 "1.png(或者id)" 存入到 **webpack_module_cache** 的模块缓存容器中，当B一步执行完，也去设置"1.png(或者id)"这个id时，由于缓存中已经存在，所以直接返回了A的资源，

   所以，
   在A页面访问B，B中的1.png的链接是 绝对路径1，而不是 绝对路径2
   在C页面访问B，B中的1.png的链接是 绝对路径2，而不是 绝对路径1

   正常来说：绝对路径1 和 绝对路径2 总是相等的，引用那个都没有问题，但是，
   split-static-resource-plugin 插件会去修改 绝对路径1 和 绝对路径2，本意是想
   在A引用B的时候，B中的1.png依然能指向B/images中的1.png，但是由于这个机制，导致
   B中的1.png指向了A/images中的1.png

   不过这也不是一个问题了，不会导致结果错误，只是开发中看到不同入口引用同一异步chunk图片路径不一致有点奇怪。

6. 在使用dev模式的时候，css中的图片链接是localhost开头的，不是/\*\*/images这种绝对路径的格式，这是因为dev环境中没有使用
   MiniCssExtractPlugin.loader 生成独立的css文件，所以在 files 字段中找不到css文件，导致无法使用
   split-static-resource-plugin 替换路径。
