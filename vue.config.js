module.exports = {
  publicPath: './',
  chainWebpack: (config) => {
    //正式环境

    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'element-ui': 'ELEMENT',
        'vue-router': 'VueRouter',
        axios: 'axios',
        nprogress: 'NProgress',
        echarts: 'echarts',
        'vue-quill-editor': 'VueQuillEditor',
      })

      config.plugin('html').tap((args) => {
        args[0].isProd = true
        return args
      })
    })

    //开发环境
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap((args) => {
        args[0].isProd = false
        return args
      })
    })
  },
  lintOnSave: false, // 关闭语法检查
}
