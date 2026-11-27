---
prev:
  text: 'Reservas'
  link: '/scheduling/reservations'

next:
  text: 'Calendários'
  link: '/oferings/calendars'
---

# Solicitações

Esta página centraliza os pedidos de reserva de sala feitos por outros usuários (através do botão "Solicitar Sala" no [Mapa de Salas](/allocations/)) que ainda aguardam aprovação. Cada usuário vê apenas as solicitações pelas quais é responsável (veja abaixo).

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

## Quem é responsável por uma solicitação

Cada solicitação é de responsabilidade dos grupos de uma sala. Qual sala vale depende do momento:

1. **Solicitação aprovada:** a sala onde a reserva foi alocada.
2. **Solicitação pendente com sala escolhida:** a sala que o solicitante pediu.
3. **Solicitação sem sala:** não há sala definida, então ela fica com o **grupo principal do prédio**.

O grupo principal do prédio tem acesso a todas as salas, então ele é responsável por todas as solicitações do prédio. Um grupo que cuida só de algumas salas é responsável apenas pelas solicitações dessas salas.

Essa mesma regra decide três coisas:

| O quê | Quem |
|---|---|
| Ver a solicitação nesta página | os responsáveis por ela |
| Receber o e-mail de solicitação nova ou cancelada | os responsáveis por ela que deixaram as notificações por e-mail ligadas no [perfil](/profile/) |
| Aprovar ou negar | os responsáveis por ela |

Administradores do sistema veem e podem aprovar todas as solicitações.

::: tip Exemplo
No prédio da Elétrica, um grupo cuida só da sala B2-03. Uma solicitação para a sala B2-05 aparece e é enviada por e-mail ao grupo principal da Elétrica e aos grupos da B2-05, mas não ao grupo da B2-03. Uma solicitação sem sala vai apenas para o grupo principal.
:::

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
- **Aprovar** para transformar o pedido em uma reserva confirmada (que passa a aparecer em [Reservas](/scheduling/reservations/));
- **Negar** para recusar o pedido.

O aviso **"Esse horário gerará N conflito(s)"** avisa, antes da decisão, se aprovar aquela solicitação vai gerar sobreposição de horário com outra ocupação da sala — veja [Conflitos](/oferings/conflicts/) para mais detalhes sobre esse tipo de situação.

Só solicitações pendentes podem ser aprovadas ou negadas. O solicitante recebe um e-mail com a decisão; ao negar, informe uma justificativa, que vai junto no e-mail.

::: info A sala só é reservada na aprovação
Enquanto a solicitação está pendente, a sala pedida **não fica ocupada**: ela não aparece no calendário de alocação nem bloqueia outras reservas. Isso vale também quando o solicitante edita a solicitação. A sala só é reservada quando um responsável aprova.
:::
