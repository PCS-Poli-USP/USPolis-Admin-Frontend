export interface ServerFilesTopic {
  id: string;
  title: string;
  note: string;
  paths: string[];
  tree: string;
}

export const serverFilesTopics: ServerFilesTopic[] = [
  {
    id: 'backend',
    title: 'Backend',
    note: 'Repositório da API, logs e serviço systemd.',
    paths: [
      '/diskb/home/backend',
      '/diskb/home/logs/api.log',
      '/diskb/home/logs/backend-error.log',
      '/diskb/home/logs/backend-script.log',
      '/etc/systemd/system/uspolis-backend.service',
      '/home/ubuntu/start_uspolis_back.sh',
    ],
    tree: `/
├── etc/systemd/system/uspolis-backend.service
├── diskb/home/
│   ├── backend
│   └── logs/
│       ├── api.log
│       ├── backend-error.log
│       └── backend-script.log
└── home/ubuntu/start_uspolis_back.sh`,
  },
  {
    id: 'backup',
    title: 'Backup',
    note: 'pgBackRest, rclone e script de backup diário/semestral.',
    paths: [
      '/etc/pgbackrest/pgbackrest.conf',
      '/diskb/pgbackrest/backup',
      '/diskb/pgbackrest/archive',
      '/home/ubuntu/uspolis_backup.sh',
      '/home/ubuntu/cron.log',
      '/var/lib/postgresql/.rclone/rclone.conf',
      '/var/lib/postgresql/logs/backup.log',
    ],
    tree: `/
├── etc/pgbackrest/pgbackrest.conf
├── diskb/pgbackrest/
│   ├── archive
│   └── backup
├── home/ubuntu/
│   ├── cron.log
│   └── uspolis_backup.sh
└── var/lib/postgresql/
    ├── .rclone/rclone.conf
    └── logs/backup.log`,
  },
  {
    id: 'frontend',
    title: 'Frontend & Docs',
    note: 'Build estático do frontend e da documentação pública.',
    paths: [
      '/diskb/home/frontend/build',
      '/etc/systemd/system/uspolis-frontend.service',
      '/home/ubuntu/start_uspolis_front.sh',
      '/var/www/html/docs',
    ],
    tree: `/
├── etc/systemd/system/uspolis-frontend.service
├── diskb/home/frontend/build
├── home/ubuntu/start_uspolis_front.sh
└── var/www/html/
    ├── index.html
    └── docs/…`,
  },
  {
    id: 'logs',
    title: 'Logs',
    note: 'cron.log deve estar sempre vazio — não vazio indica erro no backup.',
    paths: [
      '/diskb/home/logs/api.log',
      '/diskb/home/logs/backend-error.log',
      '/diskb/home/logs/docs.log',
      '/diskb/home/logs/frontend-script.log',
      '/home/ubuntu/cron.log',
      '/var/lib/postgresql/logs/backup.log',
    ],
    tree: `/
├── diskb/home/logs/
│   ├── api.log
│   ├── backend-error.log
│   ├── backend-script.log
│   ├── docs.log
│   └── frontend-script.log
├── home/ubuntu/cron.log
└── var/lib/postgresql/logs/backup.log`,
  },
  {
    id: 'services',
    title: 'Serviços (systemd)',
    note: 'Reiniciam automaticamente em caso de queda ou reboot.',
    paths: [
      '/etc/systemd/system/uspolis-backend.service',
      '/etc/systemd/system/uspolis-frontend.service',
      '/home/ubuntu/start_uspolis_back.sh',
      '/home/ubuntu/start_uspolis_front.sh',
    ],
    tree: `/
├── etc/systemd/system/
│   ├── uspolis-backend.service
│   └── uspolis-frontend.service
└── home/ubuntu/
    ├── start_uspolis_back.sh
    └── start_uspolis_front.sh`,
  },
];
