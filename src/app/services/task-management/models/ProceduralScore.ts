export interface ProceduralScore {
  proceduralAccuracyDtoList: [
    {
      monthStartDate: string;
      proceduralErrorCount: number;
      totalAuditedClaims: number;
      proceduralAccuracyPct: number;
      target: number;
    }
  ];
}
