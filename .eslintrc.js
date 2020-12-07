module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    // 'space-before-blocks': 0,
    // 'key-spacing': 0,
    // 'space-before-function-paren': 0,
    // 'no-multiple-empty-lines': 0,
    // 'eol-last': 0,
    // 'indent': 0,
    // 'no-trailing-spaces': 0,
    // 'semi': 0
  }
}
