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
  '/allocation': [{ label: 'Mapa de Salas', href: '/allocations', current: false }],
  '/admin': [{ label: 'Admin', href: '/admin', current: false }],
  '/restricted': [{ label: 'Restrito', href: '/restricted', current: false }],
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
  // Public subpages
  '/public/find-exams': [
    ...mainMap['/public'],
    {
      label: 'Encontre suas provas',
      href: '/public/find-exams',
      current: false,
    },
  ],
  // Solicitations and Reservations
  '/restricted/solicitations': [
    ...mainMap['/restricted'],
    {
      label: 'Solicitações',
      href: '/restricted/solicitations',
      current: false,
    },
  ],
  '/reservas': [{ label: 'Reservas', href: '/reservas', current: false }],
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
