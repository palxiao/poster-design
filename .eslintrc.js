/*
 * @Author: ShawnPhang
 * @Date: 2021-07-13 18:46:45
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-07-30 14:11:34
 */
module.exports = {
  extends: [
    'alloy',
    'alloy/vue',
    // 'alloy/typescript',
    '@vue/typescript',
  ],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    // 自定义你的规则
    'vue/component-tags-order': ['off'],
    'vue/no-multiple-template-root': ['off'],
    // 'no-undef': 'off', // 禁止使用未定义的变量，会把TS声明视为变量，暂时关闭
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true, // 配置允许注解
    },
  },
}
