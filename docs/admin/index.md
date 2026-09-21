---
prev:
  text: 'Conta'
  link: '/profile'
---

# Administração

O **Portal Admin** concentra as ferramentas administrativas do USPolis. Ele só aparece no menu, e só pode ser acessado, por usuários com permissão de administrador.

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img
    src="/admin/image.png"
    alt="Portal Admin, com todos os módulos administrativos disponíveis"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Cada card do Portal Admin leva para um módulo diferente:

- **Prédios**: cadastro dos prédios da universidade, usados em todo o restante do sistema (salas, calendários, reservas, etc.).
- **Usuários**: gerenciamento das contas de usuário do USPolis.
- **Sessões de Usuários**: acompanhamento das sessões de acesso ativas dos usuários.
- **Papéis**: gerenciamento dos papéis (permissões) que podem ser atribuídos aos usuários.
- **Grupos de Usuários**: agrupamento de usuários, usado por exemplo para restringir o acesso a [salas restritas](/oferings/classrooms).
- **Eventos**: cadastro de eventos institucionais do USPolis.
- **Cursos**: gerenciamento dos cursos e de seus currículos/disciplinas.
- **Reportes**: acesso aos relatórios de bugs enviados pelos usuários.
- **Feedback**: acesso ao feedback enviado pelos usuários do sistema.
- **Infraestrutura & Servidor** *(acesso restrito)*: informações sobre a arquitetura, o ambiente e o deploy do servidor — disponível apenas para quem tem essa permissão adicional (por isso aparece destacado em vermelho quando o usuário logado não tem acesso).
- **Status da API**: logs de acesso, erros e incidentes da API do USPolis.
