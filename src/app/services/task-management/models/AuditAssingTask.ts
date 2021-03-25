export default interface AssignAuditTask {
  auditTaskId: number;
  auditorAction: string;
  auditorComments: string;
  auditorID: number;
  createdAt: Date;
  auditorPrimaryEmail: string;
  processorPrimaryEmail: string;
  processorAction: string;
  processorComments: string;
  processorId: number;
  taskAssignmentId: number;
  verificationCriteria: string;
}
