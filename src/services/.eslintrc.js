module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'plugin:@typescript-eslint/recommended',  // Use recommended rules from @typescript-eslint/eslint-plugin
        'plugin:react/recommended'   // Use recommended rules from eslint-plugin-react
    ],
    parserOptions: {
        ecmaVersion: 2020,  // Allows the use of ES11 features
        sourceType: 'module', // Allows the use of import statements
        ecmaFeatures: {
            jsx: true,  // Allows ESLint to parse JSX
        }
    },
    rules: {
        // Add custom rules here, for example:
        'react/react-in-jsx-scope': 'off', // No need to import React into JSX when using newer versions of React
        '@typescript-eslint/explicit-module-boundary-types': 'off'  // Does not enforce explicit types for exported functions and classes
    },
    settings: {
        react: {
            version: 'detect',  // Automatically detect the installed version of React
        },
    },
};
