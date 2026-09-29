---
prev:
  text: 'Salas'
  link: '/oferings/classrooms'

next:
  text: 'Turmas'
  link: '/oferings/classes'
---

# Disciplinas

Esta página organiza o cadastro das disciplinas que podem aparecer no [Mapa de Salas](/allocations/) e ser usadas para criar [Turmas](/oferings/classes).

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/subjects/image.png"
    alt="Tabela de disciplinas cadastradas"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

## O que aparece na tela

A tabela lista as disciplinas com **ID**, **Código**, **Nome**, **Professores**, **Prédios**, **Tipo** (ex.: Semestral) e **Créditos Aula** — role a tabela horizontalmente para ver também **Créditos Trabalho** e as **Opções** de cada linha. Assim como nas demais tabelas do sistema, cada coluna tem seu próprio filtro e a lista é paginada no rodapé.

Na coluna **Professores**, os nomes marcados com **(R)** indicam o professor responsável pela disciplina; passe o mouse sobre um nome cortado para ver o nome completo em um tooltip.

## Cadastrar ou editar uma disciplina

Use o botão **Cadastrar**, no canto superior direito, para abrir o formulário (o mesmo é reaproveitado ao editar uma disciplina existente):

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/subjects/image-1.png"
    alt="Modal de cadastro de disciplina"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Os campos são:

- **Prédios**: um ou mais prédios onde a disciplina é oferecida.
- **Código da Disciplina** e **Nome da Disciplina**.
- **Tipo de turma**: periodicidade padrão da disciplina (ex.: Semestral, Quadrimestral).
- **Créditos Aula** e **Créditos Trabalho**.
- **Professores**: digite o nome do professor no campo de busca e clique em **Adicionar** para incluí-lo na lista de **Professores adicionados**; é possível adicionar mais de um professor à mesma disciplina.

Depois de preencher os campos obrigatórios, use **Cadastrar** para salvar.

## Ações comuns

Na coluna **Opções** de cada linha da tabela é possível **duplicar**, **editar** ou **excluir** a disciplina. Tenha cuidado ao excluir uma disciplina que já tenha [turmas](/oferings/classes) vinculadas.
