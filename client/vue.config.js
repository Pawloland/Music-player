const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    output: {
      filename: 'assets/[name]-[chunkhash].js'
    }
  },
  css: {
    extract: {
      filename: 'assets/[name]-[contenthash].css',
      chunkFilename: 'assets/[name]-[contenthash].css',
    },
  },
  filenameHashing: false,
  productionSourceMap: false,
})
