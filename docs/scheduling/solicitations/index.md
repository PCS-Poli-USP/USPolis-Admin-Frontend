---
prev:
  text: 'Reservas'
  link: '/scheduling/reservations'

next:
  text: 'Calendários'
  link: '/oferings/calendars'
---

# Solicitações

Esta página centraliza os pedidos de reserva de sala feitos por outros usuários (através do botão "Solicitar Sala" no [Mapa de Salas](/allocations/)) que ainda aguardam aprovação.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/scheduling/solicitations/image.png"
    alt="Lista de solicitações pendentes"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

## O que aparece na tela

À esquerda fica a pilha de solicitações, cada uma mostrando o tipo do pedido (ex.: Reserva de Sala), o **Local** (prédio e sala, ou "sala não especificada", quando o solicitante não escolheu uma sala específica), o **Solicitante** e a data/hora do pedido, e a **Situação** (ex.: Pendente).

Use os campos de busca no topo (**Prédio**, **Sala**, **Solicitante**, **Situação**) para filtrar a pilha, e a caixa **"Exibir aprovados/negados/antigos"** para incluir solicitações que já foram decididas.

## Analisando uma solicitação

Clique em uma solicitação na pilha para ver seus detalhes à direita:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/scheduling/solicitations/image-1.png"
    alt="Detalhes de uma solicitação de reserva pendente"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

O painel de detalhes mostra:

- **Solicitante e Título**: nome, e-mail e título dado à solicitação.
- **Motivo**: a justificativa informada pelo solicitante.
- **Requisitos**: por exemplo, a capacidade mínima de pessoas necessária.
- **Local, Horário e Datas**: prédio, sala (ou "NÃO ESPECIFICADA"), horário e as datas solicitadas.

Quando o solicitante não escolheu uma sala específica, é necessário escolher uma no seletor **Sala** (e pode usar **Visualizar disponibilidade** para conferir se ela está livre) antes de poder aprovar o pedido — repare que o botão **Aprovar** fica desabilitado até que uma sala seja definida. O botão **Alterar Sala** permite trocar a sala já vinculada à solicitação.

Ao final, use:

- **Editar** para ajustar dados da solicitação antes de decidir;
- **Aprovar** para transformar o pedido em uma reserva confirmada (que passa a aparecer em [Reservas](/scheduling/reservations));
- **Negar** para recusar o pedido.

O aviso **"Esse horário gerará N conflito(s)"** avisa, antes da decisão, se aprovar aquela solicitação vai gerar sobreposição de horário com outra ocupação da sala — veja [Conflitos](/oferings/conflicts) para mais detalhes sobre esse tipo de situação.
