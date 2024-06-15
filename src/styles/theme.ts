// theme.js
import * as themeVar from './themeVar';
import cssVars from 'css-vars-ponyfill';

type Themes = keyof typeof themeVar;

export const initTheme = (theme: Themes) => {
  document.documentElement.setAttribute('data-theme', theme);

  cssVars({
    watch: true, // 当添加，删除或修改其<link>或<style>元素的禁用或href属性时，ponyfill将自行调用
    variables: themeVar[theme], // variables 自定义属性名/值对的集合
    onlyLegacy: true, // false  默认将css变量编译为老浏览器识别的css样式  true 当浏览器不支持css变量的时候将css变量时，编译为老浏览器识别的css样式
  });
};
