export const statusByError = {
  auditClaimCountDto: [
    {
      status: "Financial",
      claimCount: 5
    },
    {
      status: "Procedural",
      claimCount: 5
    },
    {
      status: "Both",
      claimCount: 6
    }
  ]
};

export const statusByAmt = {
  auditClaimCountDto: [
    {
      status: "Under Paid",
      claimCount: 2
    },
    {
      status: "Over Paid",
      claimCount: 10
    }
  ]
};

export const samplingByMethod = {
  auditClaimCountDto: [
    {
      status: "Manual",
      claimCount: 4
    },
    {
      status: "Auto",
      claimCount: 5
    },
    {
      status: "Auditor",
      claimCount: 3
    }
  ]
};

export const auditStatus = {
  auditClaimCountDto: [
    {
      status: "Passed",
      claimCount: 4
    },
    {
      status: "Assigned",
      claimCount: 15
    },
    {
      status: "Initialized",
      claimCount: 1
    },
    {
      status: "Failed",
      claimCount: 13
    }
  ]
};

export const auditAdj = {
  auditClaimCountDto: [
    {
      status: "Auto",
      claimCount: 2
    },
    {
      status: "Manual",
      claimCount: 31
    }
  ]
};

export const billedAmt = {
  auditReportBilledAmountByClaimTypeDtoList: [
    {
      billedAmtStart: 0,
      billedAmtEnd: 5000,
      professional: 4,
      institutionalIP: 4,
      institutionalOP: 5,
      others: 7
    },
    {
      billedAmtStart: 0,
      billedAmtEnd: 5000,
      professional: 4,
      institutionalIP: 4,
      institutionalOP: 5,
      others: 4
    },
    {
      billedAmtStart: 0,
      billedAmtEnd: 5000,
      professional: 4,
      institutionalIP: 4,
      institutionalOP: 5,
      others: 2
    },
    {
      billedAmtStart: 0,
      billedAmtEnd: 5000,
      professional: 4,
      institutionalIP: 4,
      institutionalOP: 5,
      others: 0
    },
    {
      billedAmtStart: 0,
      billedAmtEnd: 5000,
      professional: 4,
      institutionalIP: 4,
      institutionalOP: 5,
      others: 6
    }
  ]
};

export const billedAmtSampling = {
  auditReportBilledAmountDtos: [
    {
      billedAmtStart: "0",
      billedAmtEnd: "5000",
      claimCount: 33
    },
    {
      billedAmtStart: "5001",
      billedAmtEnd: "10000",
      claimCount: 55
    },
    {
      billedAmtStart: "10001",
      billedAmtEnd: "15000",
      claimCount: 77
    },
    {
      billedAmtStart: "15001",
      billedAmtEnd: "20000",
      claimCount: 12
    },
    {
      billedAmtStart: "20001",
      billedAmtEnd: "25000",
      claimCount: 55
    },
    {
      billedAmtStart: "",
      billedAmtEnd: ">30000",
      claimCount: 662
    }
  ]
};

export const samplingCategory = {
  auditReportBarChartMaps: [
    {
      claimType: "Check Issued",
      Professional: 9,
      InstitutionalOP: 12,
      InstitutionalIP: 1,
      Others: 0
    },
    {
      claimType: "Check Not Issued",
      Professional: 5,
      InstitutionalOP: 3,
      InstitutionalIP: 3,
      Others: 0
    }
  ]
};

export const samplingParameters = {
  claimSource: [
    {
      id: 0,
      name: "Paper"
    },
    {
      id: 1,
      name: "EDI"
    }
  ],
  samplingCategory: [
    {
      id: 0,
      name: "Manual"
    }
  ],
  lineOfBusiness: [
    {
      id: 0,
      name: "Commercial"
    },
    {
      id: 1,
      name: "Medicare"
    },
    {
      id: 2,
      name: "Government Programs"
    }
  ],
  paymentStatus: [
    {
      id: 0,
      name: "Check Issued"
    },
    {
      id: 1,
      name: "Check Not Issued"
    }
  ],
  processWorkflow: [
    {
      id: 0,
      name: "Auto"
    },
    {
      id: 1,
      name: "Manual"
    }
  ]
};

export const auditDates = {
  auditDates: [
    "Sat Jul 11 2020 18:40:38 GMT+0530 (India Standard Time)",
    "Mon Aug 10 2020 18:40:38 GMT+0530 (India Standard Time)"
  ]
};

export const mockReport: any = {
  body: Blob,
  size: 0,
  type: "application/json"
};
