import { useMediaQuery } from '@chakra-ui/react';

import AllocationMobileHeader from './AllocationMobileHeader/mobile.header';
import AllocationDesktopHeader from './AllocationDesktopHeader/desktop.header';
import { Event, Resource } from '../interfaces/allocation.interfaces';
import { SubjectResponse } from '../../../models/http/responses/subject.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';

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

  subjects: SubjectResponse[];
  loadingSubjects: boolean;

  buildings: BuildingResponse[];
  loadingBuildings: boolean;
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
  subjects,
  loadingSubjects,
  buildings,
  loadingBuildings,
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
      subjects={subjects}
      loadingSubjects={loadingSubjects}
      buildings={buildings}
      loadingBuildings={loadingBuildings}
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
      subjects={subjects}
      loadingSubjects={loadingSubjects}
      buildings={buildings}
      loadingBuildings={loadingBuildings}
    />
  );
}

export default AllocationHeader;
