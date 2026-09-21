---
prev:
  text: 'Calendários'
  link: '/oferings/calendars'

next:
  text: 'Disciplinas'
  link: '/oferings/subjects'
---

# Salas

Aqui você gerencia o cadastro das salas de aula de um prédio: capacidade, recursos disponíveis e se ela pode ou não ser reservada pelos usuários.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/classrooms/image.png"
    alt="Tabela de salas de aula cadastradas"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

## O que aparece na tela

A tabela lista todas as salas com as colunas **Nome**, **Prédio**, **Observação**, **Andar**, **Capacidade**, **Ar Cond.**, **Audiovisual**, **Acessibilidade**, **Reservável**, **Restrito** e **Atualizado em**:

- As colunas **Ar Cond.** e **Acessibilidade** mostram apenas ✓ ou ✗, indicando se a sala tem ou não o recurso.
- **Reservável** indica se a sala aparece como opção para solicitações de reserva (veja [Reservas](/scheduling/reservations)); salas não reserváveis só são usadas para alocação de turmas.
- **Restrito** indica se o acesso à sala é restrito a determinados grupos de usuários.

Cada coluna tem seu próprio campo de filtro logo abaixo do cabeçalho (texto livre ou seletor, dependendo da coluna), e a tabela é paginada — use os controles no rodapé para navegar entre as páginas ou trocar quantas linhas são exibidas por página.

Na coluna **Opções**, os ícones por linha permitem **duplicar**, **editar** ou **excluir** a sala.

## Cadastrar ou editar uma sala

Use o botão **Cadastrar**, no canto superior direito, para abrir o formulário de nova sala (o mesmo formulário é reaproveitado ao clicar em editar):

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/classrooms/image-1.png"
    alt="Modal de cadastro de sala"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Os campos são:

- **Prédio**: a qual prédio a sala pertence.
- **Nome**: identificação da sala (ex.: "A1-01").
- **Andar** e **Capacidade**: número de alunos/pessoas que a sala comporta.
- **Recursos**: caixas de seleção **Ar condicionado** e **Acessibilidade**.
- **Recurso audiovisual**: seletor com o equipamento disponível na sala (ex.: projetor), quando houver.
- **Configurações**: **Reservável** (permite que a sala seja solicitada por outros usuários) e **Restrita** (limita o acesso da sala a grupos específicos, definidos em **Grupos** logo abaixo — é necessário escolher o prédio primeiro).
- **Observação**: campo de texto livre, com limite de 256 caracteres, para anotações sobre a sala.

Depois de preencher, use **Cadastrar** (ou **Salvar**, ao editar) para confirmar.
