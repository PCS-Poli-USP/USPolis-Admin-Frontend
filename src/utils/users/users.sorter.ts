import { UserCoreResponse } from '../../models/http/responses/user.response.models';

export function sortUsersResponse(A: UserCoreResponse, B: UserCoreResponse) {
  if (A.name < B.name) return -1;
  if (A.name > B.name) return 1;
  return 0;
}
