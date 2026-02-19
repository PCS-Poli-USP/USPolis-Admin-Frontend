import { UserSessionResponse } from '../../models/http/responses/userSession.response.models';

export function sortUserSessionResponse(
  A: UserSessionResponse,
  B: UserSessionResponse,
) {
  const dateA = new Date(A.created_at);
  const dateB = new Date(B.created_at);
  return dateB.getTime() - dateA.getTime();
}
