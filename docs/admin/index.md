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
- **Grupos de Usuários**: agrupamento de usuários, usado por exemplo para restringir o acesso a [salas restritas](/oferings/classrooms/).
- **Eventos**: cadastro de eventos institucionais do USPolis.
- **Cursos**: gerenciamento dos cursos e de seus currículos/disciplinas.
- **Reportes**: acesso aos relatórios de bugs enviados pelos usuários.
- **Feedback**: acesso ao feedback enviado pelos usuários do sistema.
- **Infraestrutura & Servidor** *(acesso restrito)*: informações sobre a arquitetura, o ambiente e o deploy do servidor — disponível apenas para quem tem essa permissão adicional (por isso aparece destacado em vermelho quando o usuário logado não tem acesso).
- **Status da API**: logs de acesso, erros e incidentes da API do USPolis.
- **Clientes de API**: cadastro dos parceiros que consomem a API do USPolis e emissão, revogação e limites das suas [API keys](/api-keys/).

## Clientes de API

Esta tela atende os pedidos de chave descritos em [API Keys](/api-keys/#como-pedir-uma-chave). Para atender um pedido:

1. **Cadastre o parceiro** em **Novo cliente**, com nome e contato. O e-mail de contato é quem recebe o link da chave e os avisos.
2. **Emita a chave** na página do cliente, escolhendo nome, validade (no máximo 365 dias), rotas liberadas e limites. Libere só as rotas de que o parceiro precisa: `/` dá acesso a todas as rotas públicas e pede justificativa por escrito.
3. **Escolha a entrega.** Prefira o **link de uso único** (válido por 1, 24 ou 72 horas): você nunca vê a chave, e pode enviar o link por e-mail ao contato. Se escolher ver a chave na tela, ela aparece uma única vez; nesse caso, entregue por um canal seguro, nunca por e-mail ou chat.

O link só pode ser enviado enquanto o modal de emissão estiver aberto, porque o servidor não guarda o token. Depois disso, para reenviar, invalide o link e emita outra chave.

Na página da chave é possível editar nome, validade, rotas e limites, acompanhar o último uso e o estado do link, e revogar a chave. Algumas ações têm efeito imediato e não podem ser desfeitas:

- **Revogar uma chave** é definitivo. Em caso de vazamento, revogue, avise o contato e emita outra.
- **Invalidar um link ainda não aberto** também revoga a chave dele, assim como deixar o link expirar sem ser aberto.

**Desativar um cliente** bloqueia todas as chaves dele de uma vez, e pode ser desfeito reativando o cliente.
