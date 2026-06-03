import { SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import HubCard from './HubCard/HubCard';

export interface HubPageGridItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  pageCount?: number;
  disabled?: boolean;
  onClick: () => void;
}

export interface HubPageGridProps {
  columns?: number;
  items: HubPageGridItem[];
}

function HubPageGrid({ columns = 4, items }: HubPageGridProps) {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [isTablet] = useMediaQuery('(max-width: 1024px)');

  function getResponsiveColumns() {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return columns;
  }

  function getPadding() {
    if (isMobile) return '0rem 1rem';
    if (isTablet) return '0rem 2rem';
    if (items.length <= 3) return '0rem 20rem';
    if (items.length > 3 && items.length < 7) return '0rem 5rem';
    return '0rem 2rem';
  }

  function getSpacing() {
    return isMobile ? '1rem' : '2rem';
  }

  return (
    <SimpleGrid
      columns={getResponsiveColumns()}
      spacing={getSpacing()}
      padding={getPadding()}
    >
      {items.map((item, index) => (
        <HubCard key={index} {...item} />
      ))}
    </SimpleGrid>
  );
}

export default HubPageGrid;
