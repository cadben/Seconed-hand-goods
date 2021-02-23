const path = require('path');
const {name, version} = require('./package.json');

export default {
  entry: 'src/index.js',
  outputPath: 'build',
  publicPath: '/',
  html: {
    template: './src/index.ejs'
  },
  extraBabelPlugins: [
    ['import', {libraryName: 'antd', libraryDirectory: 'es', style: true }]
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr']
    }
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    '@': path.resolve(__dirname, 'src/'),
  },
  proxy: {
    '/nodeapi': {
      target: 'http://127.0.0.1:7002/',
      changeOrigin: true,
    }
  },
};