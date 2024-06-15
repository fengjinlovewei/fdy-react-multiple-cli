/**
 *
 * 当进行打包优化的时候,肯定要先知道打包时间都花费在哪些步骤上了,
 * 而speed-measure-webpack-plugin插件可以帮我们做到
 *
 */

const { merge } = require('webpack-merge'); // 引入合并webpack配置方法

const prodConfig = require('./webpack.prod.js'); // 引入打包配置

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 引入分析打包结果插件
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 引入webpack打包速度分析插件
const smp = new SpeedMeasurePlugin(); // 实例化分析插件

// 使用smp.wrap方法,把生产环境配置传进去,由于后面可能会加分析配置,所以先留出合并空位
module.exports = smp.wrap(
  merge(prodConfig, {
    plugins: [
      new BundleAnalyzerPlugin(), // 配置分析打包结果插件
    ],
  }),
);
