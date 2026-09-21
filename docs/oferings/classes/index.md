---
prev:
  text: 'Disciplinas'
  link: '/oferings/subjects'

next:
  text: 'Conflitos'
  link: '/oferings/conflicts'
---

# Turmas

Aqui você gerencia as turmas vinculadas às disciplinas, define seus horários de aula e as aloca em salas e calendários.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/classes/image.png"
    alt="Tabela de turmas cadastradas"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

## O que aparece na tela

Ao lado do título **Turmas** fica o indicador **Período: Atual** — a lista mostra as turmas do período letivo selecionado (clique nele para trocar de período).

A tabela mostra, por turma, a **Disciplina**, o número da **Turma**, o **Nome da disciplina**, o **Prédio** e a **Sala** em que ela foi alocada, os **Horários** (dia da semana e faixa de horário) e o **Calendário** vinculado (ou "Sem calendário", quando nenhum foi associado — veja [Calendários](/oferings/calendars)). Role a tabela horizontalmente para ver também vagas, professores e as opções de cada linha. Assim como nas outras tabelas do sistema, cada coluna tem seu próprio filtro e a lista é paginada no rodapé.

A coluna **Marca**, à esquerda, tem duas caixas de seleção no cabeçalho (✓ e ✗) para marcar ou desmarcar rapidamente todas as turmas da página — útil para usar as ações em massa do menu **Opções**.

## Cadastrar e atualizar turmas

O botão **+ Opções**, no canto superior direito, reúne as ações principais da página:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/oferings/classes/image-1.png"
    alt="Menu de opções da tela de turmas"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

- **Adição › Manual**: abre o formulário para cadastrar uma turma manualmente, vinculando-a a uma disciplina, prédio, sala e horários.
- **Adição › Júpiter/Janus**: importa turmas automaticamente a partir do Júpiter/Janus (sistemas acadêmicos da USP), evitando digitação manual.
- **Atualizar › Júpiter/Janus**: sincroniza novamente as turmas já importadas com as informações mais recentes do Júpiter/Janus.
- **Remover › Selecionados**: exclui em lote as turmas marcadas na coluna **Marca**.
- **Alocações › Reaproveitar**: reaproveita a alocação de sala/horário de um período anterior para as turmas selecionadas, evitando refazer a alocação do zero a cada período.

Na coluna de opções de cada linha da tabela ficam as ações individuais da turma — entre elas, duplicar, editar, ver ocorrências no calendário, alocar sala e excluir a turma.

## Conflitos de horário

Ao alocar sala e horário de uma turma, o sistema pode acusar sobreposição com outras turmas ou reservas na mesma sala — veja como interpretar e resolver esses casos em [Conflitos](/oferings/conflicts).
