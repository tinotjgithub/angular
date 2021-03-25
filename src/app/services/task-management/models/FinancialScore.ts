export interface FinancialScore {
  financialAccuracyDtos: [
    {
      monthStartDate: string;
      financialAccuracy: number;
      target: number;
    }
  ];
}
