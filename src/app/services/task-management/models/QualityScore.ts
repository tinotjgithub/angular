export interface QualityScore {
  auditCompletedCount: any;
  statusCountDtos: [
    {
      status: string;
      count: number;
    }
  ];
}
