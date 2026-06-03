import { Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import CollaboratorCard from './CollaboratorCard';
import gabrielImg from './Images/gabriel.jpeg';
import juliaImg from './Images/julia.jpeg';
import levyImg from './Images/levy.jpeg';
import renanImg from './Images/renan.jpeg';

export interface Colaborator {
  name: string;
  description: string;
  image?: string;
  iconType?: 'student' | 'professor' | 'other' | 'none';
  linkedin?: string;
  github?: string;
}

function About() {
  const collaborators: Colaborator[] = [
    {
      name: 'Gabriel Di Vanna Camargo',
      description: 'Aluno de graduação',
      linkedin:
        'https://www.linkedin.com/in/gabriel-di-vanna-camargo-167403243',
      github: 'https://github.com/gdvcamargo',
      image: gabrielImg,
    },
    {
      name: 'Julia Machado Boschetti',
      description: 'Aluna de graduação',
      linkedin: 'https://www.linkedin.com/in/juliamboschetti/',
      github: 'https://github.com/bisnagua',
      image: juliaImg,
    },
  ];

  const orientation: Colaborator[] = [
    {
      name: 'Prof. Dr. Fábio Levy Siqueira',
      description: 'PCS | Poli-USP',
      linkedin: 'https://www.linkedin.com/in/levysiqueira/',
      github: 'https://github.com/levysiqueira',
      image: levyImg,
    },
    {
      name: 'Renan de Luca Avila',
      description: 'Criador original do USPolis',
      linkedin: 'https://www.linkedin.com/in/delucarenan/',
      github: 'https://github.com/avilarenan',
      image: renanImg,
    },
  ];

  const emeritus: Colaborator[] = [
    {
      name: 'Daniel Hiroki Yamashita',
      description: 'Ex-aluno de graduação',
    },
    {
      name: 'Henrique Fuga Duran',
      description: 'Ex-aluno de graduação',
    },
    {
      name: 'Jorge Habib El Khouri',
      description: 'Ex-aluno de graduação',
    },
    {
      name: 'José Vitor Martins Makiyama',
      description: 'Ex-aluno de graduação',
    },
    {
      name: 'Luiz Roberto AKio Higuti',
      description: 'Ex-aluno de graduação',
    },
    {
      name: 'Marcel Makoto Kondo',
      description: 'Ex-aluno de graduação',
    },
    {
      name: 'Rodrigo Kenki Aguena',
      description: 'Ex-aluno de graduação',
    },
    {
      name: 'Rodrigo Miksian Magaldi',
      description: 'Ex-aluno de graduação',
    },
  ];

  return (
    <Flex
      h={'full'}
      direction={'column'}
      align={'center'}
      justify={'flex-start'}
      gap={12}
      p={10}
    >
      <Flex direction={'column'} maxW={'700px'} w={'full'} gap={5}>
        <Text fontSize={'xl'} textColor={'uspolis.black'} textAlign={'justify'}>
          O USPolis foi inicialmente desenvolvido como projeto de formatura no
          PCS, contando com um sistema de alocação automático de salas. Ao longo
          do tempo outros projetos de formatura continuaram seu desenvolvimento.
          Atualmente o USPolis possui uma bolsa PUB para financiar o seu
          desenvolvimento.
        </Text>
        <Text fontSize={'xl'} textColor={'uspolis.black'} textAlign={'justify'}>
          O USPolis é um projeto open-source, caso queira contribuir, tenha
          dúvidas, sugestões ou comentários entre em contato conosco. Sua ajuda
          será mais do que bem vinda!
        </Text>
      </Flex>
      <Flex direction={'column'} gap={6} w={'full'} maxW={'800px'}>
        <Heading textColor={'uspolis.black'} textAlign={'center'}>
          Desenvolvedores
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
          {collaborators.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.name}
              name={collaborator.name}
              description={collaborator.description}
              linkedin={collaborator.linkedin}
              github={collaborator.github}
              image={collaborator.image}
            />
          ))}
        </SimpleGrid>
      </Flex>
      <Flex direction={'column'} gap={6} w={'full'} maxW={'800px'}>
        <Heading textColor={'uspolis.black'} textAlign={'center'}>
          Orientação
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          {orientation.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.name}
              name={collaborator.name}
              description={collaborator.description}
              linkedin={collaborator.linkedin}
              github={collaborator.github}
              image={collaborator.image}
            />
          ))}
        </SimpleGrid>
      </Flex>
      <Flex
        direction={'column'}
        gap={6}
        w={'full'}
        maxW={'800px'}
        justifyContent={'center'}
        alignContent={'center'}
      >
        <Heading textColor={'uspolis.black'} textAlign={'center'}>
          Desenvolvedores Eméritos
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {emeritus.map((collaborator) => (
            <Flex direction={'column'} justify={'center'} align={'center'}>
              <Text fontWeight={'bold'}>{collaborator.name}</Text>
              <Text>{collaborator.description}</Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

export default About;
