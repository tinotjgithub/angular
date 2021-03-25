export default interface AuditClaim {
  billedAmount: number;
  claimId: string;
  claimSource: string;
  claimType: string;
  entryDate: Date;
  finalizedBy: string;
  finalizedDate: Date;
  receiptDate: Date;
  reviewRepairReason: string;
  state: string;
  taskAssignmentId: number;
  workBasketName: string;
  action: string;
  comments: string;
}
