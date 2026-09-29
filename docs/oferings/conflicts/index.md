---
prev:
  text: 'Turmas'
  link: '/oferings/classes'

next:
  text: 'Relatórios e Métricas'
  link: '/oferings/reports'
---

# Conflitos

Um conflito acontece quando duas ou mais ocupações (turmas, reservas ou provas) são alocadas na mesma sala, no mesmo horário, no mesmo dia. Esta página ajuda a encontrar e revisar esses casos.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/conflicts/image.png"
    alt="Tela de Conflitos antes de selecionar um prédio"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Assim como em Turmas, o indicador **Período: Atual**, ao lado do título, mostra qual período letivo está sendo considerado.

## Selecionando um prédio

Os conflitos são calculados prédio a prédio: selecione o **Prédio** desejado no seletor para carregar as ocorrências. Antes disso, a página exibe apenas o aviso "Selecione um prédio".

Depois de escolher o prédio, use as abas **Não intencionais** e **Intencionais** para alternar entre os dois tipos de conflito:

- **Não intencionais**: sobreposições que provavelmente não deveriam existir (ex.: duas turmas diferentes alocadas na mesma sala e horário por engano) e que merecem revisão.
- **Intencionais**: sobreposições sinalizadas propositalmente (por exemplo, quando uma sala é compartilhada de forma combinada entre duas ocupações).

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/conflicts/image-1.png"
    alt="Lista de conflitos expandida para uma sala, mostrando as turmas em conflito"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Os conflitos aparecem agrupados por **sala**, com a quantidade de datas conflitantes entre parênteses. Clique no nome da sala para expandir e ver quais turmas/reservas estão envolvidas no conflito; clique em cada item para ver mais detalhes sobre a ocorrência.

## Resolvendo um conflito

Para resolver um conflito não intencional, ajuste o horário ou a sala de uma das ocupações envolvidas — em [Turmas](/oferings/classes) ou em [Reservas](/scheduling/reservations), dependendo do que estiver em conflito — até que a sobreposição deixe de aparecer nesta página.
