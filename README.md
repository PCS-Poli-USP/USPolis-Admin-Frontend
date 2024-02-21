# USPolis - Admin Frontend

Frontend administrativo do sistema USPolis - gerenciamento da alocação de turmas da EPUSP.

## Dependências

### `nodejs`

nodejs v18.14.0
npm v9.3.1

## Configuração

### `.env`

Configurar .env com base no arquivo env-example na raiz do projeto

### `npm install`

Instalar as dependências do projeto

## Execução

### `npm start`

Executa o projeto em modo de desenvolvimento (http://localhost:3000)

### `npm run build`

Cria uma build otimizada para produção na pasta build

Documentação para [deploys](https://create-react-app.dev/docs/deployment/)

## Documentation

### Architecture

This repo follows an architecture very similar to the traditional react.

Some things that are not obvious and are worth noting:

- The landing page is on ```App.tsx```

#### Pages

This is where the main code of your page is on. Ideally, it will only be an architectural description of the page, connecting different components previously developed, aside from *handle functions*.

#### Components

Inside this directory we can find the ```common``` components, which are generic and used by different pages, and the specific components from each page.

#### Services

This is where **all the backend integration code** are centered. Basically, a service consists of classes that handles the backend communication.

The services uses the models for interfacing.

#### Models

Here we have the definitions of the interfaces that need to be sended or received from the backend, aside from eventually some usefull entity that need to be present on lots of pages of the frontend application.