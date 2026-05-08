import { SimpleGrid } from '@chakra-ui/react';
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

function HubPageGrid({ columns = 3, items }: HubPageGridProps) {
  return (
    <SimpleGrid columns={columns} spacing={'2rem'}>
      {items.map((item, index) => (
        <HubCard key={index} {...item} />
      ))}
    </SimpleGrid>
  );
}

export default HubPageGrid;
