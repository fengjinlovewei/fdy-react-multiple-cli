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
