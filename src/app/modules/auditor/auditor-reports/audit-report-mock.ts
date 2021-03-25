export const mockReport: any = {
  body: Blob,
  size: 0,
  type: "application/json"
};

export const auditReport = {
  auditReportDtoList: [
    {
      claimId: "20180731000391",
      claimType: "Institutional IP",
      claimStatus: "Final",
      receiptDate: "2020-02-11",
      age: 91
    },
    {
      claimId: "20180731000391",
      claimType: "Institutional IP",
      claimStatus: "Final",
      receiptDate: "2020-02-11",
      age: 91
    },
    {
      claimId: "20180731000391",
      claimType: "Institutional IP",
      claimStatus: "Final",
      receiptDate: "2020-02-11",
      age: 91
    },
    {
      claimId: "20180731000391",
      claimType: "Institutional IP",
      claimStatus: "Final",
      receiptDate: "2020-02-11",
      age: 91
    }
  ],
  failed: 0,
  passed: 1
};

export const auditBacklogReport = {
  uditBacklogReportDtoList: [
    {
      claimId: "20180731000341",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "2020-10-01",
      age: -142
    },
    {
      claimId: "20180731000341",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "2020-10-01",
      age: -142
    }
  ],
  pendedCount: 1,
  reassignedCount: 1,
  savedCount: 1,
  totalCount: 3
};

export const auditRebuttalReport = {
  auditRebuttalReportDtoList: [
    {
      claimId: "20180731000391",
      claimType: "Institutional IP",
      claimStatus: "Final",
      receiptDate: "2020-02-11",
      age: 91
    },
    {
      claimId: "20180731000341",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "2020-10-01",
      age: -142
    }
  ],
  auditorAccepted: 2,
  examinerAccepted: 2,
  firstLevel: 1,
  secondLevel: 1,
  thirdLevel: 1,
  total: 3
};

export const auditClaimsReport = {
  auditClaimsReportDtoList: [
    {
      claimId: "20200204000003",
      claimType: "Institutional-OP",
      providerName: "Supplier_UST51",
      memberGroupName: "BB Account 1 - Active",
      billedAmount: 2000,
      processedDate: "05/18/2020",
      examinerName: "Devika Kumar",
      processWorkflow: "Manual",
      errorType: "Both",
      financialImpact: "Over Paid",
      amountAudit: 20,
      assignmentType: "Auto",
      status: "Failed",
      auditorName: "Brian Blaze",
      auditDate: "06/17/2020",
      userGroupName: "Hcc_Super_User",
      samplingMethod: "Auto",
      claimSource: "EDI",
      lineOfBusiness: "Commercial",
      planType: "HMO",
      memberGroupCode: 10,
      paymentStatus: "Check Issued",
      procedureCode: "POC1",
      diagnosisCode: "DOC1"
    },
    {
      claimId: "20191218000211",
      claimType: "Institutional-IP",
      providerName: "BB 1 Supplier",
      memberGroupName: "BB2 CarePlus Account",
      billedAmount: 190800,
      processedDate: "05/18/2020",
      examinerName: "Devika Kumar",
      processWorkflow: "Manual",
      errorType: "Financial",
      financialImpact: "Over Paid",
      amountAudit: 20,
      assignmentType: null,
      status: "Failed",
      auditorName: "Brian Blaze",
      auditDate: "06/17/2020",
      userGroupName: "Hcc_Super_User",
      samplingMethod: null,
      claimSource: "EDI",
      lineOfBusiness: "Commercial",
      planType: "HMO",
      memberGroupCode: null,
      paymentStatus: "Check Not Issued",
      procedureCode: null,
      diagnosisCode: null
    }
  ],
  passedCount: 4,
  failedCount: 13,
  totalCount: 17
};

export const auditSamplingReport = [
  {
    claimId: 20190827000005,
    deletedDate: "08/10/2020",
    deletedUserName: "Brian Blaze",
    deleteComments: "Too much claims"
  }
];

export const userRoles = [
  {
    value: 5,
    label: "Claims Auditor"
  },
  {
    value: 3,
    label: "Claims Lead"
  },
  {
    value: 2,
    label: "Manager"
  }
];

export const deletedBy = [
  {
    value: 118,
    label: "George Floyd"
  },
  {
    value: 123,
    label: "Tony Stark"
  },
  {
    value: 107,
    label: "Brian Blaze"
  }
];
