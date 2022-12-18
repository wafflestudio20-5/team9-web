module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'plugin:import/recommended',
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'import'],
    rules: {
        'react/prop-types': 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'external',
                        position: 'before',
                    },
                    {
                        pattern: 'next',
                        group: 'external',
                    },
                ],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                'newlines-between': 'always',
            },
        ],
    },
    settings: {
        'import/parsers': { '@typescript-eslint/parser': ['.ts'] },
    },
};
