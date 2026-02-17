import {
  Accordion,
  Alert,
  AlertIcon,
  AlertTitle,
  Skeleton,
} from '@chakra-ui/react';
import ClassroomPermissionAccordionItem from './classroom.permission.accordion.item';
import { UserCoreResponse } from '../../../../models/http/responses/user.response.models';
import { ClassroomPermissionByClassroomResponse } from '../../../../models/http/responses/classroomPermission.response.models';

interface ClassroomPermissionAccordionProps {
  users: UserCoreResponse[];
  permissionsByClassroom: ClassroomPermissionByClassroomResponse[];
  refetch: () => void;
  loading: boolean;
}

function ClassroomPermissionAccordion({
  users,
  permissionsByClassroom,
  refetch,
  loading,
}: ClassroomPermissionAccordionProps) {
  return (
    <Accordion
      allowMultiple
      borderWidth={'1px'}
      borderColor={'uspolis.blue'}
      defaultIndex={[0]}
    >
      {permissionsByClassroom.length === 0 && (
        <Alert status='warning'>
          <AlertIcon />
          <AlertTitle>Nenhuma sala restrita encontrada.</AlertTitle>
        </Alert>
      )}

      <Skeleton isLoaded={!loading}>
        {permissionsByClassroom.map((permissions) => (
          <ClassroomPermissionAccordionItem
            key={permissions.classroom_id}
            users={users}
            classroomPermissions={permissions}
            loading={loading}
            refetch={refetch}
          />
        ))}
      </Skeleton>
    </Accordion>
  );
}

export default ClassroomPermissionAccordion;
