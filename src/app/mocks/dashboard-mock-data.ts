import { StatusDate } from "./../services/task-management/models/StatusDate";
import { ProductivitySchedule } from "./../services/task-management/models/ProductivitySchedule";
import { QualityScore } from "./../services/task-management/models/QualityScore";
import { ProceduralScore } from "./../services/task-management/models/ProceduralScore";
import { FinancialScore } from "./../services/task-management/models/FinancialScore";

export const statusDate: StatusDate = {
  userStatusDtos: [
    {
      status: "Routed Out",
      claimCount: 6
    }
  ]
};

export const prodVolSts: any = [
  {
    status: "Routed Out",
    requestCount: 7
  },
  {
    status: "Completed",
    requestCount: 10
  },
  {
    status: "Pended",
    requestCount: 3
  }
];

export const auditTransCat: any = {
  userStatusDtos: [
    {
      status: "Address Change",
      claimCount: 10
    },
    { status: "Name Correction", claimCount: 43 },
    { status: "Gender Correction", claimCount: 30 },
    { status: "Plan Correction", claimCount: 20 },
    { status: "Demographic Change", claimCount: 15 },
    { status: "Termination", claimCount: 11 }
  ]
}

export const mockReport: any = {
  body: Blob,
  size: 0,
  type: "application/json"
};

export const auditStatusDetails: any = [
  {
    claimId: "20190403000016",
    auditStatus: "PASSED",
    auditorName: "Brian Blaze",
    examinerName: "Devika Kumari",
    auditDate: "10/28/2020",
    claimType: "Institutional-IP",
    claimStatus: "Final",
    billedAmount: 15000,
    allowedAmount: 10500,
    paidAmount: 10500,
    processedDate: "08/24/2020"
  }
];

export const productivitySchedule: ProductivitySchedule = {
  userProductivityDto: [
    {
      hour: 5,
      claimCount: 2,
      target: 10
    }
  ]
};

export const catDetails = [
  {
    paymentStatus: "Check",
    claimId: "20190424000001",
    billedAmount: 100.0,
    allowedAmount: 70.0,
    paidAmount: 70.0,
    claimStatus: "Final",
    adjudicationType: "Auto Adjudicated"
  }
];

export const auditorClaimsAuditDetails = [
  {
    claimQueueName: null,
    claimId: "20180101000008",
    auditStatus: null,
    auditorName: "Brian Blaze",
    examinerName: "Devika Kumari",
    claimType: "Institutional-OP",
    billedAmount: 200.0,
    allowedAmount: 0.0,
    paidAmount: 0.0,
    processedDate: "09/02/2020",
    claimStatus: "Denied",
    auditDate: "09/21/2020",
    paymentStatus: null,
    claimSource: "EDI",
    adjudicationType: null,
    assignType: null,
    assignDate: null,
    receiptDate: "01/01/2018",
    claimAge: 1046,
    userGroupName: "Authorization_Group",
    errorType: null,
    errorDescription: null,
    financialImpact: "Over Paid",
    amount: 20.0
  },
  {
    claimQueueName: null,
    claimId: "20190101000007",
    auditStatus: null,
    auditorName: "Brian Blaze",
    examinerName: "Devika Kumari",
    claimType: "Institutional-OP",
    billedAmount: 200.0,
    allowedAmount: 0.0,
    paidAmount: 0.0,
    processedDate: "09/17/2020",
    claimStatus: "Denied",
    auditDate: null,
    paymentStatus: null,
    claimSource: "EDI",
    adjudicationType: null,
    assignType: null,
    assignDate: null,
    receiptDate: "01/01/2020",
    claimAge: 316,
    userGroupName: "HR_Manager_Group",
    errorType: null,
    errorDescription: null,
    financialImpact: null,
    amount: null
  }
];

export const typeSts = [
  {
    claimQueueName: "Auto Adjudicated",
    claimId: "20190101000024",
    auditStatus: "Passed",
    auditorName: "Brian Blaze",
    examinerName: null,
    claimType: "Institutional-OP",
    billedAmount: 200.0,
    allowedAmount: 0.0,
    paidAmount: 0.0,
    processedDate: "08/27/2020",
    claimStatus: "Denied",
    auditDate: "09/02/2020"
  },
  {
    claimQueueName: "Auto Adjudicated",
    claimId: "20190101000025",
    auditStatus: "Failed",
    auditorName: "Brian Blaze",
    examinerName: "Devika Kumari",
    claimType: "Institutional-OP",
    billedAmount: 100.0,
    allowedAmount: 0.0,
    paidAmount: 0.0,
    processedDate: "08/27/2020",
    claimStatus: "Denied",
    auditDate: "09/02/2020"
  }
];

export const openInvThrasholdGrid = [
  {
    allowedAmount: 0,
    billedAmount: 20000,
    claimAge: 229,
    claimId: "20200318000002",
    claimType: "Professional",
    id: 234,
    memberGroupName: null,
    nearingSlaDays: -202,
    paidAmount: null,
    providerName: "Supplier_UST44",
    status: "PENDED",
    thresholdTime: -44,
    userGroupName: "Super Group"
  },
  {
    allowedAmount: 0,
    billedAmount: 2000,
    claimAge: 229,
    claimId: "20200318000006",
    claimType: "Professional",
    id: 235,
    memberGroupName: null,
    nearingSlaDays: -202,
    paidAmount: 0,
    providerName: "Supplier_UST44",
    status: "PENDED",
    thresholdTime: -44,
    userGroupName: "Hcc_Super_User"
  }
];

export const openInventry: any = {
  claimsInventoryDto: [
    { age: "<0", count: 51 },
    { age: "0-2", count: 76 },
    { age: "3-5", count: 77 },
    { age: "6-8", count: 33 },
    { age: "9-11", count: 70 },
    { age: "12-14", count: 55 },
    { age: "15-17", count: 66 },
    { age: "18-20", count: 43 },
    { age: "24-26", count: 22 },
    { age: "27-29", count: 33 },
    { age: ">30", count: 111 }
  ],
  target: [
    { month: "2020-10-01", target: 44 },
    { month: "2020-11-01", target: 45 }
  ]
};

export const teamProductivitySchedule: any = {
  userProductivityDto: [
    {
      hour: 0,
      claimCount: 0,
      target: 2
    },
    {
      hour: 1,
      claimCount: 0,
      target: 2
    },
    {
      hour: 2,
      claimCount: 0,
      target: 2
    },
    {
      hour: 3,
      claimCount: 0,
      target: 2
    },
    {
      hour: 4,
      claimCount: 0,
      target: 2
    },
    {
      hour: 5,
      claimCount: 0,
      target: 2
    }
  ]
};

export const qualityScore: any = {
  userAuditScoreDto: [
    {
      startDate: "2020-01-07",
      completedAuditCount: 3,
      failedAuditCount: 1
    }
  ]
};

export const procScore: ProceduralScore = {
  proceduralAccuracyDtoList: [
    {
      monthStartDate: "2020-01-07",
      proceduralErrorCount: 5,
      totalAuditedClaims: 15,
      proceduralAccuracyPct: 40,
      target: 50
    }
  ]
};

export const finScore: FinancialScore = {
  financialAccuracyDtos: [
    {
      monthStartDate: "2020-01-07",
      financialAccuracy: 46,
      target: 50
    }
  ]
};

export const managerClaimsCountByStatus: any = {
  queueId: 12,
  queueName: "Medi Care"
};

export const qeues: any = [
  {
    queueId: 12,
    name: "Medi Care"
  }
];

export const managerQueues = [
  {
    queueName: "High Dollar WB",
    queueId: 2
  },
  {
    queueName: "Itemized Bill WB",
    queueId: 1
  }
];

export const leadQueues = [
  {
    queueName: "High Dollar WB",
    queueId: 2
  },
  {
    queueName: "Itemized Bill WB",
    queueId: 1
  }
];

export const managerQueueDates = [
  {
    managerStatusScoreDto: {
      Completed: 7,
      Assigned: 3,
      ToDo: 5,
      quename: "High Dollar WB",
      Pended: 21
    }
  }
];

export const leadQueueDates = [
  {
    leadStatusScoreDto: {
      Completed: 7,
      Assigned: 3,
      ToDo: 5,
      quename: "High Dollar WB",
      Pended: 21
    }
  }
];

export const managerQueueNames: any = [
  {
    value: 11,
    label: "Medi Care"
  },
  {
    value: 13,
    label: "PHP"
  }
];

export const managerStatus: any = [
  {
    action: "ToDo"
  },
  {
    action: "Pended"
  },
  {
    action: "RoutedIn"
  },
  {
    action: "Completed"
  },
  {
    action: "RoutedOut"
  }
];

export const leadStatus: any = [
  {
    action: "ToDo"
  },
  {
    action: "Pended"
  },
  {
    action: "RoutedIn"
  },
  {
    action: "Completed"
  },
  {
    action: "RoutedOut"
  }
];

export const leadClaimsCountByVol: any = [
  {
    claimVolumeByAge: {
      COMPLETED: 1,
      age: "50-56"
    }
  },
  {
    claimVolumeByAge: {
      COMPLETED: 3,
      age: ">64",
      PENDED: 2
    }
  }
];

export const managerClaimsCountByVol: any = [
  {
    claimVolumeByAge: {
      COMPLETED: 1,
      age: "50-56"
    }
  },
  {
    claimVolumeByAge: {
      COMPLETED: 3,
      age: ">64",
      PENDED: 2
    }
  }
];

export const managerExaminerCountByStatus: any = [
  {
    count: 20,
    lead: "Manju Vargeese"
  },
  {
    count: 50,
    lead: "Brian Blaze"
  },
  {
    count: 11,
    lead: "Deepa John"
  },
  {
    count: 12,
    lead: "Manu Manoharan"
  }
];

export const leadClaimsCountByStatus: any = [
  {
    leadStatusScoreDto: {
      Completed: 7,
      Assigned: 3,
      ToDo: 5,
      quename: "High Dollar WB",
      Pended: 21
    }
  }
];

export const leadUserGroups: any = [
  {
    groupId: 1,
    groupName: "Group A"
  },
  {
    groupId: 2,
    groupName: "Group B"
  }
];

export const managerEXaminers: any = [
  {
    examinerId: 7,
    examinerName: "Devika Kumari"
  },
  {
    examinerId: 10,
    examinerName: "Megha Murali"
  },
  {
    examinerId: 125,
    examinerName: "John Mathew"
  }
];

export const managerTenExaminers: any = [
  {
    examinerId: 7,
    examinerName: "Santosh"
  },
  {
    examinerId: 10,
    examinerName: "Saudhamini"
  },
  {
    examinerId: 125,
    examinerName: "Abhinaya"
  },
  {
    examinerId: 7,
    examinerName: "Dhanya"
  },
  {
    examinerId: 10,
    examinerName: "Brian"
  },
  {
    examinerId: 125,
    examinerName: "Manju"
  },
  {
    examinerId: 7,
    examinerName: "Devika"
  },
  {
    examinerId: 10,
    examinerName: "Megha Murali"
  },
  {
    examinerId: 125,
    examinerName: "Roy"
  },
  {
    examinerId: 7,
    examinerName: "Deepa"
  },
  {
    examinerId: 10,
    examinerName: "Manu"
  }
];

export const passedVsFailed = {
  userAuditScoreDto: [
    {
      examinerId: 7,
      examinerName: "Devika Kumari",
      passedAuditCount: 16,
      failedAuditCount: 8
    },
    {
      examinerId: 125,
      examinerName: "John Mathew",
      passedAuditCount: 1,
      failedAuditCount: 1
    }
  ]
};

export const userGroupNames: any = [
  { code: "Group B", id: 2, name: "Group B" },
  { code: "Group A", id: 1, name: "Group A" }
];

export const userGroups: any = [
  { groupId: 1, groupName: "Group A" },
  { groupId: 2, groupName: "Group B" }
];

export const auditStatus: any = {
  userAuditScoreDto: [
    {
      failedAuditCount: 4,
      leadId: 6,
      leadName: "Devika M",
      passedAuditCount: 11
    },
    {
      failedAuditCount: 0,
      leadId: 7,
      leadName: "Brian Blaze",
      passedAuditCount: 0
    }
  ]
};

export const processedVsAudited: any = {
  processedCount: 18,
  userProcessedDtos: [
    {
      claimCount: 8,
      status: "Audited"
    },
    {
      claimCount: 10,
      status: "Not Audited"
    }
  ]
};
