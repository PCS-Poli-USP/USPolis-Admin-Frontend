import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

// Função que transforma "error" → "warn"
function downgradeErrors(config) {
  if (!config.rules) return config;

  const newRules = {};
  for (const [key, value] of Object.entries(config.rules)) {
    if (value === 'error' || value === 2) {
      newRules[key] = 'warn';
    } else if (Array.isArray(value) && (value[0] === 'error' || value[0] === 2)) {
      newRules[key] = ['warn', ...value.slice(1)];
    } else {
      newRules[key] = value;
    }
  }

  return { ...config, rules: newRules };
}

const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];

// AQUI convertemos todos os errors → warnings
export default baseConfig.map(downgradeErrors);
