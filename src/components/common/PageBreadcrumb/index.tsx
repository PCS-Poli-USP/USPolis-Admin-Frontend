import { ChevronRightIcon } from '@chakra-ui/icons';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface Crumb {
  label: string;
  href: string;
  current?: boolean;
}

interface PageBreadcrumbProps {
  pathname: string;
  items?: Crumb[];
}

const mainMap: Record<string, Crumb[]> = {
  '/admin': [{ label: 'Admin', href: '/admin', current: false }],
  '/profile': [{ label: 'Perfil', href: '/profile', current: false }],
  '/oferings': [{ label: 'Oferecimentos', href: '/oferings', current: false }],
  '/scheduling': [
    { label: 'Agendamento', href: '/scheduling', current: false },
  ],
  '/public': [{ label: 'Público', href: '/public', current: false }],
};

const map: Record<string, Crumb[]> = {
  // Admin subpages
  '/admin/buildings': [
    ...mainMap['/admin'],
    { label: 'Prédios', href: '/admin/buildings', current: false },
  ],
  '/admin/users': [
    ...mainMap['/admin'],
    { label: 'Usuários', href: '/admin/users', current: false },
  ],
  '/admin/sessions': [
    ...mainMap['/admin'],
    { label: 'Sessões de Usuários', href: '/admin/sessions', current: false },
  ],
  '/admin/groups': [
    ...mainMap['/admin'],
    { label: 'Grupos', href: '/admin/groups', current: false },
  ],
  '/admin/institutional-events': [
    ...mainMap['/admin'],
    {
      label: 'Eventos Institucionais',
      href: '/admin/institutional-events',
      current: false,
    },
  ],
  '/admin/courses': [
    ...mainMap['/admin'],
    { label: 'Cursos', href: '/admin/courses', current: false },
  ],
  '/admin/bug-reports': [
    ...mainMap['/admin'],
    {
      label: 'Relatórios de Erros',
      href: '/admin/bug-reports',
      current: false,
    },
  ],
  '/admin/feedbacks': [
    ...mainMap['/admin'],
    { label: 'Feedbacks', href: '/admin/feedbacks', current: false },
  ],

  // Profile subpages
  '/profile/timetable': [
    ...mainMap['/profile'],
    { label: 'Grade Horária', href: '/profile/timetable', current: false },
  ],
  '/profile/solicitations': [
    ...mainMap['/profile'],
    {
      label: 'Minhas Solicitações',
      href: '/profile/solicitations',
      current: false,
    },
  ],

  // Solicitations and Reservations
  '/scheduling/solicitations': [
    ...mainMap['/scheduling'],
    {
      label: 'Solicitações',
      href: '/scheduling/solicitations',
      current: false,
    },
  ],
  '/scheduling/reservations': [
    ...mainMap['/scheduling'],
    { label: 'Reservas', href: '/scheduling/reservation  s', current: false },
  ],

  // Oferings subpages
  '/oferings/classrooms': [
    ...mainMap['/oferings'],
    { label: 'Salas', href: '/oferings/classrooms', current: false },
  ],
  '/oferings/subjects': [
    ...mainMap['/oferings'],
    { label: 'Disciplinas', href: '/oferings/subjects', current: false },
  ],
  '/oferings/classes': [
    ...mainMap['/oferings'],
    { label: 'Turmas', href: '/oferings/classes', current: false },
  ],
  '/oferings/calendars': [
    ...mainMap['/oferings'],
    { label: 'Calendários', href: '/oferings/calendars', current: false },
  ],
  '/oferings/conflicts': [
    ...mainMap['/oferings'],
    { label: 'Conflitos', href: '/oferings/conflicts', current: false },
  ],
  '/oferings/reports': [
    ...mainMap['/oferings'],
    { label: 'Relatórios', href: '/oferings/reports', current: false },
  ],

  // Public subpages
  '/public/allocations': [
    ...mainMap['/public'],
    {
      label: 'Mapa de Salas',
      href: '/public/allocations',
      current: false,
    },
  ],
  '/public/find-exams': [
    ...mainMap['/public'],
    {
      label: 'Encontre suas provas',
      href: '/public/find-exams',
      current: false,
    },
  ],
  '/public/find-classes': [
    ...mainMap['/public'],
    {
      label: 'Encontre suas aulas',
      href: '/public/find-classes',
      current: false,
    },
  ],
};

const dynamicRoutes: Array<{
  pattern: RegExp;
  build: (pathname: string) => Crumb[];
}> = [
  {
    pattern: /^\/admin\/courses\/\d+\/curriculums$/,
    build: (pathname) => [
      ...mainMap['/admin'].map((crumb) => ({ ...crumb })),
      { label: 'Cursos', href: '/admin/courses', current: false },
      { label: 'Currículos', href: pathname, current: false },
    ],
  },
  {
    pattern: /^\/admin\/courses\/\d+\/curriculums\/\d+\/subjects$/,
    build: (pathname) => [
      ...mainMap['/admin'].map((crumb) => ({ ...crumb })),
      { label: 'Cursos', href: '/admin/courses', current: false },
      {
        label: 'Currículos',
        href: `/admin/courses/${pathname.split('/')[3]}/curriculums`,
        current: false,
      },
      { label: 'Disciplinas', href: pathname, current: false },
    ],
  },
];

function markCurrent(crumbs: Crumb[]): Crumb[] {
  return crumbs.map((crumb, index) => ({
    ...crumb,
    current: index === crumbs.length - 1,
  }));
}

export function getBreadcrumbsFromPath(pathname: string): Crumb[] {
  const dynamicRoute = dynamicRoutes.find(({ pattern }) =>
    pattern.test(pathname),
  );
  if (dynamicRoute) {
    return markCurrent(dynamicRoute.build(pathname));
  }

  if (mainMap[pathname]) {
    return markCurrent(mainMap[pathname].map((crumb) => ({ ...crumb })));
  }
  if (map[pathname]) {
    return markCurrent(map[pathname].map((crumb) => ({ ...crumb })));
  }

  return [{ label: 'Página Não Encontrada', href: '/404', current: false }];
}

function PageBreadcrumb({ items, pathname }: PageBreadcrumbProps) {
  const navigate = useNavigate();
  const itemsToRender: Crumb[] = items ?? getBreadcrumbsFromPath(pathname);

  if (!itemsToRender || itemsToRender.length === 0) return null;

  return (
    <Breadcrumb color={'white'} separator={<ChevronRightIcon color='white' />}>
      {itemsToRender.map((item, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink
            href={item.href}
            onClick={(event) => {
              event.preventDefault();
              navigate(item.href);
            }}
            isCurrentPage={!!item.current}
            fontWeight={item.current ? 'bold' : undefined}
          >
            {item.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}

export default PageBreadcrumb;
