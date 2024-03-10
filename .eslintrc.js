module.exports = {
  extends: [
    'alloy',
    'alloy/vue',
    // 'alloy/typescript',
    '@vue/typescript',
  ],
  env: {
    // 你的环境变量
  },
  globals: {},
  rules: {
    // 自定义你的规则
    'vue/component-tags-order': ['off'],
    'vue/no-multiple-template-root': ['off'],
    'max-params': ['off'],
    // 'no-undef': 'off', // 禁止使用未定义的变量，会把TS声明视为变量，暂时关闭
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true, // 配置允许注解
    },
  },
}
