---
prev:
  text: 'Arquivos principais'
  link: '/dev/server/files'
---

# Deploy

Aqui vamos explicar como funciona o nosso processo de [CI/CD](https://www.redhat.com/pt-br/topics/devops/what-is-ci-cd) e como fazer um deploy manual.

## CI/CD com GitHub Actions

Utilizamos o [GitHub Actions](https://github.com/features/actions), uma plataforma de CI/CD integrada diretamente ao GitHub, que nos permite fazer automações de workflows de desenvolvimento de software.

Para acessar o arquivo de CI/CD nosso siga:

```bash
/
└── .github/
    └── workflows/
        └── ci_cd.yml
```

Esse arquivo é divido em três seções:

- `name`
- `on`
- `jobs`

Conforme pode ser visto a seguir, na esquerda é o arquivo do backend, na direita o do frontend.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image3.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

A seção `name` é apenas para definir o nome do workflow, a seção `on` serve para definir quando o workflow será executado, nesse caso é quando ocorre um push na branch main. Por último, existe a seção `jobs` onde os trabalhos serão feitos.

Note que cada repositório tem o seu `ci_cd.yml`, que mudam basicamente nas etapas do `jobs`, o backend tem dois jobs `ci` e `cd`, enquanto o frontend tem apenas um trabalho chamado `deploy`. Antes de descrever eles, vamos ensinar a como adicionar/configurar secrets e variáveis para o deploy.

### Secrets e variáveis

Se você olhar nos arquivos vai encontrar algo do tipo:

```bash
host: ${{ secrets.SSH_HOST }}
```

Isso serve para definir o host que será utilizado para executar os comandos ssh, como é uma informação sensível ela não fica diretamente no arquivo yml, o mesmo ocorre para fazer o build do frontend e definir os envs dele.

Para definir esses valores, configuramos no próprio repositório no github, para definir essas variáveis vá em `Settings`:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Depois em `Secrets and variables`e adicione ou altere os valores:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image2.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

### Backend

No backend existe dois trabalhos, o ci:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image4.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Que tem um nome, um ambiente onde ele irá rodar (ubuntu) e etapas, basicamente ele faz um checkout para ter os arquivos mais atuais, e cria um ambiente com python 3.12.

O segundo e último trabalho é o cd:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image5.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

A primeira etapa é um checkout do repositório, em seguida é uma ação que executa em ssh, ela basicamente se conecta no servidor e executa um script que faz:

- Vai até o diretório do backend
- Faz um git pull da main
- Reinicia o serviço do backend
- Executa um echo para confirmar que tudo deu certo

A última etapa é apenas um comando para notificar que tudo terminou corretamente.

### Frontend

No frontend existe apenas uma seção `deploy`, que é bem maior que a do backend:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image6.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Nessa primeira parte, fazemos:

- Um checkout
- Configuramos o ambiente para fazer o build, no caso node 20 com yarn
- Instalamos as dependências
- Fazer o build da docs
- Movemos a docs buildada para a pasta `public/docs`
- Buildamos o frontend usando `yarn build` e definimos o env.
- Limpamos (**NO SERVIDOR**) a docs antiga

E a continuação:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image7.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Que basicamente faz:

- Limpa a build antiga do frontend (**NO SERVIDOR**)
- Enviamos os arquivos buildados para o servidor
- Enviamos os arquivos da docs buildados (que estavam na pasta `public/docs` do frontend) para a pasta correta no **SERVIDOR**
- Reiniciamos o frontend para usar os novos arquivos

> [!IMPORTANT]
> Note que algumas etapas apagam arquivos no servidor, se por algum motivo o CI/CD falhar em uma etapa após remover arquivos e antes de mover os arquivos buildados,
> vai ser necessário enviar os arquivos buildados manualmente, tenha isso em mente!

## Como fazer um deploy manual?

Antes de explicar como fazer um deploy propriamente dito, vamos mostrar os arquivos relevantes para o deploy, explicar como funcionam nossos serviços que executam o backend e o frontend, os scrips que usamos para executar e servir o backend e frontend.

Aí sim você terá tudo que precisa saber para fazer um deploy completo e limpo.

### Arquivos relevantes

Para uma explicação detalhada acesse [Arquivos principais](/dev/server/files/).

Aqui a árvore de arquivos relevantes:

```bash
/
├── etc/
│   ├── nginx/
│   │   └── sites-available/
│   │       └── default
│   └── systemd/
│       └── system/
│           ├── uspolis-backend.service
│           └── uspolis-frontend.service
├── diskb/
│   └── home/
│       ├── backend
│       ├── frontend
│       └── logs/
│           ├── api.log
│           ├── backend-error.log
│           ├── backend-script.log
│           ├── docs.log
│           └── frontend-script.log
├── home/
│   └── ubuntu/
│       ├── start_uspolis_back.sh
│       └── start_uspolis_front.sh
└── var/
    └── www/
        └── html/
            ├── index.html
            ├── docs/
            │   └── ...
            └── ...
```

Destacamos:

- `/diskb/home/backend/`arquivos do backend (a branch main)
- `/diskb/home/frontend/build`arquivos do frontend buildados
- `/var/www/html/docs`arquivos da docs buildados
- `/home/ubuntu/start_uspolis_back.sh` script para iniciar o backend
- `/home/ubuntu/start_uspolis_front.sh` script para iniciar o frontend

### Serviços

Os nossos dois serviços são:

- `/etc/systemd/system/uspolis-backend.service` serviço do backend
- `/etc/systemd/system/uspolis-frontend.service` serviço do frontend

Esses dois serviços basicamente executam nossos scripts de start, uma vantagem é que se a máquina reiniciar ou cair por algum motivo, esses serviços automaticamente irão iniciar o USPolis, além disso, eles tem uma lógica de restart caso de algum problema.

### Scripts

Nessa seção vamos descrever os scripts

#### Script para o Backend

A seguir, o script do backend:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image8.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Ele basicamente faz:

- Checa se o diretório do backend existe
- Atualiza as dependências
- Executa as migrações do banco de dados
- Mata a porta onde o backend irá rodar caso esteja ocupada
- Inicia o backend com gunicorn, workers e logs

Note que atualizamos as dependências aqui, por isso no CD não é necessário fazer nada além de dar pull na main e rodar ele.

#### Script para o Frontend

A seguir, o script do frontend:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/server/deploy/images/image9.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Ele basicamente faz:

- Checa se o diretório do frontend existe
- Mata a porta onde o frontend irá rodar caso esteja ocupada
- Serve os arquivos buildados (`/diskb/home/frontend/build`)

### Enviando arquivos para o servidor

Para enviar os arquivos da sua máquina para o servidor use [scp](https://www.w3schools.com/bash/bash_scp.php). No caso, isso é necessário apenas para o frontend, você tem que fazer o mesmo processo que é feito no CI/CD do frontend, ou seja:

- Buildar a docs usando `yarn docs:build`
- Mover os arquivos buildados de `docs/.vitepress/dist` para ```public/docs
- Buildar o frontend com `yarn build`
- Enviar os arquivos para o servidor com scp `scp -P <porta> -r ./build/ ubuntu@<ip>:/diskb/home/frontend`
- Mover os arquivos de `/diskb/home/frontend/build/docs` para `/var/www/html/docs`

> [!TIP]
> Use os comandos que estão no arquivo de CI/CD.

### Finalizando o deploy

Após enviar os arquivos do frontend buildados e os arquivos da docs no lugar correto, basta reiniciar os serviços, que por sua vez vão executar os scripts, para isso faça:

- `sudo systemctl restart uspolis-backend.service`
- `sudo systemctl restart uspolis-frontend.service`

Pronto, agora o USPolis foi subido corretamente!

> [!TIP]
> Acompanhe os logs para ver se tudo está funcionando corretamente
