import {
  Accordion,
  Alert,
  AlertIcon,
  AlertTitle,
  Skeleton,
} from '@chakra-ui/react';
import { ClassroomPermissionByUserResponse } from '../../../../models/http/responses/classroomPermission.response.models';
import UserClassroomPermissionAccordionItem from './user.classroom.permission.accordion.item';
import { ClassroomResponse } from '../../../../models/http/responses/classroom.response.models';

interface UserClassroomPermissionAccordionProps {
  classrooms: ClassroomResponse[];
  permissionsByUser: ClassroomPermissionByUserResponse[];
  refetch: () => void;
  loading: boolean;
}

function UserClassroomPermissionAccordion({
  classrooms,
  permissionsByUser,
  refetch,
  loading,
}: UserClassroomPermissionAccordionProps) {
  return (
    <Accordion
      allowMultiple
      borderWidth={'1px'}
      borderColor={'uspolis.blue'}
      defaultIndex={[0]}
    >
      {permissionsByUser.length === 0 && (
        <Alert status='warning'>
          <AlertIcon />
          <AlertTitle>Nenhum usuário selecionado.</AlertTitle>
        </Alert>
      )}

      <Skeleton isLoaded={!loading}>
        {permissionsByUser.map((permissions) => (
          <UserClassroomPermissionAccordionItem
            key={permissions.user_id}
            classrooms={classrooms}
            userPermissions={permissions}
            loading={loading}
            refetch={refetch}
          />
        ))}
      </Skeleton>
    </Accordion>
  );
}

export default UserClassroomPermissionAccordion;
