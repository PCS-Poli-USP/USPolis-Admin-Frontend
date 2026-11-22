---
prev:
  text: 'Logs, Grafana e Loki'
  link: '/dev/observability'
---

# Busca geral

A página **Busque no USPolis** (`/public/search`) é uma busca de campo único: a pessoa digita qualquer coisa ("cálculo", "MAC0110", "B2-04", "Biênio", "monitoria", o nome de um professor) e recebe tudo o que o USPolis tem de público sobre aquilo, agrupado por tipo, com um **resultado em destaque** e os itens ligados a ele.

Esta página explica como isso funciona: que técnicas são usadas, a teoria por trás de cada uma e onde está cada peça no código. Não há nenhum modelo de IA envolvido: tudo roda no PostgreSQL que o USPolis já usa, com extensões que vêm na instalação padrão.

## Resumo em uma tabela

| Problema | Técnica | Onde |
|---|---|---|
| "Cálculo", "calculo" e "cálculos" devem ser a mesma coisa | Normalização: minúsculas, remoção de acentos (`unaccent`) e **radicalização** (*stemming*) em português | config de busca `pt_unaccent` |
| Achar rápido os documentos que contêm um termo, entre milhares | **Índice invertido** (índice GIN sobre `tsvector`) | `ix_search_document_tsv` |
| Ordenar pelo que é mais relevante | **Ranking por densidade de cobertura** (`ts_rank_cd`) com pesos por campo | `SearchRepository.search` |
| Erros de digitação ("calclo") e nomes pela metade | **Similaridade por trigramas** (`pg_trgm`) | `ix_search_document_search_text_trgm` |
| Mostrar resultados enquanto a pessoa digita | **Busca por prefixo** no último termo (`termo:*`) | `build_prefix_tsquery` |
| "Professor → disciplinas → turmas → salas" | **Grafo** guardado como lista de adjacência (coluna `edges`) | `SearchRepository.related` |
| Desempatar: uma sala muito usada vem antes de uma pouco usada | **Importância estática** (centralidade de grau) | coluna `prior` |
| Preferir o que está acontecendo agora | **Peso temporal** | `_TIME_BOOST` |

## Por que não embeddings, Mongo ou banco de grafos

A primeira ideia para uma "busca estilo Google" costuma ser **busca semântica**: transformar cada texto num vetor com um modelo de linguagem (*embedding*) e procurar os vetores mais próximos do vetor da consulta. Ela é boa para sinônimos e paráfrases ("lugar para estudar" achar "sala de estudos"), mas **erra justamente no que mais se busca aqui**: nomes próprios, códigos de disciplina, nomes de sala. Um embedding não sabe que "PCS3111" e "PCS3112" são coisas totalmente diferentes, nem que "B2-04" é uma sala. Além disso, exige rodar um modelo (CPU ou GPU) a cada consulta e a cada atualização.

- **Mongo** não traria nada a mais: a busca textual dele é mais limitada que a do PostgreSQL e ainda obrigaria a sincronizar duas bases.
- **Banco de grafos** só compensaria para travessias longas e arbitrárias. Aqui a navegação é de 1 salto (professor → turmas, sala → reservas), o que o PostgreSQL resolve com um índice.

Volume também importa: o índice inteiro tem cerca de **5,2 mil documentos**, e uma consulta leva em torno de **2 ms**. Não há problema de escala a resolver.

A busca semântica continua como possibilidade futura (ver [Próximos passos](#proximos-passos)), combinada com esta, se os registros de buscas sem resultado mostrarem que vale a pena.

## A teoria, peça por peça

### 1. Documentos e consulta

Em recuperação de informação, o que se busca são **documentos**, e o que a pessoa digita é a **consulta**. Aqui, cada entidade pública vira um documento com um título, um texto pesquisável e alguns metadados:

| Tipo | Quantidade | Exemplo de título |
|---|---|---|
| Turma | 2.223 | PCS3111 · Turma 2026202 |
| Evento (reserva) | 1.186 | Monitoria de PME0101 |
| Disciplina | 777 | MAC0110 - Introdução à Computação |
| Professor | 596 | Marcelo Augusto Leal Alves |
| Prova (reserva) | 265 | PME3100 - Prova P3 |
| Sala | 143 | B2-04 |
| Reunião de monitoria (reserva) | 37 | Monitoria de Física 2 |
| Prédio | 11 | Biênio |

Os números são do banco de desenvolvimento em novembro de 2026.

Professor **não é uma tabela**: ele existe só como nome nos campos `professors` de turmas e disciplinas. A busca cria um documento "virtual" por nome normalizado, removendo o prefixo `(R)` que o crawler usa para o responsável. Assim, `(R) João Silva` e `João Silva` viram a mesma pessoa.

### 2. Normalização: tokens, acentos e radicais

Antes de comparar textos, os dois lados (documento e consulta) passam pelo mesmo processamento:

1. **Tokenização**: o texto é quebrado em palavras (*tokens*).
2. **Minúsculas e remoção de acentos**: a extensão `unaccent` troca "ã" por "a", "é" por "e", e assim por diante. Ela também corrige acentos corrompidos pelo crawler, como "Jordăo".
3. **Palavras vazias** (*stopwords*): "de", "da", "e", "para" são descartadas, porque aparecem em quase tudo e não ajudam a distinguir.
4. **Radicalização** (*stemming*): cada palavra é reduzida ao seu radical com o algoritmo **Snowball para português**. Ele corta sufixos de plural, gênero e derivação, então variações da mesma palavra viram o mesmo token.

Exemplo real do banco:

```
to_tsvector('pt_unaccent', 'Cálculos Diferenciais da Computação de João')
→ 'calcul':1  'diferenc':2  'computaca':4  'joa':6
```

"Cálculos" e "Cálculo" viram `calcul`; "da" e "de" sumiram; os números são as posições das palavras, usadas no ranking. A configuração `pt_unaccent` é a configuração `portuguese` do PostgreSQL com o `unaccent` aplicado antes do radicalizador (está na migration `5c8e1f2a9b47`).

::: warning Efeito colateral do radical
"Monitoria" e "Monitoramento" têm o mesmo radical (`monitor`). Por isso a busca por "monitoria" também traz a disciplina "Sistemas de Automação para **Monitoramento**…". Ela aparece por último, porque o título dela é pouco parecido com a consulta (ver o ranking abaixo).
:::

### 3. Índice invertido

Comparar a consulta com cada documento, um por um, não escala. A estrutura clássica para isso é o **índice invertido**: em vez de "documento → palavras", guarda-se "palavra → lista de documentos que a contêm", como o índice remissivo no fim de um livro.

```
calcul   → [subject:12, subject:13, class:880, class:881, ...]
monitor  → [reservation:2101, reservation:2140, subject:540, ...]
```

Para responder "calculo diferencial", o banco pega a lista de `calcul`, a lista de `diferenc` e faz a interseção. No PostgreSQL esse índice é um **GIN** (*Generalized Inverted Index*) sobre a coluna `tsv` (do tipo `tsvector`).

Cada documento tem os campos separados por **peso**, para o ranking saber onde a palavra apareceu:

| Peso | Valor | Campos |
|---|---|---|
| A | 1,0 | código e nome (disciplina, sala, prédio, professor), título da reserva |
| B | 0,4 | professores, prédio, disciplinas citadas |
| C | 0,2 | salas, observação da sala |
| D | 0,1 | (não usado) |

### 4. Ranking por densidade de cobertura

Achar os documentos é metade do trabalho; a outra metade é **ordenar**. O PostgreSQL oferece duas funções: `ts_rank` (conta ocorrências) e `ts_rank_cd`, que é a usada aqui.

`ts_rank_cd` implementa o ranking por **densidade de cobertura** (*cover density ranking*, Clarke, Cormack e Tudhope, 2000). Uma **cobertura** é o menor trecho do documento que contém todos os termos da consulta. A ideia é que um documento é mais relevante quando:

- contém **todos** os termos da consulta;
- os termos aparecem **próximos** uns dos outros (coberturas curtas);
- isso acontece **mais vezes**;
- e em campos de **peso maior**.

Para a consulta "calculo integral", o título "Cálculo Diferencial e **Integral** II" tem uma cobertura de 3 palavras; um texto em que "cálculo" está no título e "integral" só numa observação longa tem uma cobertura muito maior, e por isso pontua menos.

Usamos a normalização `32` da função, que transforma o valor em `rank / (rank + 1)`. Assim o resultado fica sempre entre 0 e 1 e pode ser somado com os outros componentes do score.

::: tip Relação com TF-IDF
O modelo clássico de recuperação de informação é o **modelo vetorial** com pesos **TF-IDF**: cada documento é um vetor esparso de termos, ponderado pela frequência do termo no documento (TF) e pela raridade dele na coleção (IDF), e a relevância é o cosseno entre o vetor da consulta e o do documento. O `ts_rank_cd` segue a mesma família de ideias (frequência, posição e peso dos termos), mas **não usa IDF**: ele olha cada documento isoladamente. Numa coleção pequena e de textos curtos como esta, a diferença é pequena, e a proximidade entre os termos importa mais.
:::

### 5. Trigramas: tolerância a erro de digitação

O índice invertido só acha palavras que existem. Se a pessoa digita "calclo", não há token `calclo` em lugar nenhum. Para isso usamos a extensão **`pg_trgm`**.

Um **trigrama** é uma sequência de 3 caracteres. O `pg_trgm` quebra cada palavra em trigramas, colocando dois espaços antes e um depois:

```
show_trgm('calclo')  → {"  c", " ca", cal, alc, lcl, clo, "lo "}       7 trigramas
show_trgm('calculo') → {"  c", " ca", cal, alc, lcu, cul, ulo, "lo "}  8 trigramas
```

A **similaridade** entre duas palavras é o **índice de Jaccard** dos conjuntos de trigramas: tamanho da interseção dividido pelo tamanho da união.

```
interseção = {"  c", " ca", cal, alc, "lo "}  → 5
união      = 7 + 8 − 5                       → 10
similarity('calclo', 'calculo') = 5 / 10 = 0,5
```

Como o texto do documento tem várias palavras, usamos **`word_similarity`**: a maior similaridade entre os trigramas da consulta e qualquer trecho contínuo do texto. Para "calclo" contra "mat2454 calculo diferencial e integral ii", o valor é 0,57. Um documento entra no resultado por trigramas quando `word_similarity` ≥ **0,45** (o padrão do PostgreSQL, 0,6, é exigente demais para erros comuns).

O índice GIN com `gin_trgm_ops` sobre a coluna `search_text` é um índice invertido de trigramas: ele encontra rapidamente os candidatos que compartilham trigramas com a consulta, sem comparar com todos os documentos.

### 6. Busca enquanto digita (prefixo)

Quando a pessoa digitou "calc", ainda não há palavra inteira. Por isso a consulta é montada com **prefixo no último termo**: "calculo dif" vira `calculo & dif:*`, ou seja, documentos com `calcul` **e** algum termo que comece com `dif`.

A montagem é feita em `build_prefix_tsquery` (`server/repositories/search_repository.py`). Ela mantém só caracteres `[a-z0-9]`, então nada que a pessoa digite pode virar um operador da linguagem de consulta do PostgreSQL.

### 7. O score final

Um documento entra no resultado se casar pelo índice invertido **ou** pelos trigramas. Depois, recebe um score que soma vários sinais:

```
score = 1,0 × ts_rank_cd(tsv, consulta)                    casamento lexical (0 a 1)
      + 0,5 × word_similarity(consulta, título)            quanto o TÍTULO se parece com a consulta
      + 0,2 × word_similarity(consulta, texto completo)    erros e casamentos parciais em qualquer campo
      + 1,0 se a consulta é exatamente um código ou nome   "MAC0110", "B2-04", "Biênio" vão para o topo
      + 0 a 0,3 pelo tempo                                 acontecendo agora > em breve > sem data > passado
      + 0,2 × importância (prior)                          desempate estrutural (ver abaixo)
```

O termo do **título** existe para resolver um caso concreto: ao buscar "marcelo alves", a disciplina que lista esse professor e o próprio professor casam igualmente no índice invertido; o título decide. Valores reais:

| Componente | Professor "Marcelo Augusto Leal Alves" | Disciplina "PME0120 - Expressão Gráfica…" |
|---|---|---|
| Casamento lexical | 0,250 | 0,250 |
| Similaridade com o título (×0,5) | 0,321 | 0,036 |
| Similaridade com o texto (×0,2) | 0,129 | 0,175 |
| Código/nome exato | 0 | 0 |
| Tempo | 0,3 | 0,3 |
| Importância (×0,2) | 0,198 | 0,102 |
| **Total** | **1,198** | **0,863** |

Os pesos foram ajustados com um conjunto de buscas de referência (sem acento, com erro, código exato, sala, prédio, nome parcial de professor), que viraram testes automatizados em `tests/api/public/test_search_routes.py`.

### 8. O grafo de entidades

As entidades do USPolis formam naturalmente um **grafo**: os **nós** são disciplinas, turmas, salas, prédios, professores e reservas, e as **arestas** são as relações entre eles. Cada documento guarda as arestas que saem dele numa coluna `edges`, que é uma **lista de adjacência**:

```
class:880        → [subject:12, professor:joao-da-silva, classroom:17, building:1]
subject:12       → [professor:joao-da-silva]
classroom:17     → [building:1]
professor:joao…  → [subject:12, subject:40]
reservation:2101 → [subject:12, classroom:17, building:1]
```

As arestas de reserva para disciplina vêm da prova (`exam.subject_id`) ou de um **código citado no título**: "Monitoria PEA3306" liga a monitoria à disciplina PEA3306.

Para montar o painel de destaque, o backend percorre **1 salto nas duas direções** a partir do melhor resultado:

- **arestas que saem**: os `doc_key` que estão em `edges` do resultado (de uma turma: a disciplina, os professores, a sala, o prédio);
- **arestas que chegam**: os documentos que têm o resultado nas suas `edges` (de uma sala: as turmas e reservas que acontecem nela). Isso usa o operador `@>` ("o array contém") com um índice GIN sobre `edges`, então também é uma busca num índice invertido.

Os relacionados são ordenados pelo tempo (o que está acontecendo primeiro), depois pela importância.

Cada documento é identificado por `doc_key = "<tipo>:<id>"` (reservas usam `reservation:<id>`), porque o id sozinho não é único: cada tabela tem sua própria sequência, e a turma 123 e a disciplina 123 existem ao mesmo tempo.

### 9. Importância (prior) e PageRank

O ranking acima mede **o quanto um documento combina com a consulta**. Existe uma segunda pergunta, independente da consulta: **o quanto esse documento é importante**. Em teoria de grafos, isso é **centralidade**.

Hoje usamos a forma mais simples, a **centralidade de grau**: quantas ligações o nó tem (quantas turmas uma disciplina tem, quantos horários uma sala recebe, quantas turmas um professor dá). Ela é normalizada em escala logarítmica dentro de cada tipo, para ficar entre 0 e 1:

```
prior = ln(1 + grau) / ln(1 + maior grau do mesmo tipo)
```

O logaritmo evita que um nó com o dobro de ligações valha o dobro: a diferença entre 1 e 10 turmas importa mais que entre 50 e 60.

O **PageRank** (Brin e Page, 1998) é uma centralidade mais sofisticada: um nó é importante se nós importantes apontam para ele. Ele é calculado por **iteração de potência** sobre a matriz de adjacência do grafo:

```
PR(v) = (1 − d) / N  +  d × Σ PR(u) / grau_de_saída(u)     para cada u que aponta para v
```

com `d ≈ 0,85` (fator de amortecimento) e `N` o número de nós, repetindo até os valores pararem de mudar. É álgebra linear pura (o vetor de PageRank é o autovetor principal de uma matriz estocástica), sem IA. Ele pode substituir o grau no `prior`, calculado num job periódico com `scipy.sparse`.

::: info PageRank não é busca
O PageRank não sabe nada sobre a consulta: ele só ordena nós por importância estrutural. Por isso ele entra como **um** dos componentes do score (com peso pequeno), nunca como o critério de relevância.
:::

### 10. Peso temporal

Para turmas, professores e disciplinas, a referência é o período (início e fim das turmas); para reservas, as datas reais das ocorrências. O peso é 0,3 para o que está em andamento, 0,2 para o que ainda vai começar, 0,15 para o que não tem data (salas, prédios) e 0 para o que já acabou. Assim, a monitoria deste semestre aparece antes da do ano passado.

## Implementação

### Visão geral

```
PostgreSQL                                Backend (FastAPI)                     Frontend
─────────────────────────────────────     ──────────────────────────────────    ──────────────────────────────
tabelas (subject, class, reservation…)    GET /search?q=…                       search/index.tsx
        │  REFRESH a cada 10 min            SearchRepository.search               useGeneralSearch (300 ms de
        ▼                                   SearchRepository.related                debounce, cancela a anterior)
materialized view search_document ─────►  GET /search/documents/{doc_key}  ──►  SearchTopPanel / SearchResultItem
  + índices GIN (tsv, trigramas, edges)     SearchRepository.get_by_doc_key       estado na URL (?q=&type=&focus=)
```

### O índice: `search_document`

É uma **materialized view**: uma consulta cujo resultado fica gravado como uma tabela e é recalculado periodicamente. Ela é criada na migration `5c8e1f2a9b47_create_search_document_view.py` do backend, que também instala `unaccent` e `pg_trgm`, a configuração `pt_unaccent` e as funções auxiliares (`f_unaccent`, `search_slug`, `clean_professor_name`, `professor_slug`).

| Coluna | Conteúdo |
|---|---|
| `doc_key` | identidade única, `<tipo>:<id>` (índice único) |
| `entity_type`, `entity_id` | tipo e id original (texto; para professor, o slug do nome) |
| `title`, `subtitle` | o que a tela mostra |
| `search_text` | texto sem acento e em minúsculas, para os trigramas |
| `tsv` | vetor de busca com pesos A/B/C |
| `exact_keys` | códigos e nomes normalizados que ganham o bônus de casamento exato |
| `edges` | lista de adjacência do grafo |
| `starts_at`, `ends_at` | datas, para o peso temporal |
| `prior` | importância (0 a 1) |
| `payload` | JSON com o que o card do front precisa (horários, ocorrências, disciplinas, capacidade…) |

**Atualização**: `REFRESH MATERIALIZED VIEW CONCURRENTLY` a cada `SEARCH_INDEX_REFRESH_SECONDS` (padrão 600) em `server/services/cron/search_index_task.py`. O `CONCURRENTLY` reconstrói a view sem bloquear quem está lendo (por isso exige o índice único em `doc_key`). Todos os workers do gunicorn rodam o timer, mas um **advisory lock** do PostgreSQL faz os outros pularem enquanto um está atualizando. Na prática, uma mudança leva até 10 minutos para aparecer na busca. Para forçar:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY search_document;
```

### O que é público

A busca é pública (sem login), então o índice só contém o que já é público em outras telas:

- turmas, disciplinas, salas, prédios e professores;
- **reservas aprovadas** (`status = APPROVED`) de **provas** e **eventos**;
- **reuniões** só quando o título contém "monitoria". As demais reuniões são privadas por padrão: hoje um terço das monitorias aprovadas está cadastrado como reunião, por isso a exceção. Monitorias ainda não têm tipo próprio; o front as identifica pelo título e mostra o selo "Monitoria";
- o **motivo** da reserva não entra no índice, e o **link** só é exposto para eventos (o link de uma reunião pode ser privado).

### Endpoints

`GET /search`

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `q` | obrigatório | 2 a 100 caracteres |
| `types` | todos | um ou mais de `subject`, `class`, `classroom`, `building`, `professor`, `exam`, `event`, `meeting` (repetido: `types=a&types=b`) |
| `limit` | 5 | resultados por tipo (1 a 20) |
| `related_limit` | 6 | relacionados por tipo no destaque (0 a 20) |

Resposta: `top` (o melhor resultado, com `related` agrupado por tipo) e `groups` (os melhores de cada tipo, com o total de cada grupo, do grupo mais relevante para o menos relevante).

`GET /search/documents/{doc_key}` devolve um documento com seus relacionados. O front usa quando a pessoa clica num resultado, sem fazer nova busca textual.

`POST /search/log` (corpo `{ "q": "...", "types": [...] }`, resposta sempre `204`) registra uma busca no [registro de buscas](#registro-de-buscas). O servidor normaliza a consulta e conta os resultados ele mesmo; o cliente não manda o número. Consultas que parecem dado pessoal, e consultas novas além das [cotas contra flood](#registro-de-buscas), são aceitas mas não gravadas.

`GET /admin/search-logs/summary` (só admin) resume o registro:

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `days` | 30 | janela, de 1 a `SEARCH_LOG_RETENTION_DAYS` |
| `only_empty` | `false` | só as consultas que voltaram vazias pelo menos uma vez, das mais frequentes para as menos |
| `limit` | 50 | consultas na lista (1 a 500) |

Resposta: totais da janela (`total_searches`, `distinct_queries`, `empty_searches`) e `queries`, uma linha por consulta normalizada com `searches`, `empty_searches`, `last_result_count` e `last_searched_at`.

### Registro de buscas

Serve para descobrir **o que as pessoas procuram e não encontram**: sinônimos que o índice não conhece ("bandejão" para restaurante), erros de digitação além do que os trigramas toleram, ou dados que ainda não são públicos. É esse registro que vai dizer se a busca semântica (veja [Próximos passos](#proximos-passos)) vale a pena.

A tabela `searchquerylog` é **agregada por dia**: uma linha por (dia, consulta, filtro), com contadores. Buscar de novo a mesma coisa no mesmo dia só soma nos contadores dessa linha.

| Coluna | Conteúdo |
|---|---|
| `day` | o dia (horário de Brasília) |
| `query` | a consulta normalizada (minúsculas, sem acento, espaços simples), como `normalize_query` |
| `types` | o filtro de tipo, ordenado; vazio quando são todos |
| `searches` | quantas vezes foi buscada nesse dia |
| `empty_searches` | quantas dessas buscas voltaram vazias |
| `last_result_count` | quantos documentos casaram na busca mais recente, somando os tipos pedidos (calculado pelo servidor) |
| `last_searched_at` | quando foi a busca mais recente |

**Privacidade.** A tabela não tem usuário, IP, user agent nem identificador de sessão, e por ser agregada por dia nem guarda o horário de cada busca, então não dá para juntar as buscas de uma mesma pessoa. O IP só aparece no contador da cota por IP, no Redis, e expira em 2 dias. Como o texto digitado também pode identificar alguém, consultas com `@` (e-mail) ou com 8 dígitos ou mais, mesmo separados por ponto, traço ou espaço (CPF, telefone, número USP de 8 dígitos), **não são gravadas** (`is_loggable_query`). A busca funciona normalmente; só o registro é descartado. Códigos de disciplina de 7 dígitos continuam sendo registrados. As linhas são apagadas depois de `SEARCH_LOG_RETENTION_DAYS` (padrão 365) pela tarefa diária `purge_old_search_logs`.

**Proteção contra flood.** O `POST /search/log` é público, então qualquer um pode escrever nele. Três travas impedem que isso encha o banco (`server/services/search_log_service.py`):

1. **Agregação.** Como a tabela é por (dia, consulta, filtro), mandar a mesma consulta mil vezes vira um contador `searches = 1000` numa linha só. O que faz a tabela crescer são consultas **diferentes**, e só elas gastam as cotas abaixo.
2. **Cota por IP**: cada IP pode criar no máximo `SEARCH_LOG_MAX_NEW_QUERIES_PER_IP_PER_DAY` (padrão 200) linhas novas por dia. A contagem fica no Redis, como no rate limit (chave `sl:ip:<ip>:<dia>`, que expira em 2 dias, com IPv6 agrupado por /64). O IP **nunca vai para o banco**. 200 é folgado para um NAT da rede USP, com dezenas de pessoas atrás do mesmo IP, porque consultas repetidas não gastam cota.
3. **Teto diário**: no máximo `SEARCH_LOG_MAX_NEW_QUERIES_PER_DAY` (padrão 5000) linhas novas por dia, somando todo mundo. É verificado no Postgres, então vale mesmo sem Redis. Com a retenção, isso dá um tamanho máximo para a tabela: 5000 × 365 ≈ 1,8 milhão de linhas, uns 365 MB no pior caso (cerca de 200 bytes por linha com o índice), não importa quantos IPs ataquem. Com a cota por IP, um IP sozinho só ocupa 4% do teto do dia.

Passou de uma cota, a consulta nova é descartada, mas a resposta continua `204` (a busca já aconteceu, só o registro se perde), e as consultas que já existem no dia continuam sendo contadas. Cada trava avisa no log do backend uma vez por dia e por worker quando é atingida. Sem Redis (não configurado ou fora do ar), a cota por IP não é aplicada, como o rate limit faz, e o teto diário continua valendo. A busca que conta os resultados só roda quando algo vai ser gravado, então um registro descartado não custa uma busca extra. Por cima de tudo, cada requisição passa pelo rate limit geral por IP da API.

O que as travas **não** impedem: inflar a contagem de uma consulta que já existe, para empurrá-la para o topo do relatório. Isso não aumenta o banco, só distorce o relatório, e cada requisição continua limitada pelo rate limit geral.

**Quando o front registra.** A busca dispara 300 ms depois da última tecla, e registrar cada uma gravaria todos os prefixos ("cal", "calc", "calcu"...). Por isso o `useSearchLog` (`src/hooks/search/useSearchLog.ts`) só registra a consulta em que a pessoa **parou**: quando ela fica 2 s sem mudar (`SEARCH_LOG_IDLE_MS`) ou quando a pessoa abre um resultado, o que vier primeiro. A mesma consulta com o mesmo filtro é registrada uma vez só por visita à página. Uma falha no envio é ignorada.

**Onde ver.** A página **Admin › Registro de Buscas** (`/admin/search-logs`, `src/pages/searchLogs/`) mostra o resumo do `GET /admin/search-logs/summary`: os totais do período (7, 30, 90 ou 365 dias), e a lista em duas visões, **Sem resultado** (a padrão, as consultas que voltaram vazias pelo menos uma vez) e **Mais buscadas**. A coluna "Na última busca" diz se a consulta ainda volta vazia ou se já passou a encontrar algo (por exemplo, depois de um dado novo), e o link de cada linha abre a busca pública com aquela consulta, para ver o que ela mostra hoje. A página lista até 100 consultas.

Consulta útil direto no banco, fora do endpoint:

```sql
-- O que mais voltou vazio nos últimos 30 dias
SELECT query, sum(empty_searches) AS vezes
FROM searchquerylog
WHERE day > current_date - 30
GROUP BY query
HAVING sum(empty_searches) > 0
ORDER BY vezes DESC
LIMIT 50;

-- Linhas novas por dia (perto de SEARCH_LOG_MAX_NEW_QUERIES_PER_DAY = teto atingido)
SELECT day, count(*) FROM searchquerylog GROUP BY day ORDER BY day DESC LIMIT 14;
```

### Frontend

- **`useGeneralSearch`** (`src/hooks/search/useGeneralSearch.ts`): espera 300 ms depois da última tecla e **cancela a requisição anterior** (`AbortController`). Isso evita acumular requisições contra o limite de requisições por IP do backend, e garante que uma resposta antiga nunca sobrescreva uma nova.
- **Estado na URL**: `?q=` (consulta), `type=` (filtro) e `focus=` (resultado clicado). A busca pode ser compartilhada por link, e o botão voltar do navegador volta ao destaque anterior.
- **Selo de status** (`src/utils/search/search.formatter.ts`): para turmas, cruza o período com os horários do dia da semana de hoje ("Em andamento", "Hoje às 15:00", "Sem aula hoje", "Turma encerrada"); para reservas, usa as datas reais das ocorrências ("Acontecendo agora", "Próxima: 24/11", "Encerrada").
- **Layout**: com muitos resultados, o destaque fica numa coluna lateral fixa; com até 3, vai para baixo da lista, na horizontal.
- **Registro**: `useSearchLog` envia a consulta em que a pessoa parou para o [registro de buscas](#registro-de-buscas).

## Como adicionar um novo tipo

1. Escreva uma nova CTE `<tipo>_docs` na view, com **exatamente** as mesmas colunas das outras, e inclua-a no `UNION ALL` de `all_docs`. Isso exige uma migration que recria a view (`DROP MATERIALIZED VIEW` + `CREATE` + índices).
2. Adicione o tipo em `SearchEntityType` no backend (`server/utils/enums/search_entity_type.py`) e no front (`src/utils/enums/searchEntityType.enum.ts`), com os rótulos em português.
3. No front, adicione o tipo do `payload` em `search.response.models.ts`, um ícone em `SearchResultItem` e as linhas de detalhe em `describeSearchItem`.
4. Escreva testes de busca para o tipo novo em `tests/api/public/test_search_routes.py`.

O ranking, os endpoints e a página não mudam: eles são genéricos por tipo.

## Limitações conhecidas

- O índice inclui o **histórico inteiro** de turmas e reservas. O passado só perde no peso temporal, não sai do resultado.
- Strings com **dois professores juntos** (um problema dos dados do crawler, ex.: "Marco Antonio Gutierrez Sérgio Shiguemi Furuie") viram um único professor.
- O radical em português junta palavras de sentidos diferentes ("monitoria" e "monitoramento").
- O status "acontecendo agora" usa o relógio do navegador e não considera feriados.

## Próximos passos

- **PageRank** no lugar da centralidade de grau, calculado num job periódico.
- **Busca semântica** como complemento, se o registro de buscas mostrar muitas buscas sem resultado por sinônimos: a extensão `pgvector` guarda um embedding por documento, gerado por um modelo multilíngue pequeno que roda em CPU (ex.: `multilingual-e5-small`, uns 10 a 30 ms por consulta). As duas listas (lexical e semântica) seriam combinadas por **Reciprocal Rank Fusion**: cada documento recebe `Σ 1 / (60 + posição)` somando as posições dele em cada lista, o que dispensa calibrar escalas de score diferentes.

## Referências

- PostgreSQL: [Full Text Search](https://www.postgresql.org/docs/16/textsearch.html), [`ts_rank_cd` e normalizações](https://www.postgresql.org/docs/16/textsearch-controls.html#TEXTSEARCH-RANKING), [`pg_trgm`](https://www.postgresql.org/docs/16/pgtrgm.html), [`unaccent`](https://www.postgresql.org/docs/16/unaccent.html), [Materialized Views](https://www.postgresql.org/docs/16/rules-materializedviews.html).
- C. Clarke, G. Cormack e E. Tudhope. *Relevance ranking for one to three term queries*. Information Processing & Management, 2000 (versão em conferência de 1997). Base do `ts_rank_cd`.
- [Snowball: algoritmo de radicalização para português](https://snowballstem.org/algorithms/portuguese/stemmer.html).
- C. Manning, P. Raghavan e H. Schütze. *Introduction to Information Retrieval*. Cambridge University Press, 2008 (índice invertido, modelo vetorial, TF-IDF, n-gramas). [Disponível online](https://nlp.stanford.edu/IR-book/).
- S. Brin e L. Page. *The Anatomy of a Large-Scale Hypertextual Web Search Engine*. 1998 (PageRank).
- G. Cormack, C. Clarke e S. Büttcher. *Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods*. SIGIR, 2009.
