import { useMediaQuery } from '@chakra-ui/react';

import AllocationMobileHeader from './AllocationMobileHeader/mobile.header';
import AllocationDesktopHeader from './AllocationDesktopHeader/desktop.header';
import { Event, Resource } from '../interfaces/allocation.interfaces';

export interface AllocationHeaderProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  buildingSearchValue: string;
  setBuildingSearchValue: (value: string) => void;

  classroomSearchValue: string;
  setClassroomSearchValue: (value: string) => void;

  nameSearchValue: string;
  setNameSearchValue: (value: string) => void;

  classSearchValue: string;
  setClassSearchValue: (value: string) => void;

  events: Event[];
  buildingResources: Resource[];
  classroomResources: Resource[];
}

function AllocationHeader({
  isOpen,
  onOpen,
  onClose,
  buildingSearchValue,
  setBuildingSearchValue,
  classroomSearchValue,
  setClassroomSearchValue,
  nameSearchValue,
  setNameSearchValue,
  classSearchValue,
  setClassSearchValue,
  events,
  buildingResources,
  classroomResources,
}: AllocationHeaderProps) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  return isMobile ? (
    <AllocationMobileHeader
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      buildingSearchValue={buildingSearchValue}
      setBuildingSearchValue={setBuildingSearchValue}
      classroomSearchValue={classroomSearchValue}
      setClassroomSearchValue={setClassroomSearchValue}
      nameSearchValue={nameSearchValue}
      setNameSearchValue={setNameSearchValue}
      classSearchValue={classSearchValue}
      setClassSearchValue={setClassSearchValue}
      events={events}
      buildingResources={buildingResources}
      classroomResources={classroomResources}
    />
  ) : (
    <AllocationDesktopHeader
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      buildingSearchValue={buildingSearchValue}
      setBuildingSearchValue={setBuildingSearchValue}
      classroomSearchValue={classroomSearchValue}
      setClassroomSearchValue={setClassroomSearchValue}
      nameSearchValue={nameSearchValue}
      setNameSearchValue={setNameSearchValue}
      classSearchValue={classSearchValue}
      setClassSearchValue={setClassSearchValue}
      events={events}
      buildingResources={buildingResources}
      classroomResources={classroomResources}
    />
  );
}

export default AllocationHeader;
