
export interface DrawClaim {
  claimId: string;
  claimFactKey: number;
  taskId: number;
  claimReceivedDate: Date;
  age: number;
  status: string;
  queueName: string;
  endTimer: string;
  pendReason: string;
  routeReason: string;
  firstPendDate: Date;
  lastPendDate: Date;
  comments: string;
  taskAssignmentId?: number;
}
