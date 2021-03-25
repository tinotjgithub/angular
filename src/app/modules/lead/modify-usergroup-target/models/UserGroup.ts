export default interface UserGroup {
  groupId: number;
  groupName: string;
  description: string;
  leadUserMaster: LeadUserMaster;
  managerUserMaster: ManagerUserMaster;
  queueName: QueueName;
  target: number;
  userGroupType: UserGroupType;
}

interface LeadUserMaster {
  name?: string;
  id: number;
}

interface ManagerUserMaster {
  name?: string;
  id: number;
}

interface QueueName {
  queuename?: string;
  queueId: number;
}

interface UserGroupType {
  name?: string;
  id: number;
}
