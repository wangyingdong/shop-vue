// 项目发布阶段需要用到label插件 'transform-remove-console'
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [

    // 发布产品时候的插件数组
    ...prodPlugins, 
    '@babel/plugin-syntax-dynamic-import' //路由懒加载
  ]
}
