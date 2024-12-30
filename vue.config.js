const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 去除Vue打包后js目录下生成的一些.map文件，用于加速生产环境构建。
  productionSourceMap: false,
  // 去除Vue打包后.css和.js文件名称中8位hash值，跟缓存有关；一般为true就行。
  filenameHashing:false
})
