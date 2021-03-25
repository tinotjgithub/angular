export interface ProductivitySchedule {
  userProductivityDto: [
    {
      hour: number;
      claimCount: number;
      target: number;
    }
  ];
}
