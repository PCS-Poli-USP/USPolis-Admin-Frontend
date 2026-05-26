import { RoleResponse } from '../../../../models/http/responses/role.response.models';

interface RoleCardProps {
  role: RoleResponse;
}

function RoleCard({ role }: RoleCardProps) {
  return <div>RoleCard</div>;
}

export default RoleCard;
