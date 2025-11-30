---
prev:
  text: 'Introdução'
  link: '/dev/server'
  
---


# Arquivos principais
**Usamos o site [Tree](https://tree.nathanfriend.com/) para gerar essas imagens**

A árvore de diretório com os principais arquivos do sistema está listado a seguir:

```bash
/
├── etc/
│   ├── pgbackrest/
│   │   └── pgbackrest.conf
│   └── systemd/
│       └── system/
│           ├── uspolis-backend.service
│           └── uspolis-frontend.service
├── diskb/
│   ├── home/
│   │   ├── backend
│   │   ├── frontend
│   │   └── logs/
│   │       ├── api.log
│   │       ├── backend-error.log
│   │       ├── backend-script.log
│   │       └── frontend-script.log
│   └── pgbackrest/
│       ├── archive
│       └── backup
├── home/
│   └── ubuntu/
│       ├── cron.log
│       ├── start_uspolis_back.sh
│       ├── start_uspolis_front.sh
│       └── uspolis_backup.sh
└── var/
    └── lib/
        └── postgresql/
            ├── .msmtprc
            ├── .rclone/
            │   └── rclone.conf
            └── logs/
                └── backup.log
```

## Backend

Aqui está a árvore com apenas os arquivos relevantes para o backend

```bash
/
├── etc/
│   └── systemd/
│       └── system/
│           └── uspolis-backend.service
├── diskb/
│   └── home/
│       ├── backend
│       └── logs/
│           ├── api.log
│           ├── backend-error.log
│           └── backend-script.log
└── home/
    └── ubuntu/
        └── start_uspolis_back.sh
```

Os arquivos do repositório do backend estão em:

```bash
/diskb/home/backend
```

Em relação aos logs, temos:
- ```/diskb/home/logs/api.log``` é o log da api em tempo real
- ```/diskb/home/logs/backend-error.log``` são os logs de erros, bom para debug
- ```/diskb/home/logs/backend-script.log``` são os logs do script que inicia o backend

Os demais arquivos tem haver com automações de deploy.

## Frontend

A árvore de arquivos filtrada para o frontend fica:
```bash
/
├── etc/
│   └── systemd/
│       └── system/
│           └── uspolis-frontend.service
├── diskb/
│   └── home/
│       └── frontend
└── home/
    └── ubuntu/
        └── start_uspolis_front.sh
```

Os arquivos do frontend **BUILDADOS** do frontend estão em:

```bash
/diskb/home/frontend/build
```

Não existe atualmente um log para o frontend, os demais arquivos tem haver com automações de deploy.

## Logs

A árvore de árquivos filtrada para os arquivos de log fica:
```bash
/
├── diskb/
│   └── home/
│       └── logs/
│           ├── api.log
│           ├── backend-error.log
│           ├── backend-script.log
│           └── frontend-script.log
├── home/
│   └── ubuntu/
│       └── cron.log
└── var/
    └── lib/
        └── postgresql/
            └── logs/
                └── backup.log
```

O arquivo ```/home/ubuntu/cron.log``` é o log do cron que diariamente executa os backups do banco de dados e semestralmente os backups completos. O esperado é que esse arquivo encontre-se vazio, caso contrário ele vai conter logs de **ERROS**.

Fora isso, outro log importante é o do backup:
```bash
/var/lib/postgresql/logs/backup.log
```

Nele está o log dos backups, caso algum erro chege por e-mail você pode ver o que aconteceu ali.

## Backup

Os arquivos relevantes para o backup são:
```bash
/
├── etc/
│   └── pgbackrest/
│       └── pgbackrest.conf
├── diskb/
│   └── pgbackrest/
│       ├── archive
│       └── backup
├── home/
│   └── ubuntu/
│       ├── cron.log
│       └── uspolis_backup.sh
└── var/
    └── lib/
        └── postgresql/
            ├── .msmtprc
            ├── .rclone/
            │   └── rclone.conf
            └── logs/
                └── backup.log
```

Os arquivos de backup em si ficam em:
```bash
/diskb/pgbackrest/backup
```

O script de backup fica em:
```bash
/home/ubuntu/uspolis_backup.sh
```

Os arquivos de configuração para o **Rclone** fica em:

```bash
/var/lib/postgresql/.rclone/rclone.conf
```

Os arquivos de configuração para o **Pgbackuprest** fica em:

```bash
/etc/pgbackrest/pgbackrest.conf
```

Os arquivos de configuração para o **msmtp** fica em:

```bash
/etc/pgbackrest/pgbackrest.conf
```

## Serviços

A árvore filtrada para serviços fica:

```bash
/
├── etc/
│   └── systemd/
│       └── system/
│           ├── uspolis-backend.service
│           └── uspolis-frontend.service
├── diskb/
│   └── home/
│       └── logs/
│           ├── backend-script.log
│           └── frontend-script.log
└── home/
    └── ubuntu/
        ├── start_uspolis_back.sh
        └── start_uspolis_front.sh
```

Os serviços ficam em:
- ```/etc/systemd/system/uspolis-backend.service```
- ```/etc/systemd/system/uspolis-frontend.service```

Eles chamam os scripts:

```bash
/home/ubuntu/start_uspolis_back.sh
```

```bash
/home/ubuntu/start_uspolis_front.sh
```
E os logs ficam conforme pode ser visto em [Logs](#logs)