---
prev:
  text: 'Tecnologias Utilizadas'
  link: '/dev/stack'

next:
  text: 'Configurando seu Ambiente'
  link: '/dev/enviroment'
---

# Arquitetura

**Utilizamos o site [excalidraw](https://excalidraw.com/) para gerar os diagramas**

A arquitetura do USPolis é a seguinte:

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
">
  <img 
    src="/dev/image.png"
    alt="Descrição"
    style="
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    "
  />
</div>

Ele é dividido em dois principais sistemas, o USPolis Admin e o USPolis Mobile. É através do USPolis Admin que os gestores de prédios alimentam nosso banco de dados com todas as informações relacionadas a alocações, disciplinas e turmas.

Essa alimentação é feita principalmente através de um [Web scraping](https://pt.wikipedia.org/wiki/Web_scraping) de dados **PÚBLICOS** do [Júpiter Web](https://uspdigital.usp.br/jupiterweb/jupDisciplinaBusca?tipo=D&codmnu=6755) e do [Janus Web](https://uspdigital.usp.br/janus/componente/disciplinasOferecidasInicial.jsf). Onde pegamos informações de disciplinas e turmas, atualmente estamos desenvolvendo a funcionalidade de cursos, onde vamos pegar as grades curriculares.

A alocação em si é feita manualmente pelos gestores, um dos objetivos atuais é desenvolver um algorito de alocação automático utilizando uma modelagem de otimização linear.

Esses dados de alocações são distribuídos tanto através do USPolis Mobile quanto pelo USPolis Admin em sua parte pública. Os usuários mobile consomem esses dados através de nosso aplicativo mobile, no geral, eles apenas consomem dados. 

No USPolis Admin alunos e professores podem solicitar reservas de salas, essa funcionalidade não existe no mobile.