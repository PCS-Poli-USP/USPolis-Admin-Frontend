---
prev:
  text: 'Conflitos'
  link: '/oferings/conflicts'

next:
  text: 'Solicitações'
  link: '/scheduling/solicitations'
---

# Relatórios e Métricas

Reúne relatórios para análise da ocupação e do uso das salas de um prédio.

## Relatório de Taxa de Ocupação

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/reports/image.png"
    alt="Relatório de Taxa de Ocupação antes de selecionar um prédio"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Esse relatório mostra, para cada sala de aula, o quanto ela está sendo ocupada em relação à sua capacidade — permitindo identificar salas **hiper ocupadas** (com mais alunos do que capacidade) ou **sub ocupadas** (com poucos alunos para a capacidade disponível).

Antes de exibir qualquer dado é preciso escolher:

- O ícone de calendário ao lado do rótulo do período (ex.: **Atual**) indica o período letivo considerado.
- **Prédio**: o prédio cujas salas serão analisadas.
- **Filtro**: por padrão mostra "Todas" as salas, mas pode ser restrito a apenas as hiper ou sub ocupadas.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/reports/image-1.png"
    alt="Relatório de Taxa de Ocupação com um prédio selecionado, listando as salas por taxa máxima de ocupação"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Depois de selecionar o prédio, a lista mostra cada sala com a quantidade de **alocações** no período e a **taxa máxima** de ocupação atingida — em vermelho quando ultrapassa 100% (turma com mais alunos do que a capacidade da sala) e em laranja quando está próxima do limite. Clique no nome da sala (seta à direita) para expandir e ver o detalhamento por turma/alocação.

## Ações comuns

- Alterne o **Prédio** e o **Filtro** para focar em um conjunto específico de salas.
- Use os resultados para embasar remanejamentos de sala em [Turmas](/oferings/classes) — salas hiper ocupadas geralmente precisam de uma sala maior, e salas sub ocupadas podem liberar espaço para outras turmas.
