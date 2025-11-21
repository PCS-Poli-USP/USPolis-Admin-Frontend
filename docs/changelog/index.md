# Changelog

Categorias: <span style="color: green">FEATURE</span>, <span style="color: #408080">IMPROVEMENT</span>, <span style="color: orange">BUGFIX</span>, <span style="color: red">HOTFIX</span>, <span style="color: gray">DOCS</span>

O changelog começou a ser registrado a partir do dia 15/11/2025.

## Correção de bug - 18/11/2025
<span style="color: red">HOTFIX</span>

PR's: [#110](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/110) e [#137](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/137)

**Descrição:**

Correção de bug de autenticação para usuários novos. O sistema não verificava se o usuário existia e tentava pegar suas informações, agora ele corretamente cria caso não exista e mantém apenas sessões novas registradas. Correção também de um loop na página de redirecionamento que constantemente tentava autenticar o usuário, agora ele tenta apenas uma vez.

## Correção de bug - 15/11/2025
<span style="color: orange">BUGFIX</span>

PR's: [#106](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/106)

**Descrição:**

Correção do tamanho da Navbar para usuários mobile, limitando para 100vw. Agora o beacon de novas funcionalidades funciona corretamente para celulares.


## Fale Conosco - 15/11/2025
<span style="color: green">FEATURE</span>

PR's: [#105](https://github.com/PCS-Poli-USP/USPolis-Admin-Frontend/pull/105) e [#132](https://github.com/PCS-Poli-USP/USPolis-Admin-Backend/pull/132)

**Descrição:**

Criação da funcionalidade "Fale Conosco", onde os usuários podem mandar mensagens (feedbacks) ou reportar problemas (bugs) pelo próprio sistema do USPolis.
No reporte de problemas é possível adicionar imagens ilustrando o problema ocorrendo. Tanto o feedback quanto o reporte enviam e-mails avisando os administradores, é
possível acompanhar eles também em telas administrativas.
