module.exports = {
  root: true,
  extends: ['@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'jsx-quotes': [2, 'prefer-single'],
        'no-extra-parens': 'functions',
        'react/jsx-wrap-multilines': [
          'error',
          {
            "declaration": "parens",
            "assignment": "parens",
            "return": "parens-new-line",
            "arrow": "parens",
            "condition": "ignore",
            "logical": "ignore",
            "prop": "ignore"
          },
        ],
      },
    },
  ],
};
