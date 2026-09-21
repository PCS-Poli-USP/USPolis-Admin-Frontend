---
prev:
  text: 'Migrações'
  link: '/dev/database/migrations'
---

# Backup

## No seu ambiente de desenvolvimento

O repositório do backend não traz nenhum script genérico de backup/restore pronto para uso — o que existe em `server/scripts/dumps/` (`load_csv.py`, `fix_dump.py`, `filter.py`) são utilitários pontuais que foram escritos para migrações específicas de dados (importar um CSV de prédios/salas, corrigir sequences do Postgres depois de uma carga manual, converter um dump `.sql` antigo em CSV) — não têm CLI, as chamadas ficam comentadas no fim do próprio arquivo, e não devem ser usados como uma rotina de backup.

Para o dia a dia local, as ferramentas padrão do Postgres já resolvem bem:

```bash
# gerar um dump completo do seu banco de desenvolvimento
pg_dump -Fc -U <usuario> -d <DATABASE_NAME> -f backup.dump

# restaurar esse dump (em um banco vazio)
pg_restore -U <usuario> -d <DATABASE_NAME> --clean --if-exists backup.dump
```

Isso é útil, por exemplo, antes de rodar uma migração arriscada localmente, ou para compartilhar uma "fotografia" do seu banco de dev com outra pessoa do time.

## Em produção

O banco de produção roda com **[pgBackRest](https://pgbackrest.org/)**, que combina duas estratégias:

- **Archiving contínuo do WAL** (write-ahead log) — cada segmento de WAL gerado pelo Postgres é copiado para o repositório de backup assim que fechado, o que é o que permite restaurar o banco para qualquer ponto no tempo (point-in-time recovery), não só para o instante exato de um backup.
- **Backups completos (`full`) e incrementais (`incr`)**, disparados por um script (`uspolis_backup.sh`) que aceita `--type=full` ou `--type=incr` e chama `pgbackrest --stanza=main --type=<tipo> backup`. Depois de um backup bem-sucedido, o script compacta o repositório de backup (`tar.gz`) e sobe esse arquivo para uma conta do Google Drive via [`rclone`](https://rclone.org/), como cópia adicional fora do servidor. Em caso de falha em qualquer etapa (backup, compactação ou upload), o script envia um e-mail de alerta via `msmtp`.
- A retenção configurada (`repo1-retention-full=2`) mantém os **2 últimos backups completos** (e os incrementais/diferenciais associados a eles) no repositório do pgBackRest.

Para checar o estado atual dos backups (últimos full/incr, tamanho, período coberto pelo WAL):

```bash
sudo -u postgres pgbackrest info
```

> [!IMPORTANT]
> Isso roda numa stanza chamada `main`, configurada em `/etc/pgbackrest/pgbackrest.conf` no servidor de produção — esse arquivo não faz parte de nenhum dos dois repositórios do USPolis, é configuração do servidor em si. Se você for mexer na rotina de backup de produção, converse com quem administra o servidor antes.

### Restaurar um backup

Restaurar a partir do pgBackRest (visão geral — os detalhes exatos dependem de para onde você está restaurando):

```bash
# para o mesmo servidor (ex: recuperação de um erro):
sudo -u postgres pgbackrest --stanza=main restore

# para um ponto no tempo específico, em vez do backup mais recente:
sudo -u postgres pgbackrest --stanza=main --type=time --target="2026-01-15 10:00:00" restore
```

Isso deve ser feito com o Postgres parado, e é uma operação destrutiva sobre o diretório de dados — trate como último recurso, não como algo para testar em produção.
