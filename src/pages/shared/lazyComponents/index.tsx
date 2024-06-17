import { lazy, Suspense } from 'react';

/**
 * 异步加载的组件，不但组件被单独打包成js，组件使用的css也会被单独打包成css文件
 * 并且在加载的时候，先加载css，再加载js，估计是要保证样式不会闪烁
 * 异步加载组件的原理还需要研究
 */

const Demo = lazy(
  () =>
    // 设置 webpackPreload: true 不起作用
    import(
      /* webpackChunkName: "lazyDemo" */
      /* webpackPrefetch: true */
      './Demo'
    ),
); // 使用import语法配合react的Lazy动态引入资源

export function LazyDemo() {
  return (
    <Suspense fallback={null}>
      <Demo />
    </Suspense>
  );
}
