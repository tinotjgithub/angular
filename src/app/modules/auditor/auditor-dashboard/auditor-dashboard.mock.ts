export const auditsummary = {
  auditSummaryDtos: [
    {
      startDate: "2020-05-28",
      endDate: "2020-05-28",
      passedAuditCount: 1,
      failedAuditCount: 0
    },
    {
      startDate: "2020-04-29",
      endDate: "2020-05-28",
      passedAuditCount: 1,
      failedAuditCount: 1
    },
    {
      startDate: "2020-05-04",
      endDate: "2020-05-28",
      passedAuditCount: 1,
      failedAuditCount: 0
    },
    {
      startDate: "2020-05-05",
      endDate: "2020-05-28",
      passedAuditCount: 2,
      failedAuditCount: 1
    }
  ]
};

export const auditProductivityScore = {
  userProductivityDto: [
    { hour: 9, claimCount: 0 },
    { hour: 10, claimCount: 2 },
    { hour: 11, claimCount: 1 },
    { hour: 12, claimCount: 0 },
    { hour: 13, claimCount: 1 },
    { hour: 14, claimCount: 0 },
    { hour: 15, claimCount: 0 },
    { hour: 16, claimCount: 0 },
    { hour: 17, claimCount: 0 },
    { hour: 18, claimCount: 0 },
    { hour: 19, claimCount: 0 },
    { hour: 20, claimCount: 0 }
  ]
};
export const auditTypeStatus = {
  auditStatusScoreDto: [
    {
      denied: 0,
      checkIssued: 2,
      checkNotIssued: 0,
      claimType: "Institutional IP"
    },
    {
      denied: 2,
      checkIssued: 0,
      checkNotIssued: 0,
      claimType: "Institutional OP"
    },
    { denied: 2, checkIssued: 2, checkNotIssued: 0, claimType: "Others" },
    { denied: 2, checkIssued: 0, checkNotIssued: 2, claimType: "Professional" }
  ]
};

const today = new Date();
export const auditDetails = {
  auditDates: [today, today]
};

export const auditQueueCount = {
  auditQueueCountDtos: [
    {
      queueName: "hcc_super_user",
      auditedClaimsCount: 5
    },
    {
      queueName: "Itemized Bill WB",
      auditedClaimsCount: 3
    }
  ]
};

export const failedExaminers: any = {
  userAuditScoreDto: [
    {
      examinerName: "Manju Varghese",
      failedAuditCount: 2
    },
    {
      examinerName: "Jim Tom",
      failedAuditCount: 1
    }
  ]
};
