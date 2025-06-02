# USPolis Frontend
[![Static Badge](https://img.shields.io/badge/Node-1eeb25)](https://nodejs.org/pt)
[![Static Badge](https://img.shields.io/badge/Typescript-035afc)](https://www.typescriptlang.org/)
[![Static Badge](https://img.shields.io/badge/React-408080)](https://react.dev/)
https://img.shields.io/badge/Prettier-4f2f03

[![Static Badge](https://img.shields.io/badge/Chackra-v2-408080)](https://v2.chakra-ui.com/)
[![Static Badge](https://img.shields.io/badge/Vite-961eeb)](https://vite.dev/)
[![Static Badge](https://img.shields.io/badge/Yarn-291eeb)](https://yarnpkg.com/)
[![Static Badge](https://img.shields.io/badge/Testing%20Library-a10303)](https://testing-library.com/docs/)
[![Static Badge](https://img.shields.io/badge/ESLint-24034f)](https://eslint.org/)
[![Static Badge](https://img.shields.io/badge/Prettier-4f2f03)](https://prettier.io/docs/)


![USPolis-removebg-preview](https://github.com/user-attachments/assets/c19e3ce9-646c-4404-926c-4115c4a5a0b8)


## Table of Contents
1. [Stack](#stack)
2. [Docs](#docs)
3. [Setup](#setup)
4. [Run and Build](#run-and-build)
5. [Develop](#develop)
6. [Test](#test)

## Stack
Here we have the main tecnologies used on frontend:
- [Typescript](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on JavaScript.
- [React](https://fastapi.tiangolo.com/) - Javascript front-end library.
- [Chakra-UI](https://v2.chakra-ui.com/) - A React component library (**version 2**).
- [Yarn](https://yarnpkg.com/) - A package manager for javascript projects
- [Vite](https://vite.dev/) - A fast frontend build tool

We also uses other tools for development, check the [develop](#develop) section.

## Docs

You can see a complete documentation at [USPolis-Admin Wiki](https://github.com/PCS-Poli-USP/USPolis-Admin/wiki), there you will find the architecture, models, design patterns, bussiness rules, descriptions and more.

## Setup

This codebase was written for Node.js 20 and above.

First make sure that you have [Yarn](https://yarnpkg.com/getting-started/install) installed.

After installing yarn now we will install the dependencies
```bash
yarn install
```

There are enviroment variables that must be setted, you can see a example of `.env` file at `env.example` on the root folder. 

Assuming you've created and setted the '.env' file, everything should run as if there is a [API or backend](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/tree/main) running (see the [docs](https://github.com/PCS-Poli-USP/USPolis-Admin/wiki) for a complete step by step to how set the enviroment).

## Run and Build

This project uses [Vite](https://vite.dev/) as building tool, for running the website do:

```bash
yarn vite
```

Your website will be available at http://localhost:3000

If you want to build the static files to serve it, run:
```bash
yarn build
```

The static files will be avaliable at folder `build` on the root of the project. To serve the static files run this command:

```bash
npx serve -s build
```

The flag -s is important since our project is a [SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA).

## Develop

Since Vite is just a speed building tool, it not check syntax errors, so if you made a mistake your website will be a blank white page and you will be in trouble to find were is the problem.

So, for making Vite viable we uses [Eslint](https://eslint.org/) for analyzing our code, actually we uses the [Typescript-Eslint](https://typescript-eslint.io/) library to enable eslint and prettier to support Typescript.

You can change the typescript-eslint rules (make more strict or less strict) at `eslint.config.mjs` file, you can read all rules [here](https://typescript-eslint.io/rules/).

To run eslint do:
```bash
yarn lint
```
***The project actually have vite-eslint plugin that automatically shows on terminal were is the erros or warnings, so you not need to run this command**

For code formatting we uses [Prettier](https://prettier.io/docs/), the config file is `.prettierrc.js`.

To run prettier do:
```bash
yarn format
```

> [!TIP]
> If you use VSCode we strongly recommends install [Prittier-VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension. This will save your time, showing errors on editor and running prettier on after save the file.

## Test

We are working on a test enviroment for frontend, but the project already has [Testing Library](https://testing-library.com/docs/) as a dependency.
