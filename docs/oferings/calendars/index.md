---
prev:
  text: 'Solicitações'
  link: '/scheduling/solicitations'

next:
  text: 'Salas'
  link: '/oferings/classrooms'
---

# Calendários

Um calendário acadêmico define, para um determinado **ano**, quais feriados e datas especiais devem ser respeitados ao montar as alocações das turmas. Cada calendário criado aqui pode depois ser associado às turmas (veja [Turmas](/oferings/classes)), garantindo que a alocação de sala não gere aulas em cima de feriados e recessos.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/calendars/image.png"
    alt="Tela de Calendários com a lista de calendários cadastrados"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

## Calendários

No topo da página, o seletor **Ano** (ex.: 2025, 2026, 2027) filtra os calendários e feriados exibidos para aquele ano — cada calendário pertence a um único ano.

Cada card de calendário mostra:
- **Nome** do calendário e o **ano** (canto superior direito do card)
- Quem **criou** o calendário
- A quantidade de **feriados** e **categorias de feriados** vinculadas a ele
- As **categorias** associadas, com a contagem de feriados de cada uma
- Uma mini barra com os meses do ano (J, F, M...), destacando em qual mês há mais feriados
- Os botões **Visualizar**, **Editar** e **Excluir**

O card pontilhado com o **+** ("Novo calendário para {ano}") é um atalho para criar rapidamente um calendário para o ano selecionado.

Use o botão **+ Calendário** no canto superior direito para abrir o formulário completo:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/calendars/image-1.png"
    alt="Modal de cadastro de calendário"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Preencha o **Nome** do calendário, o **Ano** e, opcionalmente, já selecione uma ou mais **Categorias de Feriados** existentes para vincular ao calendário (também é possível vinculá-las depois, editando o calendário).

## Feriados e Categorias

A segunda aba, **Feriados e Categorias**, concentra o cadastro de feriados independente de qualquer calendário específico — depois eles são reaproveitados em um ou mais calendários através das categorias.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/calendars/image-2.png"
    alt="Aba Feriados e Categorias, com a lista de categorias à esquerda e os feriados do ano agrupados por mês à direita"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

À esquerda ficam as **categorias** cadastradas para o ano (ex.: "Feriados USP", "Feriados SP", "Semana do Semestral"), cada uma com sua quantidade de feriados e quem a criou. Clique em uma categoria para filtrar apenas os feriados dela na lista à direita; os ícones de lápis e lixeira editam ou excluem a categoria. Use **+ Nova categoria** (ou o botão **+ Categoria** no topo da página) para criar uma nova:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/calendars/image-3.png"
    alt="Modal de cadastro de categoria de feriados"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

À direita fica a lista de **todos os feriados do ano**, agrupados por mês, cada um com sua etiqueta colorida indicando a categoria à qual pertence. Use a busca **"Buscar feriado..."** para filtrar por nome, ou o botão **+ Feriado** para cadastrar um novo:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/calendars/image-4.png"
    alt="Modal de cadastro de feriado"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

No cadastro de feriado, escolha a **Categoria do feriado**, o **Nome** e a **Data**. Marque **"Cadastrar vários dias"** quando o feriado ocupar um intervalo de datas seguidas (por exemplo, a Semana Santa ou a Semana do Semestral, que aparecem como vários dias na mesma categoria).

## Montando seu calendário

O fluxo recomendado é:

1. Cadastre as **categorias** de feriados que fizerem sentido para o seu calendário (ex.: feriados nacionais, estaduais, da própria unidade).
2. Cadastre os **feriados**, associando cada um à categoria correta.
3. Crie o **calendário** do ano desejado e vincule as categorias de feriados a ele.
4. Associe o calendário às turmas em [Turmas](/oferings/classes), para que as alocações de sala já considerem esses feriados automaticamente.
