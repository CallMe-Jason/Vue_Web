const asd = []
if(process.env.NODE_ENV === 'production'){
  asd.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...asd,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
