export interface ModifyUserTargetModel {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    userName: string;
    communicationEmail: string;
    role: string;
    status: string;
    activeDate: string;
    deactivateDate: string;
    ldapOrLocal: string;
    userGroupId: number;
    userGroupName: string;
    leadName: string;
    managerName: string;
    target: number;
}
