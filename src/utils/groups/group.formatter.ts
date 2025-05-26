import { GroupResponse } from '../../models/http/responses/group.response.models';
import { UserGroupResponse } from '../../models/http/responses/user.response.models';

class GroupFormatter {
  static getGroupName(group: UserGroupResponse | GroupResponse): string {
    return group.main ? `⭐ ${group.name}` : group.name;
  }
}

export default GroupFormatter;
