const { DllPlugin, DefinePlugin } = require('webpack');
const { dll } = require('./common');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    core: ['react', 'react-dom', 'prop-types'],
  },
  output: {
    path: dll.core.path,
    filename: dll.core.filename,
    library: dll.core.name,
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
  },
  plugins: [
    new DllPlugin({
      path: dll.core.manifest,
      context: dll.core.context, // 这个配置和 webpack.DefinePlugin 设置变量有关
      name: dll.core.name,
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    minimize: true,
  },
};
