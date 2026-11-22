import { UserResponse } from '../../models/http/responses/user.response.models';
import CommonValidator from '../../utils/common/common.validator';

// Form validators only. Access (what the user can see and do) is read from
// GET /users/my-access, through src/utils/access/access.ts.
export class UsersValidator extends CommonValidator {
  static isInvalidName(name: string) {
    return this.isEmptyString(name);
  }
  static isAdmin(user: UserResponse | null) {
    return user ? user.is_admin : false;
  }
}
