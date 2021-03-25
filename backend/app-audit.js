const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  req.header("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/api/audit/home/dashboard/queue/summary", (req, res, next) => {
  res.status(200).json({
    todayQueue: 0,
    backlog: 2,
    rebuttalQueue: 0
  });
});

app.get("/api/audit/home/dashboard/status", (req, res, next) => {
  res.status(200).json({
    completeCount: 2,
    successCount: 1,
    failedCount: 1
  });
});

app.get(
  "/api/audit/home/dashboard/processed-claims-inventory",
  (req, res, next) => {
    res.status(200).json({
      totalClaimsCount: 2,
      manualClaimsCount: 1,
      adjustedClaimsCount: 1,
      claimSource: {
        Paper: 1,
        EDI: 1
      },
      claimType: {
        Others: 1,
        Professional: 1
      },
      claimDecision: {
        Paid: 1,
        Deny: 1
      }
    });
  }
);

app.post("/api/audit/home/sampling/queue/add", (req, res, next) => {
  res.status(201).json("success");
});

app.post("/api/audit/home/sampling/count", (req, res, next) => {
  res.status(201).json({
    autoSamplingCount: 8,
    manualSamplingCount: 10
  });
});

app.get("/api/audit/home/dashboard/backlog/detail", (req, res, next) => {
  const data = [
    {
      taskId: 4,
      claimId: "2019100700000045",
      claimType: "Institutional OP",
      status: "Denied",
      receiptDate: "01/15/2020",
      age: 111,
      providerName: "Demo_Test_Supplier",
      memberGroupName: "Test1",
      billedAmount: 18.25,
      allowedAmount: 0,
      paidAmount: 0,
      claimQueueName: "hcc_super_user",
      processedDate: "04/29/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 5
    }
  ];
  res.status(200).json(data);
});

app.get("/api/audit/home/dashboard/queue/detail", (req, res, next) => {
  const data = [
    {
      taskId: 1,
      claimId: "2019020100001543",
      claimType: "Professional",
      status: "Final",
      receiptDate: "10/01/2020",
      age: -147,
      providerName: "MA Physician Network",
      memberGroupName: "Test1",
      billedAmount: 100,
      allowedAmount: 60,
      paidAmount: 60,
      claimQueueName: "hcc_super_user",
      processedDate: "10/02/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 7
    },
    {
      taskId: 2,
      claimId: "2019082800000200",
      claimType: "Institutional IP",
      status: "Final",
      receiptDate: "02/11/2020",
      age: 86,
      providerName: "Demo_Test_Supplier",
      memberGroupName: "Test1",
      billedAmount: 500,
      allowedAmount: 200,
      paidAmount: 130,
      claimQueueName: "hcc_super_user",
      processedDate: "02/29/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 9
    },
    {
      taskId: 7,
      claimId: "2019082800000205",
      claimType: "Institutional IP",
      status: "Final",
      receiptDate: "02/11/2020",
      age: 86,
      providerName: "Demo_Test_Supplier",
      memberGroupName: "Test1",
      billedAmount: 500,
      allowedAmount: 200,
      paidAmount: 130,
      claimQueueName: "hcc_super_user",
      processedDate: "02/29/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 3
    }
  ];
  res.status(200).json(data);
});

app.get(
  "/api/audit/home/dashboard/backlog/remove?taskIds=8",
  (req, res, next) => {
    res.status(201).json("success");
  }
);

app.get(
  "/api/audit/home/dashboard/queue/remove?taskIds=8",
  (req, res, next) => {
    res.status(201).json("success");
  }
);

// API's for manual sampling

app.get("/api/audit/manual/settings", (req, res, next) => {
  const payload = {
    claimType: ["Professional", "Institutional-IP"],
    claimSource: ["EDI", "Paper"],
    claimStatus: ["Denied", "Final", "Waiting for External System"],
    paymentStatus: ["Denied", "Check Issued"],
    billedAmount: 0,
    paidAmount: 0,
    processWorkFlows: ["Auto Adjudicated", "Externally Priced"],
    userGroup: [
      {
        id: "1",
        name: "QAudit-1"
      },
      {
        id: "2",
        name: "QAudit-2"
      }
    ],
    claimExaminers: [],
    lineOfBusiness: [],
    planTypes: [],
    diagnosisCodes: [
      {
        id: 1,
        name: "IN"
      },
      {
        id: 2,
        name: "AX"
      },
      {
        id: 3,
        name: "AS"
      },
      {
        id: 4,
        name: "AD"
      }
    ],
    procedureCodes: [
      {
        id: 1,
        name: "00930ZZ"
      }
    ],
    providers: [
      {
        code: "MC",
        name: "Monacor"
      }
    ],
    memberGroups: [
      {
        code: "MEMCOde",
        name: "Test Test"
      }
    ],
    memberIds: [
      { code: "XXX01", name: "Member 1" },
      { code: "XXX02", name: "Member 2" }
    ],
    totalSamplingClaimsPercentage: 0
  };
  res.status(200).json(payload);
});

app.get("/api/audit/manual/filter", (re, res, next) => {
  const payload = {
    claimStatus: [
      {
        id: "Denied",
        name: "Denied"
      },
      {
        id: "Final",
        name: "Final"
      },
      {
        id: "Consolidated",
        name: "Consolidated"
      },
      {
        id: "Needs Repair",
        name: "Needs Repair"
      },
      {
        id: "Waiting for External System",
        name: "Waiting for External System"
      },
      {
        id: "Needs Repricing",
        name: "Needs Repricing"
      },
      {
        id: "Needs Review",
        name: "Needs Review"
      },
      {
        id: "Rejected",
        name: "Rejected"
      }
    ],

    userGroup: [
      {
        id: "1",
        name: "QAudit-1"
      },
      {
        id: "2",
        name: "QAudit-2"
      }
    ],
    lineOfBusiness: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "Medicaid"
      },
      {
        id: 3,
        name: "Commercial"
      },
      {
        id: 4,
        name: "Medicare"
      }
    ],
    planType: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "POS"
      },
      {
        id: 3,
        name: "HMO"
      },
      {
        id: 4,
        name: "PPO"
      }
    ],
    diagnosisCodes: [
      {
        id: 1,
        name: "J30.1"
      },
      {
        id: 2,
        name: "A00"
      },
      {
        id: 3,
        name: "J30.2"
      },
      {
        id: 4,
        name: "B81.1"
      },
      {
        id: 5,
        name: "A02"
      },
      {
        id: 6,
        name: "005.1"
      },
      {
        id: 7,
        name: "A15.7"
      },
      {
        id: 8,
        name: "001.0"
      }
    ],
    procedureCodes: [
      {
        id: 1,
        name: "005H4ZZ"
      },
      {
        id: 2,
        name: "00970ZZ"
      },
      {
        id: 3,
        name: "00930ZZ"
      },
      {
        id: 4,
        name: "008J4ZZ"
      }
    ],
    providers: [
      {
        code: "Mary Black Physicians Group LLC",
        name: "Mary Black Physicians Group LLC"
      },
      {
        code: "TestProv",
        name: "Physician Billing Services"
      },
      {
        code: "RP1005",
        name: "Demo Out of Area Supplier"
      },
      {
        code: "PHC_Supplier",
        name: "PHC_Supplier"
      },
      {
        code: "TESTUNI01",
        name: "Physician Billing Services"
      },
      {
        code: "RP1003",
        name: "Demo Test Supplier 3"
      },
      {
        code: "RP1007",
        name: "Demo Out of Network Supplier"
      },
      {
        code: "TESTUST001",
        name: "Do Not Use Doctors Care"
      },
      {
        code: "MAP0001",
        name: "MA Physician Network"
      },
      {
        code: "Physician Billing Services",
        name: "Physician Billing Services"
      },
      {
        code: "MP1001",
        name: "Mridula Test Provider"
      },
      {
        code: "S00000026",
        name: "Test_Ancillary1"
      },
      {
        code: "S00000003",
        name: "Test Supplier2"
      },
      {
        code: "S00000025",
        name: "Test_Facility3"
      },
      {
        code: "EDGE_DUMMY_SUPP",
        name: "EDGE_DUMMY_SUPPID"
      },
      {
        code: "S00000002",
        name: "Test Supplier1"
      },
      {
        code: "S00000101",
        name: "Test Supplier_Reshma"
      },
      {
        code: "S00000021",
        name: "Downtown Greenville Hospital1"
      },
      {
        code: "MP1002",
        name: "Mridula Test Provider"
      },
      {
        code: "S0000001",
        name: "Physician Billing Services"
      },
      {
        code: "S00000028",
        name: "Test_Facility5"
      },
      {
        code: "S00000005",
        name: "Test_Medicare"
      },
      {
        code: "TESTUNI02",
        name: "SPARTANBURG REGIONAL HEALTH SERVICES"
      },
      {
        code: "RP1002",
        name: "Demo Test Supplier_2"
      },
      {
        code: "RP1001",
        name: "Rakesh Test Provider"
      },
      {
        code: "S00000061",
        name: "Non PAR Supplier"
      },
      {
        code: "S00000082",
        name: "Test_Supplier_RS"
      }
    ],
    memberGroup: [
      {
        code: "Louisville-0000",
        name: "Louisville-0000"
      },
      {
        code: "Test523",
        name: "Test5"
      },
      {
        code: "0000000021-002",
        name: "South Carolina"
      },
      {
        code: "Test423",
        name: "Test4"
      },
      {
        code: "Test123",
        name: "Test1"
      },
      {
        code: "0000000021-002-001",
        name: "Greenville"
      },
      {
        code: "R00010101",
        name: "Carmel-Sub-1"
      },
      {
        code: "0000",
        name: "Lexington"
      },
      {
        code: "R00010102",
        name: "Fishers-Sub-2"
      },
      {
        code: "R000102",
        name: "Marion County"
      },
      {
        code: "PHC_Medical Account",
        name: "PHC_Medical Account"
      },
      {
        code: "Test1234",
        name: "Test Account - 01"
      },
      {
        code: "0000000021",
        name: "MA"
      }
    ]
  };

  res.status(200).json(payload);
});

app.post("/api/audit/manual/examiner", (req, res, next) => {
  const payload = [
    { id: "1", name: "Brad Pitt" },
    { id: "2", name: "Archana Sreekmar" },
    { id: "3", name: "Liya Jose" },
    { id: "4", name: "Rinu Jacob" },
    { id: "5", name: "Harris Ameen" },
    { id: "6", name: "Tino Jose" }
  ];

  res.status(200).json(payload);
});

app.post("/api/audit/manual/refresh/count", (req, res, next) => {
  const payload = { totalClaimsCount: 100 };
  setTimeout(() => {
    res.status(200).json(payload);
  }, 0000);
});
app.post("/api/enrollment/audit/manual/refresh/count", (req, res, next) => {
  const payload = { totalClaimsCount: 100 };
  setTimeout(() => {
    res.status(200).json(payload);
  }, 0000);
});

app.post("/api/audit/manual/general/queue/add", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.post("/api/audit/manual/auditor/queue/self-add", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.get("/api/audit/manual/assigned/count/user", (req, res, next) => {
  res.status(200).json({ auditQueueCount: 25 });
});

app.get("/api/audit/auditor/queue/get-claim", (req, res, next) => {
  res.status(201).json({
    auditTaskId: 32,
    claimId: "20190422000625",
    claimType: "Institutional-IP",
    receiptDate: "04/22/2019",
    claimsAge: 386,
    providerName: "Mridula Test Provider",
    memberGroupName: "Carmel-Sub-1",
    billedAmount: 13000,
    allowedAmount: 3000600,
    paidAmount: 2999680,
    processedDate: "01/29/2020",
    queueName: "hcc_super_user",
    examinerName: null,
    savedForLater: false,
    errorType: null,
    financialImpact: null,
    auditorAmount: null,
    auditorComments: null,
    endTimer: null,
    attachmentOne: null,
    attachmentTwo: null,
    attachmentThree: null,
    attachmentFour: null,
    attachmentFive: null,
    attachmentSix: null,
    checkListItems: [
      {
        id: "check3",
        name: "check3"
      },
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check2",
        name: "check2"
      }
    ],
    savedCheckListItems: null
  });
});

app.get("/api/audit/auditor/queue/get-claim/initialized", (req, res, next) => {
  const data = {
    auditTaskId: 35,
    claimId: "20190121001224",
    claimType: "Institutional-IP",
    claimStatus: "Final",
    receiptDate: "01/21/2019",
    claimsAge: 477,
    providerName: "SUPPLIER_1563771690521213964",
    memberGroupName: "Lexington",
    billedAmount: 100,
    allowedAmount: 70,
    paidAmount: 70,
    processedDate: "01/20/2020",
    queueName: "hcc_super_user",
    examinerName: null,
    savedForLater: true,
    savedForLaterStatus: "FAILED",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: 250,
    auditorComments: "Test",
    endTimer: "00:27:28",
    attachmentOne: null,
    attachmentTwo: null,
    attachmentThree: null,
    attachmentFour: null,
    attachmentFive: null,
    attachmentSix: null,
    checkListItems: [
      {
        id: "check3",
        name: "check3"
      },
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check2",
        name: "check2"
      }
    ],
    savedCheckListItems: [
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check3",
        name: "check3"
      }
    ]
  };
  res.status(201).json(data);
});

app.post(
  "/api/file/management/upload/audit/task/attachments",
  (req, res, next) => {
    const payload = { success: "OK" };
    res.status(200).json(payload);
  }
);

app.post("/api/audit/auditor/queue/save-for-later", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.post("/api/audit/auditor/queue/claim/final/submit", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.get(
  "/api/file/management/delete/audit/flow/attachment",
  (req, res, next) => {
    const payload = { success: "OK" };
    res.status(201).json(payload);
  }
);

app.get("/api/file/management/download/:fileId", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(201).json(payload);
});

app.get("/api/audit/examiner/queue/download/attachment", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(201).json(payload);
});

app.get("/api/file/management/delete/audit/task/:id", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(201).json(payload);
});

app.post("/api/audit/manual/settings/save", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.post("/api/audit/manual/population/statistics", (req, res, next) => {
  const payload = {
    otherClaims: 1,
    checkIssued: 160,
    paper: 16,
    adjusted: 366,
    edi: 574,
    denied: 0,
    professional: 345,
    manuallyAdjudicated: 0,
    autoAdjudicated: 255,
    externallyPriced: 1,
    checkNotIssued: 0,
    institutionalIP: 102,
    institutionalOP: 141,
    totalClaims: 700
  };
  setTimeout(() => {
    res.status(200).json(payload);
  }, 5000);
});

app.get("/api/audit/auto/settings", (req, res, next) => {
  const payload = {
    userGroups: [],
    lineOfBusiness: [],
    planTypes: [],
    processWorkFlowExclusions: [],
    billedAmount: 0,
    paidAmount: 0,
    claimSources: [
      {
        Paper: 0,
        EDI: 0
      }
    ],
    claimTypes: [
      {
        Others: 0,
        Professional: 0,
        "Institutional-OP": 0,
        "Institutional-IP": 0
      }
    ],
    paymentStatus: [
      {
        Denied: 0,
        "Check Issued": 0,
        "Check Not Issued": 0
      }
    ],
    totalSamplingClaimsPercentage: 0
  };
  res.status(200).json(payload);
});

app.get("/api/lead/review/get-claim-count-review", (req, res) => {
  res.status(200).json(10);
});

app.get("/api/audit/auto/filter", (req, res, next) => {
  const payload = {
    userGroup: [
      {
        id: 1,
        name: "QAudit 1"
      },
      {
        id: 2,
        name: "QAudit 2"
      }
    ],
    lineOfBusiness: [
      {
        id: 1,
        name: "DDD"
      },
      {
        id: 2,
        name: "Medicaid"
      },
      {
        id: 3,
        name: "Commercial"
      },
      {
        id: 4,
        name: "SSS"
      }
    ],
    planType: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "POS"
      },
      {
        id: 3,
        name: "HMO"
      },
      {
        id: 4,
        name: "PPO"
      }
    ]
  };
  res.status(200).json(payload);
});

app.post("/api/audit/auto/settings/save", (req, res, next) => {
  res.status(200).json({ success: true });
});
// app.get("/api/refresh/materialized-view", (req, res, next) => {
//   res.status(201).json("success");
// });

app.get("/api/audit/configuration/checklist", (req, res, next) => {
  res.status(201).json({
    checkpoints: checkpoint
  });
});

app.post("/api/audit/configuration/checklist/add", (req, res, next) => {
  const payload = req.body && req.body.checkpoints;
  console.log(req.body);
  checkpoint["Institutional (IP)"] = [
    ...checkpoint["Institutional (IP)"],
    ...(payload["Institutional (IP)"] || [])
  ];
  checkpoint["Institutional (OP)"] = [
    ...checkpoint["Institutional (OP)"],
    ...(payload["Institutional (OP)"] || [])
  ];
  checkpoint["Professional"] = [
    ...checkpoint["Professional"],
    ...(payload["Professional"] || [])
  ];
  checkpoint["Others"] = [
    ...checkpoint["Others"],
    ...(payload["Others"] || [])
  ];
  res.status(201).json({
    checkpoints: checkpoint
  });
});

app.post("/api/audit/configuration/checklist/remove", (req, res, next) => {
  const payload = req.body && req.body.checkpoints;
  checkpoint["Institutional (IP)"] = checkpoint["Institutional (IP)"].filter(
    val => {
      const values = payload["Institutional (IP)"] || [];
      return values.indexOf(val) === -1;
    }
  );
  checkpoint["Institutional (OP)"] = checkpoint["Institutional (OP)"].filter(
    val => {
      const values = payload["Institutional (OP)"] || [];
      return values.indexOf(val) === -1;
    }
  );
  checkpoint["Professional"] = checkpoint["Professional"].filter(val => {
    const values = payload["Professional"] || [];
    return values.indexOf(val) === -1;
  });
  checkpoint["Others"] = checkpoint["Others"].filter(val => {
    const values = payload["Others"] || [];
    return values.indexOf(val) === -1;
  });
  res.status(201).json({
    checkpoints: checkpoint
  });
});

module.exports = app;

app.post("/api/reports/auditor/audit-list-grid-view", (req, res, next) => {
  const response = {
    passed: 1,
    failed: 0,
    auditReportDtoList: [
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      },
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      },
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      },
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      }
    ]
  };
  res.status(200).json(
    response
    // timestamp: "2019-12-31T06:34:32.758+0000",
    // providerName: 404,
    // error: "Not Found",
    // message: "No report data found for the selected criteria",
    // path: "/api/reports/auditor/audit-list-grid-view"
  );
});

app.post(
  "/api/reports/auditor/audit-backlog-list-grid-view",
  (req, res, next) => {
    const response = {
      total: 1,
      savedForLaterYes: 1,
      savedForLaterNo: 0,
      auditBacklogReportDtoList: [
        {
          claimId: "20180731000341",
          claimType: "Professional",
          claimStatus: "Final",
          receiptDate: "2020-10-01",
          age: -142,
          providerName: "MA Physician Network",
          groupName: "Test1",
          billedAmount: 100,
          allowedAmount: 60,
          paidAmount: 60,
          processedDate: "2020-10-02",
          examinerName: "Devika",
          queueName: "hcc_super_user",
          backlogAge: 72,
          savedForLater: true
        },
        {
          claimId: "20180731000341",
          claimType: "Professional",
          claimStatus: "Final",
          receiptDate: "2020-10-01",
          age: -142,
          providerName: "MA Physician Network",
          groupName: "Test1",
          billedAmount: 100,
          allowedAmount: 60,
          paidAmount: 60,
          processedDate: "2020-10-02",
          examinerName: "Devika",
          queueName: "hcc_super_user",
          backlogAge: 72,
          savedForLater: true
        }
      ]
    };
    res.status(200).json(
      response

      // timestamp: "2019-12-31T06:34:32.758+0000",
      // providerName: 404,
      // error: "Not Found",
      // message: "No report data found for the selected criteria",
      // path: "/api/reports/auditor/audit-list-grid-view"
    );
  }
);

app.post("/api/auditor-reports/audit-backlog-report", (req, res, next) => {
  const response = [
    {
      claimId: 0,
      claimType: "Manju",
      claimproviderName: "Varghese",
      receiptDate: "manju.varghese@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "345",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Beginner",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Failed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    },
    {
      claimId: 0,
      claimType: "Tino",
      claimproviderName: "Jose",
      receiptDate: "tino.jose@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "757",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Expert",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Failed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    },
    {
      claimId: 0,
      claimType: "Tino",
      claimproviderName: "Jose",
      receiptDate: "tino.jose@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "890",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Expert",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Passed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    },
    {
      claimId: 0,
      claimType: "Tino",
      claimproviderName: "Jose",
      receiptDate: "tino.jose@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "890",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Expert",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Passed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    }
  ];
  res.status(200).json(
    response

    // timestamp: "2019-12-31T06:34:32.758+0000",
    // providerName: 404,
    // error: "Not Found",
    // message: "No report data found for the selected criteria",
    // path: "/api/reports/auditor/audit-list-grid-view"
  );
});

app.post(
  "/api/reports/auditor/audit-rebuttal-list-grid-view",
  (req, res, next) => {
    const response = {
      firstLevel: 0,
      secondLevel: 2,
      thirdLevel: 0,
      total: 2,
      examinerAccepted: 2,
      auditorAccepted: 2,
      auditRebuttalReportDtoList: [
        {
          claimId: "20180731000391",
          claimType: "Institutional IP",
          claimStatus: "Final",
          receiptDate: "2020-02-11",
          age: 91,
          providerName: "Demo_Test_Supplier",
          groupName: "Test1",
          billedAmount: 500,
          allowedAmount: 200,
          paidAmount: 130,
          processedDate: "2020-02-29",
          examinerName: "Devika",
          errorDescription: null,
          examinerAgreed: true,
          examinerRebuttalComment: "invalid",
          rebuttalLevel: "SECOND LEVEL",
          level2AuditorComments: "true",
          leadName: "Devika",
          managerName: "Manu",
          rebuttalDate: "2020-05-12",
          rebuttalStatus: "true"
        },
        {
          claimId: "20180731000341",
          claimType: "Professional",
          claimStatus: "Final",
          receiptDate: "2020-10-01",
          age: -142,
          providerName: "MA Physician Network",
          groupName: "Test1",
          billedAmount: 100,
          allowedAmount: 60,
          paidAmount: 60,
          processedDate: "2020-10-02",
          examinerName: "Devika",
          errorDescription: null,
          examinerAgreed: true,
          examinerRebuttalComment: "invalid",
          rebuttalLevel: "SECOND LEVEL",
          level2AuditorComments: "true",
          leadName: "Devika",
          managerName: "Manu",
          rebuttalDate: "2020-05-12",
          rebuttalStatus: "true"
        }
      ]
    };
    res.status(200).json(
      response

      // timestamp: "2019-12-31T06:34:32.758+0000",
      // providerName: 404,
      // error: "Not Found",
      // message: "No report data found for the selected criteria",
      // path: "/api/reports/auditor/audit-list-grid-view"
    );
  }
);

app.post("/api/reports/auditor/audit-list-report", (req, res, next) => {
  res.status(200).json("success");
});
app.post("/api/reports/auditor/audit-backlog-list-report", (req, res, next) => {
  res.status(200).json("success");
});
app.post("/api/reports/auditor/audit-backlog-list-report", (req, res, next) => {
  res.status(200).json("success");
});
app.get("/api/get-audit-failed-count", (req, res, next) => {
  res.status(200).json({
    auditFailed: 1
  });
});
app.get("/api/examiner/review-rebut-count", (req, res, next) => {
  res.status(200).json({
    reviewRebut: 1
  });
});

app.get("/api/get-audit-failed-list", (req, res, next) => {
  res.status(200).json([
    {
      slNo: 1,

      claimId: "2019102900000246",

      auditFlowId: 18,

      claimType: "Institutional",

      claimStatus: "Review",

      receiptDate: "2019-10-29",

      claimByAge: 196,

      providerName: "Physician Billing Services",

      groupName: null,

      billedAmount: null,

      allowedAmount: null,

      totalPaidAmount: null,

      processedDate: "2020-01-03T11:09:00.000+0000",

      queueName: "Itemized Bill WB",

      auditorName: "Sonima Nambiar",

      auditDate: "2020-05-03",

      auditStatus: "FAILED",

      errorType: null,

      errorDescription: null,

      financialImpact: null,

      amount: null
    },
    {
      slNo: 1,

      claimId: "2019102900000247",

      auditFlowId: 18,

      claimType: "Institutional",

      claimStatus: "Review",

      receiptDate: "2019-10-29",

      claimByAge: 196,

      providerName: "Physician Billing Services",

      groupName: null,

      billedAmount: null,

      allowedAmount: null,

      totalPaidAmount: null,

      processedDate: "2020-01-03T11:09:00.000+0000",

      queueName: "Itemized Bill WB",

      auditorName: "Sonima Nambiar",

      auditDate: "2020-05-03",

      auditStatus: "PENDED",

      errorType: null,

      errorDescription: null,

      financialImpact: null,

      amount: null
    },
    {
      slNo: 1,

      claimId: "2019102900000247",

      auditFlowId: 18,

      claimType: "Institutional",

      claimStatus: "Review",

      receiptDate: "2019-10-29",

      claimByAge: 196,

      providerName: "Physician Billing Services",

      groupName: null,

      billedAmount: null,

      allowedAmount: null,

      totalPaidAmount: null,

      processedDate: "2020-01-03T11:09:00.000+0000",

      queueName: "Itemized Bill WB",

      auditorName: "Sonima Nambiar",

      auditDate: "2020-05-03",

      auditStatus: "PENDED",

      errorType: null,

      errorDescription: null,

      financialImpact: null,

      amount: null
    }
  ]);
});
app.get("/api/examiner/review-rebut-list", (req, res, next) => {
  res.status(200).json([
    {
      rebutAccept: "Accept",
      auditFlowId: 77,
      claimId: "20200603000003",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "06/03/2020",
      claimAge: 198,
      providerName: "Supplier_Commercial",
      groupName: "Individual OffEx",
      billedAmount: 1000,
      allowedAmount: 500,
      paidAmount: 500,
      processedDate: "10/16/2020 12:31",
      queueName: "WB_Provider Issues"
    },
    {
      rebutAccept: "Accept",
      auditFlowId: 78,
      claimId: "20200603000004",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "06/03/2020",
      claimAge: 198,
      providerName: "Supplier_Commercial",
      groupName: "Individual OffEx",
      billedAmount: 1000,
      allowedAmount: 500,
      paidAmount: 500,
      processedDate: "10/16/2020 12:31",
      queueName: "WB_Provider Issues"
    }
  ]);
});

app.get("/api/landing/audit/examiner/queue/get-claim", (req, res, next) => {
  const payload = {
    auditFlowId: 241,
    claimId: "20190101000002",
    claimType: "Institutional (OP)",
    claimStatus: "Final",
    receiptDate: "05/16/2020",
    claimsAge: 104,
    providerName: "Supplier_UST51",
    memberGroupName: "BB Account 1 - Active",
    billedAmount: 200,
    allowedAmount: 140,
    paidAmount: 105,
    processedDate: "05/16/2020 03:15",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: null,
    currentLevel: 1,
    auditorCommentsAndAttachments: {
      timestamp: "08/13/2020 12:27",
      comments: "Procedural error",
      attachments: [
        {
          filePosition: "attachmentOne",
          fileId: 138,
          fileName: "20190101000002.docx"
        }
      ]
    },
    auditWorkflowAttachmentsAndComments: [
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 1,
        timestamp: "08/28/2020 02:25",
        comments: "Please check again",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 246,
            fileName: "Elements in BPO Dashboard.xlsx"
          }
        ]
      },
      {
        userName: "Devika Kumari",
        userRole: "Claims Examiner",
        rebuttalLevel: 1,
        timestamp: "08/14/2020 02:59",
        comments: "Pending for review.",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 141,
            fileName: "20190101000002.docx"
          }
        ]
      }
    ],
    examinerComment: "Pending for now",
    examinerAttachmentDto: {
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 247,
        fileName: "Life Insurance.pdf"
      }
    }
  };

  res.status(200).json(payload);
});
app.get("/api/landing/audit/examiner/queue/get-claim", (req, res, next) => {
  const payload = {
    auditFlowId: 241,
    claimId: "20190101000002",
    claimType: "Institutional (OP)",
    claimStatus: "Final",
    receiptDate: "05/16/2020",
    claimsAge: 104,
    providerName: "Supplier_UST51",
    memberGroupName: "BB Account 1 - Active",
    billedAmount: 200,
    allowedAmount: 140,
    paidAmount: 105,
    processedDate: "05/16/2020 03:15",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: null,
    currentLevel: 1,
    auditorCommentsAndAttachments: {
      timestamp: "08/13/2020 12:27",
      comments: "Procedural error",
      attachments: [
        {
          filePosition: "attachmentOne",
          fileId: 138,
          fileName: "20190101000002.docx"
        }
      ]
    },
    auditWorkflowAttachmentsAndComments: [
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 1,
        timestamp: "08/28/2020 02:25",
        comments: "Please check again",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 246,
            fileName: "Elements in BPO Dashboard.xlsx"
          }
        ]
      },
      {
        userName: "Devika Kumari",
        userRole: "Claims Examiner",
        rebuttalLevel: 1,
        timestamp: "08/14/2020 02:59",
        comments: "Pending for review.",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 141,
            fileName: "20190101000002.docx"
          }
        ]
      }
    ],
    examinerComment: "Pending for now",
    examinerAttachmentDto: {
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 247,
        fileName: "Life Insurance.pdf"
      }
    }
  };

  res.status(200).json(payload);
});
app.get("/api/landing/audit/examiner/queue/get-claim", (req, res, next) => {
  const payload = {
    auditFlowId: 241,
    claimId: "20190101000002",
    claimType: "Institutional (OP)",
    claimStatus: "Final",
    receiptDate: "05/16/2020",
    claimsAge: 104,
    providerName: "Supplier_UST51",
    memberGroupName: "BB Account 1 - Active",
    billedAmount: 200,
    allowedAmount: 140,
    paidAmount: 105,
    processedDate: "05/16/2020 03:15",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: null,
    currentLevel: 1,
    auditorCommentsAndAttachments: {
      timestamp: "08/13/2020 12:27",
      comments: "Procedural error",
      attachments: [
        {
          filePosition: "attachmentOne",
          fileId: 138,
          fileName: "20190101000002.docx"
        }
      ]
    },
    auditWorkflowAttachmentsAndComments: [
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 1,
        timestamp: "08/28/2020 02:25",
        comments: "Please check again",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 246,
            fileName: "Elements in BPO Dashboard.xlsx"
          }
        ]
      },
      {
        userName: "Devika Kumari",
        userRole: "Claims Examiner",
        rebuttalLevel: 1,
        timestamp: "08/14/2020 02:59",
        comments: "Pending for review.",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 141,
            fileName: "20190101000002.docx"
          }
        ]
      }
    ],
    examinerComment: "Pending for now",
    examinerAttachmentDto: {
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 247,
        fileName: "Life Insurance.pdf"
      }
    }
  };

  res.status(200).json(payload);
});
app.get("/api/examiner/review-rebut/get-claim", (req, res, next) => {
  const payload = {
    auditFlowId: 77,
    claimId: "20200603000003",
    claimType: "Professional",
    claimStatus: "Final",
    receiptDate: "06/03/2020",
    claimsAge: 198,
    providerName: "Supplier_Commercial",
    memberGroupName: "Individual OffEx",
    billedAmount: 1000,
    allowedAmount: 500,
    paidAmount: 500,
    processedDate: "10/08/2020 06:24",
    queueName: "WB_Provider Issues",
    examinerName: "Santhosh Gajendran",
    auditorName: "Althaf Rahuman",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: null,
    currentLevel: 0,
    auditorCommentsAndAttachments: {
      timestamp: "10/16/2020 08:31",
      comments: "etrt",
      attachments: null
    },
    auditWorkflowAttachmentsAndComments: [
      {
        userName: "Suresh Krishnamoorthy",
        userRole: "Claims Lead",
        rebuttalLevel: 0,
        timestamp: "12/17/2020 08:05",
        comments: "error",
        attachments: null
      },
      {
        userName: "Santhosh Gajendran",
        userRole: "Claims Examiner",
        rebuttalLevel: 0,
        timestamp: "12/10/2020 05:53",
        comments: "accept",
        attachments: null
      },
      {
        userName: "Suresh Krishnamoorthy",
        userRole: "Claims Lead",
        rebuttalLevel: 1,
        timestamp: "12/10/2020 05:06",
        comments: "its an error",
        attachments: null
      },
      {
        userName: "Santhosh Gajendran",
        userRole: "Claims Examiner",
        rebuttalLevel: 1,
        timestamp: "12/01/2020 07:12",
        comments: "review1",
        attachments: null
      }
    ],
    examinerComment: null,
    examinerAttachmentDto: null
  };
  res.status(200).json(payload);
});

app.get("/api/audit/examiner/queue/get-claim", (req, res, next) => {
  const payload = {
    currentLevel: 4,
    auditFlowId: 26,
    claimId: "20190681000116",
    claimType: "Institutional (OP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 18,
    providerName: "Supplier_UST5",
    memberGroupName: "Medicare Advantage",
    billedAmount: 900,
    allowedAmount: 630,
    paidAmount: 630,
    processedDate: "05/17/2020 03:41",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: ["Over paid financially, please verify"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 29,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        }
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 16,
          fileName: "Audit_Details.xlsx"
        }
      }
    ],
    leadComments: [
      "Finally, verified 1",
      "Finally verified 2",
      "Finally verified 3",
      "Finally verified 4 djaskldjasdjaslkj kjaskjdlkasjldjasdja ljsdkasdkasdl;askldas kl;askdl;askdkas;kdaskd"
    ],
    leadAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 21,
          fileName: "Audit_Details.xlsx"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 19,
          fileName: "Test Audit Upload Details.docx"
        }
      },
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 21,
          fileName: "Audit_Details.xlsx"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 19,
          fileName: "Test Audit Upload Details.docx"
        }
      },
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 20,
          fileName: "FileUpload1.docx"
        },
        attachmentThree: {
          filePosition: "attachmentThree",
          fileId: 21,
          fileName: "Audit_Details.xlsx"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 18,
          fileName: "Audit_Details.xlsx"
        }
      }
    ],
    managerComments: null,
    managerAttachments: null,
    examinerComment: "Finally verified, please complete the claim",
    examinerAttachmentDto: {
      attachmentTwo: {
        filePosition: "attachmentTwo",
        fileId: 23,
        fileName: "FileUpload1.docx"
      },
      attachmentThree: {
        filePosition: "attachmentThree",
        fileId: 79,
        fileName: "Institutional_OP__Claim_Validation_Rules.docx"
      },
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.docx"
      }
    },
    prevExaminerComments: ["Rebutting the claim", "Test2", "Test3"],
    prevExaminerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 29,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        },
        attachmentFour: {
          filePosition: "attachmentFour",
          fileId: 18,
          fileName: "Audit_Details.xlsx"
        },
        attachmentThree: {
          filePosition: "attachmentThree",
          fileId: 17,
          fileName: "Institutional_OP__Claim_Validation_Rules.docx"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 28,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        },
        attachmentFive: {
          filePosition: " attachmentFive",
          fileId: 28,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        }
      },
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 29,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        },
        attachmentFour: {
          filePosition: "attachmentFour",
          fileId: 18,
          fileName: "Audit_Details.xlsx"
        }
      }
    ]
  };
  const payloadNew = {
    auditFlowId: 241,
    claimId: "20190101000002",
    claimType: "Institutional (OP)",
    claimStatus: "Final",
    receiptDate: "05/16/2020",
    claimsAge: 104,
    providerName: "Supplier_UST51",
    memberGroupName: "BB Account 1 - Active",
    billedAmount: 200,
    allowedAmount: 140,
    paidAmount: 105,
    processedDate: "05/16/2020 03:15",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: null,
    currentLevel: 1,
    auditorCommentsAndAttachments: {
      timestamp: "08/13/2020 12:27",
      comments: "Procedural error",
      attachments: [
        {
          filePosition: "attachmentOne",
          fileId: 138,
          fileName: "20190101000002.docx"
        }
      ]
    },
    auditWorkflowAttachmentsAndComments: [
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 1,
        timestamp: "08/28/2020 02:25",
        comments: "Please check again",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 246,
            fileName: "Elements in BPO Dashboard.xlsx"
          }
        ]
      },
      {
        userName: "Devika Kumari",
        userRole: "Claims Examiner",
        rebuttalLevel: 1,
        timestamp: "08/14/2020 02:59",
        comments: "Pending for review.",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 141,
            fileName: "20190101000002.docx"
          }
        ]
      }
    ],
    examinerComment: "Pending for now",
    examinerAttachmentDto: {
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 247,
        fileName: "Life Insurance.pdf"
      }
    }
  };

  res.status(200).json(payloadNew);
});

app.post("/api/audit/examiner/queue/claim/accept", (req, res, next) => {
  res.status(200).json(true);
});

app.post("/api/audit/examiner/queue/claim/pend", (req, res, next) => {
  res.status(200).json(true);
});

app.post("/api/audit/examiner/queue/claim/rebut", (req, res, next) => {
  res.status(200).json(true);
});

app.get("/api/rebuttal/configuration/workflow", (req, res) => {
  res.status(200).json([
    {
      flowId: 1,
      roleId: 2,
      roleName: "Manager",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: false,
      isLevelThreeFlowEnabled: true
    },
    {
      flowId: 2,
      roleId: 3,
      roleName: "Claims Lead",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: false
    },
    {
      flowId: 3,
      roleId: 5,
      roleName: "Claims Auditor",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: false
    },
    {
      flowId: 4,
      roleId: 4,
      roleName: "Claims Examiner",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: false
    }
  ]);
});

app.post("/api/rebuttal/configuration/save", (req, res) => {
  res.status(200).json([
    {
      flowId: 1,
      roleId: 2,
      roleName: "Manager",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: false,
      isLevelThreeFlowEnabled: true
    },
    {
      flowId: 2,
      roleId: 3,
      roleName: "Claims Lead",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: false
    },
    {
      flowId: 3,
      roleId: 4,
      roleName: "Claims Examiner",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: false,
      isLevelThreeFlowEnabled: false
    },
    {
      flowId: 4,
      roleId: 5,
      roleName: "Claims Auditor",
      isLevelOneFlowEnabled: true,
      isLevelTwoFlowEnabled: true,
      isLevelThreeFlowEnabled: true
    }
  ]);
});

app.post(
  "/api/file/management/upload/audit/flow/attachments",
  (req, res, next) => {
    const payload = { succes: "true" };
    res.status(200).json(payload);
  }
);

app.post("/api/audit/checklist/import", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.get("/api/audit/audit-route-out/:taskId", (req, res, next) => {
  const payload = {
    auditTaskId: 14,
    claimId: "20190722001261",
    claimType: "Institutional (OP)",
    claimStatus: "Denied",
    receiptDate: "05/17/2020",
    claimsAge: 30,
    providerName: "Test Supplier1",
    memberGroupName: "Greenville",
    billedAmount: 500,
    allowedAmount: 0,
    paidAmount: 0,
    processedDate: "05/17/2020 07:15",

    examinerName: "Devika Kumari",
    fromAuditorName: "Brian Blaze",
    fromUserGroup: "hcc_super_user",
    fromRouteComments: "invalid",
    fromRouteReason: "invalid",
    toAuditorNames: [
      {
        auditorId: 19,
        auditorName: "Devika"
      },
      {
        auditorId: 1,
        auditorName: "Devi"
      },
      {
        auditorId: 2,
        auditorName: "Blaze"
      }
    ],
    toRouteReason: [
      {
        routeReasonCode: 19,
        routeReason: "Already Routed Claim"
      },
      {
        routeReasonCode: 1,
        routeReason: "Incorrect Assignment"
      },
      {
        routeReasonCode: 2,
        routeReason: "Approval Required"
      }
    ]
  };
  res.status(200).json(payload);
});

app.post("/api/audit/manager-lead-route-to/route", (req, res, next) => {
  res.status(200).json(true);
});

app.post("/api/audit/manual/sampling/auditor/queue/list", (req, res, next) => {
  const payload = [
    {
      claimId: "20190403000013",
      claimType: "Institutional-IP",
      claimStatus: "Final",
      receiptDate: "04/03/2019",
      claimsAge: 467,
      providerId: "S00000626",
      providerName: "Supplier_UST5",
      memberGroupCode: "01141970",
      memberGroupName: "BB2 CarePlus Account",
      billedAmount: 15000,
      allowedAmount: 10500,
      paidAmount: 10500,
      processedDate: "05/08/2020 01:01",
      examinerName: "Abinaya Rajendran",
      claimQueueName: "hcc_super_user",
      claimFactKey: 40223,
      claimSource: "EDI",
      entryDate: "05/07/2020 06:09",
      reviewRepairReason:
        "Claim requires review payment total greater than $10,000.00",
      lineOfBusiness: null,
      planType: null,
      owner: "system",
      serviceDate: "03/01/2019",
      tinNumber: "99-9999999",
      paymentStatus: "Check Not Issued",
      processWorkflow: "Adjusted Claims",
      diagnosisCodes: ["074.3"],
      procedureCodes: [],
      memberId: "503007565",
      memberName: "Shuck, Herbert",
      auditSamplingCriteriaId: 28,
      userGroups: [
        {
          groupId: 19,
          groupName: "Hcc_Super_User"
        }
      ]
    },
    {
      claimId: "20190327000001",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "03/27/2019",
      claimsAge: 474,
      providerId: "S35150",
      providerName: "Test Community Care",
      memberGroupCode: "TEST123",
      memberGroupName: "PDryden_test",
      billedAmount: 100,
      allowedAmount: 50,
      paidAmount: 50,
      processedDate: "02/16/2020 20:11",
      examinerName: null,
      claimQueueName: "hcc_super_user",
      claimFactKey: 36006,
      claimSource: "EDI",
      entryDate: "02/14/2020 13:27",
      reviewRepairReason: null,
      lineOfBusiness: null,
      planType: null,
      owner: "system",
      serviceDate: "02/11/2019",
      tinNumber: "38-3533998",
      paymentStatus: "Check Issued",
      processWorkflow: "Manually Adjudicated",
      diagnosisCodes: ["074.3"],
      procedureCodes: [],
      memberId: "Pat_1",
      memberName: "Dryden, Pat",
      auditSamplingCriteriaId: 28,
      userGroups: [
        {
          groupId: 18,
          groupName: "Hcc_Super_User"
        }
      ]
    },
    {
      claimId: "XXX",
      claimType: "Professional",
      claimStatus: "Denied",
      receiptDate: "05/01/2019",
      claimsAge: 439,
      providerId: "S000000102",
      providerName: "Presbyterian Dbabb",
      memberGroupCode: "HEM0001",
      memberGroupName: "Humana Edge MA",
      billedAmount: 5000,
      allowedAmount: 0,
      paidAmount: 0,
      processedDate: "03/23/2020 11:54",
      examinerName: null,
      claimQueueName: "hcc_super_user",
      claimFactKey: 38042,
      claimSource: "Paper",
      entryDate: "01/28/2020 00:42",
      reviewRepairReason: null,
      lineOfBusiness: null,
      planType: null,
      owner: "U60075",
      serviceDate: "04/10/2019",
      tinNumber: "12-2085561",
      paymentStatus: "Check Not Issued",
      processWorkflow: "Manually Adjudicated",
      diagnosisCodes: ["074.3", "074.5"],
      procedureCodes: [],
      memberId: "200000437-01",
      memberName: "Abrego, Iliana",
      auditSamplingCriteriaId: 28,
      userGroups: [
        {
          groupId: 25,
          groupName: "Hcc_Super_User"
        },
        {
          groupId: 19,
          groupName: "WB_Test_Group_1"
        }
      ]
    }
  ];
  setTimeout(() => {
    res.status(200).json(payload);
  }, 5000);
});

app.get("/api/audit/manual/auditors", (req, res, next) => {
  res.status(200).json([
    {
      id: 8,
      name: "Mohammad Fazil"
    },
    {
      id: 93,
      name: "Manisha Swami"
    },
    {
      id: 107,
      name: "Brian Blaze"
    },
    {
      id: 118,
      name: "George Floyd"
    },
    {
      id: 115,
      name: "Dory Wilson"
    },
    {
      id: 123,
      name: "Test_Audi Aud"
    }
  ]);
});

app.get("/api/audit/manual/auditor/details", (req, res, next) => {
  res.status(200).json({
    associatedUserGroupDetails: [
      {
        groupId: 19,
        groupName: "Hcc_Super_User"
      }
    ],
    auditQueueCountDetails: 25
  });
});

app.post("/api/audit/manual/sampling/auditor/queue/add", (req, res, next) => {
  res.status(200).json(200);
});

app.get("/api/audit/manager-lead-route-to/cancel", (req, res, next) => {
  res.status(200).json(true);
});

app.get("/api/audit/manager-lead-route-to/manager/claim", (req, res, next) => {
  const payload = {
    auditTaskId: 44,
    claimId: "20191008000001",
    claimType: "Professional",
    claimStatus: "Final",
    queueName: "hcc_super_user",
    receiptDate: "05/19/2020",
    claimsAge: 82,
    providerName: "David Cooper",
    memberGroupName: "Medicare Advantage",
    billedAmount: 200,
    allowedAmount: 193.6,
    paidAmount: 193.6,
    processedDate: "05/19/2020",
    examinerName: "Devika Kumari",
    fromUserGroup: "Hcc_Super_User",
    fromUserName: "Brian Blaze",
    toUserRole: "CLAIMS AUDITOR",
    fromRouteComments: "manager",
    fromRouteReason: "Pending For Long Time",
    toAuditorExaminerNames: [
      {
        id: 123,
        name: "Tony Stark"
      },
      {
        id: 107,
        name: "Brian Blaze"
      },
      {
        id: 118,
        name: "George Floyd"
      }
    ],
    toRouteReason: [
      {
        routeReasonCode: 19,
        routeReason: "Already Routed Claim"
      },
      {
        routeReasonCode: 1,
        routeReason: "Incorrect Assignment"
      },
      {
        routeReasonCode: 2,
        routeReason: "Approval Required"
      },
      {
        routeReasonCode: 3,
        routeReason: "Pending Claim"
      },
      {
        routeReasonCode: 10,
        routeReason: "Pending For Long Time"
      },
      {
        routeReasonCode: 13,
        routeReason: "Review to Medical Management"
      }
    ]
  };
  res.status(200).json(payload);
});

app.get("/api/audit/manager-lead-route-to/lead/claim", (req, res, next) => {
  const payload = {
    auditTaskId: 44,
    claimId: "20191008000001",
    claimType: "Professional",
    claimStatus: "Final",
    queueName: "hcc_super_user",
    receiptDate: "05/19/2020",
    claimsAge: 82,
    providerName: "David Cooper",
    memberGroupName: "Medicare Advantage",
    billedAmount: 200,
    allowedAmount: 193.6,
    paidAmount: 193.6,
    processedDate: "05/19/2020",
    examinerName: "Devika Kumari",
    fromUserGroup: "Hcc_Super_User",
    fromUserName: "Brian Blaze",
    toUserRole: "CLAIMS AUDITOR",
    fromRouteComments: "manager",
    fromRouteReason: "Pending For Long Time",
    toAuditorExaminerNames: [
      {
        id: 123,
        name: "Tony Stark"
      },
      {
        id: 107,
        name: "Brian Blaze"
      },
      {
        id: 118,
        name: "George Floyd"
      }
    ],
    toRouteReason: [
      {
        routeReasonCode: 19,
        routeReason: "Already Routed Claim"
      },
      {
        routeReasonCode: 1,
        routeReason: "Incorrect Assignment"
      },
      {
        routeReasonCode: 2,
        routeReason: "Approval Required"
      },
      {
        routeReasonCode: 3,
        routeReason: "Pending Claim"
      },
      {
        routeReasonCode: 10,
        routeReason: "Pending For Long Time"
      },
      {
        routeReasonCode: 13,
        routeReason: "Review to Medical Management"
      }
    ]
  };

  res.status(200).json(payload);
});

app.get(
  "/api/audit/manager-lead-route-to/lead-claim-from-grid",
  (req, res, next) => {
    const payload = {
      auditTaskId: 44,
      claimId: "20191008000001",
      claimType: "Professional",
      claimStatus: "Final",
      queueName: "hcc_super_user",
      receiptDate: "05/19/2020",
      claimsAge: 82,
      providerName: "David Cooper",
      memberGroupName: "Medicare Advantage",
      billedAmount: 200,
      allowedAmount: 193.6,
      paidAmount: 193.6,
      processedDate: "05/19/2020",
      examinerName: "Devika Kumari",
      fromUserGroup: "Hcc_Super_User",
      fromUserName: "Brian Blaze",
      toUserRole: "CLAIMS AUDITOR",
      fromRouteComments: "manager",
      fromRouteReason: "Pending For Long Time",
      toAuditorExaminerNames: [
        {
          id: 123,
          name: "Tony Stark"
        },
        {
          id: 107,
          name: "Brian Blaze"
        },
        {
          id: 118,
          name: "George Floyd"
        }
      ],
      toRouteReason: [
        {
          routeReasonCode: 19,
          routeReason: "Already Routed Claim"
        },
        {
          routeReasonCode: 1,
          routeReason: "Incorrect Assignment"
        },
        {
          routeReasonCode: 2,
          routeReason: "Approval Required"
        },
        {
          routeReasonCode: 3,
          routeReason: "Pending Claim"
        },
        {
          routeReasonCode: 10,
          routeReason: "Pending For Long Time"
        },
        {
          routeReasonCode: 13,
          routeReason: "Review to Medical Management"
        }
      ]
    };
    res.status(200).json(payload);
  }
);

app.get(
  "/api/audit/manager-lead-route-to/manager-claim-from-grid",
  (req, res, next) => {
    const payload = {
      auditTaskId: 44,
      claimId: "20191008000001",
      claimType: "Professional",
      claimStatus: "Final",
      queueName: "hcc_super_user",
      receiptDate: "05/19/2020",
      claimsAge: 82,
      providerName: "David Cooper",
      memberGroupName: "Medicare Advantage",
      billedAmount: 200,
      allowedAmount: 193.6,
      paidAmount: 193.6,
      processedDate: "05/19/2020",
      examinerName: "Devika Kumari",
      fromUserGroup: "Hcc_Super_User",
      fromUserName: "Brian Blaze",
      toUserRole: "CLAIMS AUDITOR",
      fromRouteComments: "manager",
      fromRouteReason: "Pending For Long Time",
      toAuditorExaminerNames: [
        {
          id: 123,
          name: "Tony Stark"
        },
        {
          id: 107,
          name: "Brian Blaze"
        },
        {
          id: 118,
          name: "George Floyd"
        }
      ],
      toRouteReason: [
        {
          routeReasonCode: 19,
          routeReason: "Already Routed Claim"
        },
        {
          routeReasonCode: 1,
          routeReason: "Incorrect Assignment"
        },
        {
          routeReasonCode: 2,
          routeReason: "Approval Required"
        },
        {
          routeReasonCode: 3,
          routeReason: "Pending Claim"
        },
        {
          routeReasonCode: 10,
          routeReason: "Pending For Long Time"
        },
        {
          routeReasonCode: 13,
          routeReason: "Review to Medical Management"
        }
      ]
    };
    res.status(200).json(payload);
  }
);

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: "Post added successfully"
  });
});

app.post("/api/target-settings/saveFinancialSettings", (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: "Target saved successfully"
  });
});

app.post("/api/target-settings/updateFinancialSettings", (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: "Target saved successfully"
  });
});

app.post("/api/target-settings/saveProceduralSettings", (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: "Target saved successfully"
  });
});

app.post("/api/target-settings/updateProceduralSettings", (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: "Target saved successfully"
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "fadf12421l",
      title: "First server-side post",
      content: "This is coming from the server"
    },
    {
      id: "ksajflaj132",
      title: "Second server-side post",
      content: "This is coming from the server!"
    }
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts
  });
});

app.get("/api/claim/pended", (req, res, next) => {
  // const payload = {
  //   claimId:
  //     Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
  //     100000000000,
  //   claimFactKey: 7,
  //   taskId: 72,
  //   claimReceivedDate: "2019-10-11",
  //   age: 96.0,
  //   status: "Pended",
  //   queueName: "NO NAME",
  //   endTimer: "15:25:15",
  //   firstPendDate: "2019-10-11",
  //   lastPendDate: "2019-10-11",
  //   pendReason: "These people always have some reasons",
  //   comments: "Ada mownaa ithonnum athra nellathalla ketto"
  // };

  const payload = {
    age: 96,
    claimId:
      Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
      100000000000,
    claimReceivedDate: "2019-10-11",
    claimStagingId: 0,
    queueName: "NO NAME",
    status: "Pended",
    taskId: 72,
    pendReason: "Pended for Now.",
    comments: "Clarifications needed for the claim",
    firstPendDate: "2019-10-11",
    endTimer: "15:25:35",
    lastPendDate: "2019-10-11"
  };
  res.status(200).json(payload);
});

app.get("/api/claim/routedIn", (req, res, next) => {
  const payload = {
    age: 96,
    claimId:
      Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
      100000000000,
    claimReceivedDate: "2019-10-11",
    claimStagingId: 0,
    queueName: "NO NAME",
    status: "Routed In",
    taskId: 72,
    routeReason: "Incorret assignment",
    comments: "Routing due to incorrect assignment"
  };
  res.status(200).json(payload);
});

app.get("/api/claim", (req, res, next) => {
  // const payload = {
  //   claimId:
  //     Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
  //     100000000000,
  //   claimFactKey: 0,
  //   taskId: 69,
  //   claimReceivedDate: "2019-10-15",
  //   age: 92.0,
  //   status: "Routed",
  //   routeReason: "Some Reason",
  //   queueName: "Some Name",
  //   comments: "get comments",
  //   endTimer: "15:15:35"
  // };

  const payload = {
    claimStagingId: 7,
    claimId:
      Math.floor(Math.random() * (999999999999 - 100000000000 + 1)) +
      100000000000,
    taskId: 9,
    claimReceivedDate: "10/10/2019",
    age: 132,
    queueName: "Itemized Bill WB",
    status: "INITIALIZED"
  };

  res.status(200).json(payload);
});

app.get("/api/claim/dashboard", (req, res, next) => {
  const payload = {
    completedCount: 1,
    pendCount: 8,
    routedInCount: 6,
    routedOutCount: 1,
    userTarget: 50
  };
  res.status(200).json(payload);
});

app.get("/api/report/get-reports", (req, res, next) => {
  const reports = [
    {
      reportFilter: {
        selectedClaimids: ["100003", "100004"],
        billedAmountFrom: 1000,
        billedAmountTo: 2000,
        allowedAmountFrom: 7500,
        allowedAmountTo: 68900,
        selectedWbids: ["WB4", "WB5"],
        selectedClaimsources: ["Claim Source 5", "Claim Source 4"],
        age: 25,
        selectedSupplierName: ["Supplier 2", "Supplier 4"],
        last: 1
      },
      reportId: 1
    },
    {
      reportFilter: {
        selectedClaimids: ["100001", "100006"],
        billedAmountFrom: 2000,
        billedAmountTo: 3000,
        allowedAmountFrom: 10000,
        allowedAmountTo: 145620,
        selectedWbids: ["WB4", "WB5"],
        selectedClaimsources: ["Claim Source 1", "Claim Source 2"],
        age: 15,
        selectedSupplierName: ["Supplier 2", "Supplier 4"],
        last: 2
      },
      reportId: 2
    },
    {
      reportFilter: {
        selectedClaimids: ["100002", "100005"],
        billedAmountFrom: 3000,
        billedAmountTo: 4000,
        allowedAmountFrom: 30000,
        allowedAmountTo: 423432,
        selectedWbids: ["WB4", "WB5"],
        selectedClaimsources: ["Claim Source 3", "Claim Source 5"],
        age: 10,
        selectedSupplierName: ["Supplier 2", "Supplier 4"],
        last: 3
      },
      reportId: 3
    }
  ];
  res.status(200).json(reports);
});

app.post("/api/claim/route", (req, res, next) => {
  const claim = {
    message: "succes"
  };
  res.status(200).json(claim);
});

app.post("/api/claim/lead/route", (req, res, next) => {
  const claim = {
    message: "succes"
  };
  res.status(200).json(claim);
});
app.post("/api/claim/pend", (req, res, next) => {
  const claim = {
    message: "succes"
  };
  res.status(200).json(claim);
});
app.post("/api/claim/complete", (req, res, next) => {
  const claim = {
    message: "succes"
  };
  res.status(200).json(claim);
});

app.get("/api/audit-mode/audit-claim", (req, res, next) => {
  const claim = {
    billedAmount: 0,
    claimId: "123",
    claimSource: "Source",
    claimType: "Type",
    entryDate: "2019-12-04T11:52:49.474Z",
    finalizedBy: "Me",
    finalizedDate: "2019-12-04T11:52:49.474Z",
    receiptDate: "2019-12-04T11:52:49.474Z",
    reviewRepairReason: "NO Reason",
    state: "state",
    workBasketName: "WB",
    taskAssignmentId: 3
  };
  res.status(200).json(claim);
});

app.post("/api/audit-mode/assign-task", (req, res, next) => {
  const claim = {
    auditTaskId: 1,
    auditorAction: null,
    auditorComments: null,
    auditorID: "bbb@abc.com",
    createdAt: "2019-12-05T09:22:24.635Z",
    auditorPrimaryEmail: "bbb@abc.com",
    processorPrimaryEmail: "abc@abc.com",
    processorAction: "Accept",
    processorComments: "No Comments",
    processorId: "abc@abc.com",
    taskAssignmentId: 3,
    verificationCriteria: "No Idea"
  };
  res.status(200).json(claim);
});

app.post("/api/audit-mode/update-auditor-task", (req, res, next) => {
  res.status(200).json({ success: true });
});

app.post("/api/resource-dashboard/manager/productivity", (req, res, next) => {
  res.status(200).json({
    examinerName: "Manju Vargheese",
    userProductivityDto: [
      {
        month: "Jan 2020",
        claimCount: 93,
        target: 92
      },
      {
        month: "Feb 2020",
        claimCount: 94,
        target: 93
      },
      {
        month: "Mar 2020",
        claimCount: 99,
        target: 98
      },
      {
        month: "Apr 2020",
        claimCount: 96,
        target: 94
      },
      {
        month: "May 2020",
        claimCount: 96,
        target: 95
      },
      {
        month: "Jun 2020",
        claimCount: 95,
        target: 97
      },
      {
        month: "Jul 2020",
        claimCount: 98,
        target: 96
      },
      {
        month: "Aug 2020",
        claimCount: 99,
        target: 94
      }
    ]
  });
});

app.post("/api/resource-dashboard/lead/productivity", (req, res, next) => {
  res.status(200).json({
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
      },
      {
        hour: 6,
        claimCount: 0,
        target: 2
      },
      {
        hour: 7,
        claimCount: 0,
        target: 2
      },
      {
        hour: 8,
        claimCount: 0,
        target: 2
      },
      {
        hour: 9,
        claimCount: 0,
        target: 2
      },
      {
        hour: 10,
        claimCount: 1,
        target: 2
      },
      {
        hour: 11,
        claimCount: 0,
        target: 2
      },
      {
        hour: 12,
        claimCount: 0,
        target: 2
      },
      {
        hour: 13,
        claimCount: 0,
        target: 2
      },
      {
        hour: 14,
        claimCount: 0,
        target: 2
      },
      {
        hour: 15,
        claimCount: 0,
        target: 2
      },
      {
        hour: 16,
        claimCount: 1,
        target: 2
      },
      {
        hour: 17,
        claimCount: 0,
        target: 2
      },
      {
        hour: 18,
        claimCount: 0,
        target: 2
      },
      {
        hour: 19,
        claimCount: 0,
        target: 2
      },
      {
        hour: 20,
        claimCount: 0,
        target: 2
      },
      {
        hour: 21,
        claimCount: 0,
        target: 2
      },
      {
        hour: 22,
        claimCount: 0,
        target: 2
      },
      {
        hour: 23,
        claimCount: 0,
        target: 2
      }
    ]
  });
});
//draw-score --b
app.post("/api/resource-dashboard/productivity-per-user", (req, res, next) => {
  res.status(200).json({
    userProductivityDto: [
      {
        hour: 9,
        claimCount: 25,
        target: 5
      },
      {
        hour: 10,
        claimCount: 25,
        target: 12
      },
      {
        hour: 11,
        claimCount: 25,
        target: 20
      },
      {
        hour: 12,
        claimCount: 25,
        target: 15
      },
      {
        hour: 13,
        claimCount: 25,
        target: 12
      },
      {
        hour: 14,
        claimCount: 25,
        target: 9
      },
      {
        hour: 15,
        claimCount: 25,
        target: 12
      },
      {
        hour: 16,
        claimCount: 25,
        target: 20
      },
      {
        hour: 17,
        claimCount: 25,
        target: 15
      },
      {
        hour: 18,
        claimCount: 25,
        target: 20
      },
      {
        hour: 19,
        claimCount: 25,
        target: 20
      },
      {
        hour: 20,
        claimCount: 25,
        target: 20
      },
      {
        hour: 21,
        claimCount: 25,
        target: 20
      },
      {
        hour: 22,
        claimCount: 25,
        target: 20
      },
      {
        hour: 23,
        claimCount: 25,
        target: 20
      },
      {
        hour: 24,
        claimCount: 25,
        target: 20
      },
      {
        hour: 01,
        claimCount: 25,
        target: 20
      },
      {
        hour: 02,
        claimCount: 25,
        target: 20
      },
      {
        hour: 03,
        claimCount: 25,
        target: 20
      },
      {
        hour: 04,
        claimCount: 25,
        target: 20
      },
      {
        hour: 05,
        claimCount: 25,
        target: 20
      },
      {
        hour: 06,
        claimCount: 4,
        target: 20
      },
      {
        hour: 07,
        claimCount: 25,
        target: 20
      },
      {
        hour: 08,
        claimCount: 6,
        target: 20
      }
    ],
    timestamp: "2019-12-31T06:34:32.758+0000",
    status: 200,
    error: "",
    message: "my contribution fetched successfully!",
    path: "/api/resource-dashboard/productivity-per-user"
  });
});

//   res.status(404).json({
//     "timestamp": "2019-12-31T06:34:32.758+0000",
//     "status": 404,
//     "error": "Not Found",
//     "message": "No finance claim details found for the user",
//     "path": "/api/resource-dashboard/financial-accuracy/user"
//   });
// });

app.post(
  "/api/resource-dashboard/financial-accuracy/user",
  (req, res, next) => {
    res.status(200).json({
      financialAccuracyDtos: [
        {
          monthStartDate: "2019-12-01",
          financialAccuracy: 94.598,
          target: 98.0
        },
        {
          monthStartDate: "2020-01-01",
          financialAccuracy: 92.552,
          target: 98.0
        },
        {
          monthStartDate: "2020-02-01",
          financialAccuracy: 99.072,
          target: 98.0
        }
      ],
      timestamp: "2019-12-31T06:34:32.758+0000",
      status: 200,
      error: "",
      message: "my finance fetched successfully!",
      path: "/api/resource-dashboard/financial-accuracy/user"
      // "timestamp": "2019-12-31T06:34:32.758+0000",
      // "status": 404,
      // "error": "Not Found",
      // "message": "No finance claim details found for the user",
      // "path": "/api/resource-dashboard/financial-accuracy/user"
    });
  }
);

app.post(
  "/api/resource-dashboard/procedural-accuracy-per-user",
  (req, res, next) => {
    const userProcedureDto = {
      proceduralAccuracyDtoList: [
        {
          monthStartDate: "2020-02-01",
          proceduralErrorCount: 1,
          totalAuditedClaims: 2,
          proceduralAccuracyPct: 0.95656,
          target: 0.98
        },
        {
          monthStartDate: "2020-02-03",
          proceduralErrorCount: 1,
          totalAuditedClaims: 2,
          proceduralAccuracyPct: 0.99452,
          target: 0.98
        },
        {
          monthStartDate: "2020-02-05",
          proceduralErrorCount: 1,
          totalAuditedClaims: 2,
          proceduralAccuracyPct: 0.977565,
          target: 0.98
        }
      ]
    };
    res.status(200).json(userProcedureDto);
    // res.status(404).json({
    //   "timestamp": "2019-12-31T06:34:32.758+0000",
    //   "status": 404,
    //   "error": "Not Found",
    //   "message": "No finance claim details found for the user",
    //   "path": "/api/resource-dashboard/financial-accuracy/user"
    // });
  }
);

app.post("/api/resource-dashboard/claims-status-per-user", (req, res, next) => {
  res.status(200).json({
    userStatusDtos: [
      { status: "Routed Out", claimCount: 3 },
      { status: "Completed", claimCount: 12 },
      { status: "Pended", claimCount: 2 }
    ]
  });
});

app.get("/api/audit/home/dashboard/audit-status", (req, res, next) => {
  res.status(200).json({
    //   "timestamp": "2019-12-31T06:34:32.758+0000",
    //   "status": 404,
    //   "error": "Not Found",
    //   "message": "No claim status details found",
    //   "path": "/api/resource-dashboard/claims-per-status"
    // });
    auditStatusCountDtos: [
      {
        status: "Audit Failed",
        claimCount: 12
      },
      {
        status: "Audit Passed",
        claimCount: 12
      },
      {
        status: "Audit Rebutted",
        claimCount: 13
      }
    ]
  });
});

app.get("/api/audit/home/dashboard/quality-graph", (req, res, next) => {
  res.status(200).json({
    //   "timestamp": "2019-12-31T06:34:32.758+0000",
    //   "status": 404,
    //   "error": "Not Found",
    //   "message": "No claim status details found",
    //   "path": "/api/resource-dashboard/claims-per-status"
    // });
    auditStatusCountDtos: [
      {
        status: "Audit Failed",
        claimCount: 12
      },
      {
        status: "Rebuttal Accepted",
        claimCount: 2
      }
    ]
  });
});

app.post(
  "/api/resource-dashboard/rebuttal-failed-accepted",
  (req, res, next) => {
    res.status(200).json(
      //   "timestamp": "2019-12-31T06:34:32.758+0000",
      //   "status": 404,
      //   "error": "Not Found",
      //   "message": "No claim status details found",
      //   "path": "/api/resource-dashboard/claims-per-status"
      // });
      {
        auditStatusCountDtos: [
          {
            status: "Rebuttal Accepted",
            claimCount: 6
          },
          {
            status: "Rebuttal Failed",
            claimCount: 1
          }
        ]
      }
    );
  }
);

app.get("/api/audit/home/dashboard/audited-by-category", (req, res, next) => {
  res.status(200).json({
    //   "timestamp": "2019-12-31T06:34:32.758+0000",
    //   "status": 404,
    //   "error": "Not Found",
    //   "message": "No claim status details found",
    //   "path": "/api/resource-dashboard/claims-per-status"
    // });

    auditCategoryDtos: [
      {
        category: "Institutional-IP",
        count: 5
      },
      {
        category: "Institutional-OP",
        count: 13
      },
      {
        category: "Professional",
        count: 11
      },
      {
        category: "EDI",
        count: 22
      },
      {
        category: "Paper",
        count: 3
      },
      {
        category: "Denied",
        count: 5
      },
      {
        category: "Check Issued",
        count: 18
      },
      {
        category: "Check Not Issued",
        count: 7
      },
      {
        category: "Manually Adjudicated",
        count: 25
      },
      {
        category: "Auto Adjudicated",
        count: 22
      },
      {
        category: "Others",
        count: 15
      }
    ]
  });
});

app.post(
  "/api/resource-dashboard/manager/claims-processed-vs-audited",
  (req, res, next) => {
    res.status(200).json({
      processedCount: 115,
      userProcessedDtos: [
        {
          status: "Audited",
          claimCount: 110
        },
        {
          status: "Not Audited",
          claimCount: 15
        }
      ],

      timestamp: "2019-12-31T06:34:32.758+0000",
      status: 200,
      error: "",
      message: "my contribution fetched successfully!",
      path: "/api/resource-dashboard/claims-per-status"
    });
  }
);

app.post(
  "/api/resource-dashboard/lead/claims-processed-vs-audited",
  (req, res, next) => {
    res.status(200).json({
      processedCount: 18,
      userProcessedDtos: [
        {
          status: "Audited",
          claimCount: 8
        },
        {
          status: "Not Audited",
          claimCount: 10
        }
      ]
    });
  }
);

app.post(
  "/api/resource-dashboard/lead/claims-processed-vs-audited",
  (req, res, next) => {
    res.status(200).json({
      processedCount: 8,
      userProcessedDtos: [
        {
          status: "Audited",
          claimCount: 5
        },
        {
          status: "Not Audited",
          claimCount: 3
        }
      ],

      timestamp: "2019-12-31T06:34:32.758+0000",
      status: 200,
      error: "",
      message: "my contribution fetched successfully!",
      path: "/api/resource-dashboard/claims-per-status"
    });
  }
);

app.post("/api/resource-dashboard/claim-queue-count", (req, res, next) => {
  const managerStatusScoreDto = [
    {
      managerStatusScoreDto: {
        Completed: 7,
        Assigned: 3,
        ToDo: 5,
        quename: "High Dollar WB",
        Pended: 21
      }
    },
    {
      managerStatusScoreDto: {
        Completed: 17,
        Assigned: 11,
        ToDo: 5,
        quename: "High Priority WB",
        Pended: 22
      }
    },
    {
      managerStatusScoreDto: {
        ToDo: 5,
        quename: "High Demanding WB",
        Pended: 15
      }
    }
  ];
  res.status(200).json(managerStatusScoreDto);
  // res.status(404).json({
  //   "timestamp": "2019-12-31T06:34:32.758+0000",
  //   "status": 404,
  //   "error": "Not Found",
  //   "message": "No claim status details found",
  //   "path": "/api/resource-dashboard/claims-per-status"
  // });
});

app.post("/api/resource-dashboard/claim-queue-count-lead", (req, res, next) => {
  const leadStatusScoreDto = [
    {
      leadStatusScoreDto: {
        Completed: 7,
        Assigned: 3,
        ToDo: 5,
        quename: "High Dollar WB",
        Pended: 21
      }
    },
    {
      leadStatusScoreDto: {
        ToDo: 15,
        quename: "High Demanding WB",
        Pended: 20
      }
    },
    {
      leadStatusScoreDto: {
        Completed: 27,
        Assigned: 13,
        ToDo: 5,
        quename: "High Priority WB",
        Pended: 21
      }
    }
  ];
  res.status(200).json(leadStatusScoreDto);
  // res.status(404).json({
  //   "timestamp": "2019-12-31T06:34:32.758+0000",
  //   "status": 404,
  //   "error": "Not Found",
  //   "message": "No claim status details found",
  //   "path": "/api/resource-dashboard/claims-per-status"
  // });
});

app.post("/api/resource-dashboard/lead/audit-graph", (req, res, next) => {
  res.status(200).json({
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
  });
  // res.status(404).json({
  //   "timestamp": "2019-12-31T06:34:32.758+0000",
  //   "status": 404,
  //   "error": "Not Found",
  //   "message": "No claim status details found",
  //   "path": "/api/resource-dashboard/claims-per-status"
  // });
});

app.post("/api/resource-dashboard/getClaimsBasedOnAge", (req, res, next) => {
  res.status(200).json([
    {
      ageRange: "1-7",
      pended: 5,
      routedOut: 3,
      routedIn: 13,
      completed: 10,
      toDo: 12
    },
    {
      ageRange: "8-14",
      pended: 5,
      routedOut: 6,
      routedIn: 10,
      completed: 8,
      toDo: 4
    },
    {
      ageRange: "15-21",
      pended: 13,
      routedOut: 12,
      routedIn: 4,
      completed: 6,
      toDo: 8
    },
    {
      ageRange: "22-28",
      pended: 13,
      routedOut: 4,
      routedIn: 6,
      completed: 12,
      toDo: 10
    },
    {
      ageRange: "29-35",
      pended: 12,
      routedOut: 10,
      routedIn: 4,
      completed: 13,
      toDo: 15
    },
    {
      ageRange: "36-42",
      pended: 5,
      routedOut: 12,
      routedIn: 16,
      completed: 8,
      toDo: 12
    },
    {
      ageRange: "43-49",
      pended: 5,
      routedOut: 6,
      routedIn: 8,
      completed: 13,
      toDo: 15
    },
    {
      ageRange: "50-56",
      pended: 14,
      routedOut: 16,
      routedIn: 12,
      completed: 17,
      toDo: 18
    },
    {
      ageRange: "57-63",
      pended: 13,
      routedOut: 16,
      routedIn: 13,
      completed: 6,
      toDo: 3
    },
    {
      ageRange: ">64",
      pended: 5,
      routedOut: 3,
      routedIn: 4,
      completed: 6,
      toDo: 8
    }
  ]);
  // res.status(404).json({
  //   "timestamp": "2019-12-31T06:34:32.758+0000",
  //   "status": 404,
  //   "error": "Not Found",
  //   "message": "No claim status details found",
  //   "path": "/api/resource-dashboard/claims-per-status"
  // });
});

app.post("/api/resource-dashboard/claim-age-lead", (req, res, next) => {
  res.status(200).json([
    {
      claimVolumeByAge: {
        PENDED: 3,
        ROUTEDOUT: 6,
        ROUTEDIN: 3,
        COMPLETED: 6,
        TODO: 3,
        age: "50-56"
      }
    },
    {
      claimVolumeByAge: {
        PENDED: 6,
        ROUTEDOUT: 5,
        ROUTEDIN: 1,
        COMPLETED: 3,
        TODO: 3,
        age: ">64"
      }
    }
  ]);
  // res.status(404).json({
  //   "timestamp": "2019-12-31T06:34:32.758+0000",
  //   "status": 404,
  //   "error": "Not Found",
  //   "message": "No claim status details found",
  //   "path": "/api/resource-dashboard/claims-per-status"
  // });
});

app.post("/api/reports/users-list-report-manager-view", (req, res, next) => {
  const response = [
    {
      id: 1,
      slNo: 0,
      firstName: "Manju",
      lastName: "Varghese",
      userName: "manju.varghese@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Beginner",
      userGroupTypes: "Claims"
    },
    {
      id: 2,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    },
    {
      id: 3,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    },
    {
      id: 4,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    },
    {
      id: 5,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    },
    {
      id: 6,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    },
    {
      id: 7,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    },
    {
      id: 8,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    },
    {
      id: 9,
      slNo: 0,
      firstName: "Tino",
      lastName: "Jose",
      userName: "tino.jose@ust-global.com",
      role: "Claims Lead",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: null,
      managerName: "Deepa John",
      leadName: null,
      proficiency: "Expert",
      userGroupTypes: "Claims"
    }
  ];
  res.status(200).json(
    response

    // timestamp: "2019-12-31T06:34:32.758+0000",
    // status: 404,
    // error: "Not Found",
    // message: "No report data found for the selected criteria",
    // path: "/api/resource-dashboard/claims-audited-per-user"
  );
});

app.post("/api/resource-dashboard/manager/audit-graph", (req, res, next) => {
  res.status(200).json({
    userAuditScoreDto: [
      {
        leadId: 6,
        leadName: "Devika M",
        passedAuditCount: 11,
        failedAuditCount: 4
      },
      {
        leadId: 7,
        leadName: "Brian Blaze",
        passedAuditCount: 0,
        failedAuditCount: 0
      }
    ]
  });
  //   res.status(404).json({
  //     timestamp: "2019-12-31T06:34:32.758+0000",
  //     status: 404,
  //     error: "",
  //     message: "No Data Found!",
  //     path: "/api/resource-dashboard/manager/audit-graph"
  // });
});

app.post("/api/resource-dashboard/quality-score-per-user", (req, res, next) => {
  res.status(200).json({
    userAuditScoreDto: [
      {
        startDate: "2019-10-07",
        completedAuditCount: 5,
        failedAuditCount: 3
      },
      {
        startDate: "2019-11-07",
        completedAuditCount: 5,
        failedAuditCount: 3
      },
      {
        startDate: "2019-12-07",
        completedAuditCount: 5,
        failedAuditCount: 3
      },
      {
        startDate: "2020-01-07",
        completedAuditCount: 5,
        failedAuditCount: 3
      },
      {
        startDate: "2020-02-04",
        completedAuditCount: 5,
        failedAuditCount: 3
      },
      {
        startDate: "2020-03-02",
        completedAuditCount: 7,
        failedAuditCount: 5
      }
    ]
  });
  //   res.status(404).json({
  //     timestamp: "2019-12-31T06:34:32.758+0000",
  //     status: 404,
  //     error: "",
  //     message: "No Data Found!",
  //     path: "/api/resource-dashboard/claims-audited-per-user"
  // });
});
app.post(
  "/api/audit-dashboard/claims-processed-vs-audited",
  (req, res, next) => {
    res.status(200).json({
      userAuditScoreDto: [
        {
          startDate: "2019-10-10",
          endDate: "2019-10-16",
          claimsProcessed: 5,
          claimsAudited: 3
        },
        {
          startDate: "2019-10-17",
          endDate: "2019-10-23",
          claimsProcessed: 5,
          claimsAudited: 6
        },
        {
          startDate: "2019-10-24",
          endDate: "2019-10-31",
          claimsProcessed: 15,
          claimsAudited: 13
        },
        {
          startDate: "2019-11-01",
          endDate: "2019-11-07",
          claimsProcessed: 10,
          claimsAudited: 7
        }
      ]
    });
    //   res.status(404).json({
    //     timestamp: "2019-12-31T06:34:32.758+0000",
    //     status: 404,
    //     error: "",
    //     message: "No Data Found!",
    //     path: "/api/resource-dashboard/claims-audited-per-user"
    // });
  }
);

app.get("/api/resource-dashboard/getQueueNames", (req, res, next) => {
  res.status(200).json([
    {
      value: 1,
      label: "Itemized Bill WB"
    },
    {
      value: 2,
      label: "High Dollar WB"
    },
    {
      value: 8,
      label: "Missing Member WB"
    }
  ]);
  //   res.status(404).json({
  //     timestamp: "2019-12-31T06:34:32.758+0000",
  //     status: 404,
  //     error: "",
  //     message: "No Data Found!",
  //     path: "/api/resource-dashboard/claims-audited-per-user"
  // });
});

app.post("/api/audit-dashboard/claims-audit-summary", (req, res, next) => {
  res.status(200).json({
    auditSummaryDtos: [
      {
        startDate: "2020-04-27",
        endDate: null,
        passedAuditCount: 1,
        failedAuditCount: 0
      },
      {
        startDate: "2020-04-29",
        endDate: null,
        passedAuditCount: 1,
        failedAuditCount: 1
      },
      {
        startDate: "2020-05-04",
        endDate: null,
        passedAuditCount: 1,
        failedAuditCount: 0
      },
      {
        startDate: "2020-05-05",
        endDate: null,
        passedAuditCount: 2,
        failedAuditCount: 1
      }
    ]
  });
  //   res.status(404).json({
  //     timestamp: "2019-12-31T06:34:32.758+0000",
  //     status: 404,
  //     error: "",
  //     message: "No Data Found!",
  //     path: "/api/resource-dashboard/claims-audited-per-user"
  // });
});

app.post("/api/audit-dashboard/claims-audited-by-queue", (req, res, next) => {
  res.status(200).json({
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
  });
  //   res.status(404).json({
  //     timestamp: "2019-12-31T06:34:32.758+0000",
  //     status: 404,
  //     error: "",
  //     message: "No Data Found!",
  //     path: "/api/resource-dashboard/claims-audited-per-user"
  // });
});

app.post("/auth/token/authenticate", (req, res, next) => {
  const token = {
    // passwordReset: true,
    jwttoken:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhYmNAYWJjLmNvbSIsInNjb3BlcyI6IlJPTEVfQ2xhaW0gUHJvY2Vzc29yIiwiaWF0IjoxNTc2MTQyMzExLCJleHAiOjE1NzYxNjAzMTF9.ety5pq5D6PQ6lTOlkdvTYx6Vhd49NJq1Z_uD58e7GO2WjSqa6G9ZMFo5N6TMVk_W"
  };
  res.status(200).json(token);
  // res.status(404).json({
  //   "timestamp": "2020-01-09T07:36:09.012+0000",
  //   "status": 404,
  //   "error": "Not Found",
  //   "message": "Selected role is not available for the user admin@promt.com",
  //   "path": "/token/authenticate"
  // });
});

app.get("/auth/logout", (req, res, next) => {
  res.status(200).json("success");
});

app.post("/auth/token/force-logout", (req, res, next) => {
  res.status(200).json("success");
});

app.post("/auth/reset/password", (req, res, next) => {
  res.status(200).json("success");
});

//GET CLAIM DETAILS
app.get("/api/claim/list", (req, res, next) => {
  const claimDetails = [
    {
      taskId: 216,
      claimId: "20200501000005",
      receivedDate: "05/01/2020",
      age: 61,
      status: "Completed",
      queueName: "hcc_super_user",
      pendReason: null,
      firstPendDate: null,
      lastPendDate: null,
      routeReason: null,
      comments: null,
      reassignmentReason: null,
      reassignmentComments: null,
      isReassigned: null,
      leadName: null,
      userGroupName: null
    },
    {
      taskId: 203,
      claimId: "20200507000005",
      receivedDate: "05/07/2020",
      age: 55,
      status: "Pended",
      queueName: "hcc_super_user",
      pendReason: "Main Claims",
      firstPendDate: "06/25/2020 00:50",
      lastPendDate: "06/25/2020 00:50",
      routeReason: null,
      comments: "",
      reassignmentReason: null,
      reassignmentComments: null,
      isReassigned: null,
      leadName: null,
      userGroupName: "Hcc_Super_User"
    },
    {
      taskId: 213,
      claimId: "2019101100000004",
      receivedDate: "10/11/2019",
      age: 264,
      status: "Routed Out",
      queueName: "Itemized Bill WB",
      pendReason: null,
      firstPendDate: null,
      lastPendDate: null,
      routeReason: "Already Routed Claim",
      comments: "please work on this",
      reassignmentReason: null,
      reassignmentComments: null,
      isReassigned: null,
      leadName: "Manju Varghese",
      userGroupName: "Itemized_Bill_Team"
    },
    {
      taskId: 8,
      claimId: "2019101500000187",
      receivedDate: "03/03/2020",
      age: 120,
      status: "Routed In",
      queueName: "Itemized Bill WB",
      pendReason: null,
      firstPendDate: null,
      lastPendDate: null,
      routeReason: "Pending Claim",
      comments: "Pending Claim",
      reassignmentReason: null,
      reassignmentComments: null,
      isReassigned: null,
      leadName: "Manju Varghese",
      userGroupName: "UG2"
    }
  ];
  res.status(200).json(claimDetails);
});

app.get("/api/configuration/route/options", (req, res, next) => {
  const routedRoles = {
    routingOptionDtos: [
      {
        routeFrom: "2",
        routeTo: "4",
        routeStatus: true
      },
      {
        routeFrom: "4",
        routeTo: "2",
        routeStatus: true
      }
    ]
  };

  res.status(200).json(routedRoles);
});
app.post("/api/resource-dashboard/lead-count-manager", (req, res, next) => {
  res.status(200).json([
    {
      id: 6,
      count: 2,
      lead: "Devika M"
    },
    {
      id: 7,
      count: 0,
      lead: "Brian Blaze"
    }
  ]);
});

app.get("/api/resource-dashboard/queue-name/:userId", (req, res, next) => {
  const queues = [
    {
      queueId: 1,
      queueName: "Medi Care"
    },
    {
      queueId: 2,
      queueName: "HPS Special Care Unit"
    },
    {
      queueId: 3,
      queueName: "Critical Claims"
    },
    {
      queueId: 4,
      queueName: "High Dollar Value Claims"
    },
    {
      queueId: 5,
      queueName: "PHP Claims"
    },
    {
      queueId: 6,
      queueName: "Claim Defaulted Queue Claim IDDD"
    }
  ];
  res.status(200).json(queues);
});

app.get("/api/resource-dashboard/queue-name-lead/:userId", (req, res, next) => {
  const queues = [
    {
      queueName: "High Dollar WB",
      queueId: 2
    },
    {
      queueName: "Itemized Bill WB",
      queueId: 1
    }
  ];
  res.status(200).json(queues);
});

app.get(
  "/api/resource-dashboard/queue-name/lead/userId=:userId",
  (req, res, next) => {
    const queues = [
      {
        queueId: 1,
        queueName: "Medi Care"
      },
      {
        queueId: 2,
        queueName: "HPS Special Care Unit"
      },
      {
        queueId: 3,
        queueName: "Critical Claims"
      },
      {
        queueId: 4,
        queueName: "High Dollar Value Claims"
      },
      {
        queueId: 5,
        queueName: "PHP Claims"
      },
      {
        queueId: 6,
        queueName: "Claim Defaulted Queue Claim IDDD"
      }
    ];
    res.status(200).json(queues);
  }
);

app.get("/api/user-management/user/unlock?userId=:userId", (req, res, next) => {
  res.status(200).json({});
});

app.get(
  "/api/resource-dashboard/claim-status-lead/:userID",
  (req, res, next) => {
    const queues = [
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

    res.status(200).json(queues);
  }
);

app.get("/api/userGroup/lead-names/managerID=:managerID", (req, res, next) => {
  const leads = [
    {
      value: 11,
      label: "Brian P"
    },
    {
      value: 13,
      label: "Deepa S"
    }
  ];
  res.status(200).json(leads);
});

app.get("/api/scorecard/status", (req, res, next) => {
  const status = {
    status: [
      {
        id: 1,
        status: "Completed"
      },
      {
        id: 2,
        status: "Routed"
      },
      {
        id: 3,
        status: "Pended"
      },
      {
        id: 4,
        status: "Assigned"
      },
      {
        id: 5,
        status: "UnAssigned"
      }
    ]
  };
  res.status(200).json(status);
});

app.get("/api/resource-dashboard/getClaimStatus", (req, res, next) => {
  const status =
    // status: [
    //   {
    //     id: 1,
    //     status: "Complete"
    //   },
    //   {
    //     id: 2,
    //     status: "Pended"
    //   },
    //   {
    //     id: 3,
    //     status: "Routed In"
    //   },
    //   {
    //     id: 4,
    //     status: "Routed Out"
    //   },
    //   {
    //     id: 5,
    //     status: "To Do"
    //   }
    // ]
    ["Completed", "Pended", "Routed In", "Routed Out", "To Do"];

  res.status(200).json(status);
});

//GET USER ROLES
app.get("/api/user-management/roles", (req, res, next) => {
  const roles = {
    roles: [
      {
        id: 1,
        roleName: "Administrator",
        isRoutingEnabled: null
      },
      {
        id: 2,
        roleName: "Claims Examiner",
        isRoutingEnabled: null
      },
      {
        id: 3,
        roleName: "Claims Auditor",
        isRoutingEnabled: null
      },
      {
        id: 4,
        roleName: "Claims Lead",
        isRoutingEnabled: "Y"
      },
      {
        id: 5,
        roleName: "Approver",
        isRoutingEnabled: "Y"
      },
      {
        id: 6,
        roleName: "Manager",
        isRoutingEnabled: "Y"
      }
    ]
  };
  res.status(200).json(roles);
});

app.get("/api/configuration/roles", (req, res, next) => {
  const roleDetails = {
    roles: [
      {
        id: 2,
        roleName: "Claims Examiner",
        isRoutingEnabled: "Y"
      },
      {
        id: 4,
        roleName: "Claims Lead",
        isRoutingEnabled: "Y"
      },
      {
        id: 6,
        roleName: "Manager",
        isRoutingEnabled: "Y"
      }
    ]
  };
  res.status(200).json(roleDetails);
});

app.get("/api/configuration/pend/details", (req, res, next) => {
  const claimPendReasons = [
    {
      pendReasonCode: 1,
      pendReason: "test",
      pendStatus: true
    }
  ];
  res.status(200).json(claimPendReasons);
});

app.get("/api/claim/pend/reasons", (req, res, next) => {
  const claimPendReasons = [
    {
      pendReasonCode: 12,
      pendReason: "Pended",
      pendStatus: true
    }
  ];

  res.status(200).json(claimPendReasons);
});

// app.get("/api/configuration/roles", (req, res, next) => {
//   const roleDetails = {
//     roles: [
//       {
//         id: 2,
//         roleName: "Claims Examiner",
//         isRoutingEnabled: "Y"
//       },
//       {
//         id: 4,
//         roleName: "Claims Lead",
//         isRoutingEnabled: "Y"
//       },
//       {
//         id: 6,
//         roleName: "Manager",
//         isRoutingEnabled: "Y"
//       }
//     ]
//   };
//   res.status(200).json(roleDetails);
// });

app.get("/api/claim/route/roles", (req, res, next) => {
  const roleDetails = [
    {
      routeRoleId: 2,
      routeRoleName: "Claims Examiner"
    },
    {
      routeRoleId: 4,
      routeRoleName: "Claims Lead"
    },
    {
      routeRoleId: 6,
      routeRoleName: "Manager"
    }
  ];
  res.status(200).json(roleDetails);
});

app.get("/api/claim/route/reasons", (req, res, next) => {
  const claimRouteReasons = [
    {
      routeReasonCode: 1,
      routeReason: "Routed In",
      routeStatus: true
    },
    {
      routeReasonCode: 2,
      routeReason: "Routed Out",
      routeStatus: true
    },
    {
      routeReasonCode: 3,
      routeReason: "Routed",
      routeStatus: false
    }
  ];
  res.status(200).json(claimRouteReasons);
});

app.get("/api/claim/lead/route/reasons", (req, res, next) => {
  const claimRouteReasons = [
    {
      routeReasonCode: 1,
      routeReason: "Routed In",
      routeStatus: true
    },
    {
      routeReasonCode: 2,
      routeReason: "Routed Out",
      routeStatus: true
    },
    {
      routeReasonCode: 3,
      routeReason: "Routed",
      routeStatus: false
    }
  ];
  res.status(200).json(claimRouteReasons);
});

app.get("/api/configuration/route/details", (req, res, next) => {
  const claimRouteReasons = [
    {
      routeReasonCode: 1,
      routeReason: "Incorrect Assignment",
      routeStatus: true
    },
    {
      routeReasonCode: 2,
      routeReason: "Approval Required",
      routeStatus: true
    },
    {
      routeReasonCode: 3,
      routeReason: "Pending For Long",
      routeStatus: false
    },
    {
      routeReasonCode: 4,
      routeReason: "Review Medical Management",
      routeStatus: true
    },
    {
      routeReasonCode: 5,
      routeReason: "Transfer to Different Queue",
      routeStatus: false
    },
    {
      routeReasonCode: 6,
      routeReason: "Transfer to SME",
      routeStatus: true
    },
    {
      routeReasonCode: 7,
      routeReason: "Director Review",
      routeStatus: false
    }
  ];
  res.status(200).json(claimRouteReasons);
});

app.post("/api/claim/route/to-lead", (req, res, next) => {
  const routeUser = [
    {
      routeUserId: 2,
      routeUserName: "Sharath Smith"
    },
    {
      routeUserId: 3,
      routeUserName: "Joby John"
    },
    {
      routeUserId: 4,
      routeUserName: "Sharu John"
    },
    {
      routeUserId: 5,
      routeUserName: "John John"
    }
  ];
  res.status(200).json(routeUser);
});

app.post("/api/claim/lead/route/to-examiner", (req, res, next) => {
  const routeUser = [
    {
      routeUserId: 2,
      routeUserName: "Sharath Smith"
    },
    {
      routeUserId: 3,
      routeUserName: "Joby John"
    },
    {
      routeUserId: 4,
      routeUserName: "Sharu John"
    },
    {
      routeUserId: 5,
      routeUserName: "John John"
    }
  ];
  res.status(200).json(routeUser);
});

app.post("/api/configuration/pend/details", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/configuration/route/create", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/configuration/pend/create", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/configuration/route/options/create", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/draw-mode/route-reasons", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/reports/claims-status-report", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/reports/sampling-report", (req, res, next) => {
  res.status(200).json();
});

app.post("/api/manager/reports/claims-age-report", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/reports/productivity-report", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/reports/financial-score-report", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/reports/quality-score-report", (req, res, next) => {
  res.status(200).json();
});
app.post("/api/reports/procedural-score-report", (req, res, next) => {
  res.status(200).json();
});

app.get("/api/user-management/user/details", (req, res, next) => {
  const payload = {
    id: 4,
    firstName: "Manu",
    lastName: "Manoharan"
  };
  res.status(200).json(payload);
});

app.get("/api/login/password-reset-flag", (req, res, next) => {
  res.status(200).json({
    passwordReset: false
  });
});

// User Group

app.post("/api/userGroup/createUserGroup", (req, res, next) => {
  res.status(200).json();
});

app.post("/api/userGroup/updateUserGroup", (req, res, next) => {
  res.status(200).json();
});

app.get("/api/userGroup/deleteUserGroup", (req, res, next) => {
  res.status(200).json();
});

app.get("/api/userGroup/getUserGroupsForManager", (req, res, next) => {
  const payload = [
    {
      groupId: 1,
      groupName: "UG1",
      leadId: 1,
      leadName: "Claims Lead 1",
      managerId: 11,
      managerName: "Deepa Processor",
      target: 11,
      description: "UserGroup",
      userGroupType: {
        id: "1",
        name: "userGroupType 1"
      },
      queueName: {
        queueId: "1",
        queueName: "Queue 1"
      }
    },
    {
      groupId: 2,
      groupName: "UG2",
      leadId: 1,
      leadName: "Claims Lead 1",
      managerId: 11,
      managerName: "Deepa Processor",
      target: 11,
      description: "UserGroup",
      userGroupType: {
        id: "1",
        name: "userGroupType 1"
      },
      queueName: {
        queueId: "2",
        queueName: "Queue 2"
      }
    },
    {
      groupId: 3,
      groupName: "UG3",
      leadId: 1,
      leadName: "Claims Lead 1",
      managerId: 11,
      managerName: "Deepa Processor",
      target: 11,
      description: "UserGroup",
      userGroupType: {
        id: "1",
        name: "userGroupType 1"
      },
      queueName: {
        queueId: "3",
        queueName: "Queue 3"
      }
    }
  ];
  res.status(200).json(payload);
});

app.get("/api/user-management/user/:id", (req, res, next) => {
  const payload = [
    {
      groupId: 9,
      groupName: "Missing_Member_Team"
    },
    {
      groupId: 14,
      groupName: "UserGroup_Test"
    },
    {
      groupId: 2,
      groupName: "High_Dollar_Team"
    },
    {
      groupId: 11,
      groupName: "Manual_Pends_Team"
    }
  ];
  res.status(200).json({
    userGroups: payload
  });
});

app.post("/api/userGroup/claim-or-enrol-managers", (req, res, next) => {
  const payload = [
    { label: "Manger 1", value: 11 },
    { label: "Manger 2", value: 2 },
    { label: "Manger 3", value: 3 }
  ];
  res.status(200).json(payload);
});

app.get("/api/userGroup/lead-names", (req, res, next) => {
  const payload = [
    { label: "Claims Lead 1", value: 1 },
    { label: "Claims Lead 2", value: 2 },
    { label: "Claims Lead 3", value: 3 }
  ];
  res.status(200).json(payload);
});

app.post("/api/userGroup/claim-or-enrol-queues", (req, res, next) => {
  const payload = [
    { label: "Queue 1", value: 1 },
    { label: "Queue 2", value: 2 },
    { label: "Queue 3", value: 3 },
    { label: "Queue 4", value: 4 }
  ];
  res.status(200).json(payload);
});

app.get("/api/userGroup/work-item-types", (req, res, next) => {
  const payload = [
    { label: "Claim", value: 1 },
    { label: "Enrollment", value: 2 }
  ];
  res.status(200).json(payload);
});

app.get("/api/userGroup/getAllQueueNamesRefreshLead", (req, res, next) => {
  //res.status(200).json();
  const getQueueNamesResponse = [
    {
      queueId: 12,
      queueName: "UG41Lead",
      excluded: true
    },
    {
      queueId: 13,
      queueName: "UG42Lead",
      excluded: true
    },
    {
      queueId: 14,
      queueName: "UG43Lead",
      excluded: true
    },
    {
      queueId: 15,
      queueName: "UG44Lead",
      excluded: true
    },
    {
      queueId: 16,
      queueName: "UG45Lead",
      excluded: true
    },
    {
      queueId: 17,
      queueName: "UG46Lead",
      excluded: true
    }
  ];
  res.status(200).json(getQueueNamesResponse);
  return res.getQueueNamesResponse;
});

app.get(
  "/api/user-management/user/manager/details/:filter",
  (req, res, next) => {
    const modifyUserTargetResponse = [
      {
        id: 5,
        firstName: "Manju",
        lastName: "Varghese",
        dateOfBirth: "1987-11-21",
        userName: "manju.varghese@ust-global.com",
        communicationEmail: "manju.varghese@gmail.com",
        role: "Claims Examiner",
        status: "Inactive",
        activeDate: "2020-01-01",
        deactivateDate: "2020-02-01",
        ldapOrLocal: "lDAP User",
        userGroupId: 2,
        userGroupName: "Group B",
        leadName: "Deepa",
        managerName: "Roy",
        target: 20,
        isAccountLocked: true,
        userGroups: [
          {
            groupId: 9,
            groupName: "Missing_Member_Team"
          },
          {
            groupId: 14,
            groupName: "UserGroup_Test"
          }
        ]
      }
    ];
    res.status(200).json(modifyUserTargetResponse);
    return res;
  }
);

var searchUser = [
  {
    id: 5,
    firstName: "Manju",
    lastName: "Varghese",
    dateOfBirth: "1987-11-21",
    userName: "manju.varghese@ust-global.com",
    communicationEmail: "manju.varghese@gmail.com",
    role: "Claims Examiner",
    status: "Inactive",
    activeDate: "2020-01-01",
    deactivateDate: "2020-02-01",
    ldapOrLocal: "Local User",
    userGroups: [
      {
        groupId: 9,
        groupName: "Missing_Member_Team"
      },
      {
        groupId: 14,
        groupName: "UserGroup_Test"
      }
    ],
    userGroupName: "Group B",
    leadName: "Deepa",
    managerUserId: 1,
    managerName: "Roy",
    target: 20,
    isAccountLocked: false
  },
  {
    id: 4,
    firstName: "Tino",
    lastName: "Jose",
    dateOfBirth: "1987-11-21",
    userName: "tino.jose@ust-global.com",
    communicationEmail: "tino.jose@gmail.com",
    role: "Claims Examiner",
    status: "Active",
    activeDate: "2020-01-01",
    deactivateDate: "2020-02-01",
    ldapOrLocal: "LDAP",
    userGroups: [
      {
        groupId: 9,
        groupName: "Missing_Member_Team"
      },
      {
        groupId: 14,
        groupName: "UserGroup_Test"
      }
    ],
    userGroupName: "Group B",
    leadName: "Deepa",
    managerUserId: 1,
    managerName: "Roy",
    target: 20,
    isAccountLocked: true
  }
];

app.get(
  "/api/user-management/user/admin/details/user-name=:userName",
  (req, res, next) => {
    const usersList = searchUser.filter(
      val =>
        String(val.userName)
          .toLowerCase()
          .indexOf(String(req.params.userName).toLowerCase()) > -1
    );
    res.status(200).json(usersList);
  }
);

app.get(
  "/api/user-management/user/admin/details/first-name=:firstName",
  (req, res, next) => {
    const usersList = searchUser.filter(
      val =>
        String(val.firstName)
          .toLowerCase()
          .indexOf(String(req.params.firstName).toLowerCase()) > -1
    );
    res.status(200).json(usersList);
  }
);

app.post("/api/user-management/user/modify", (req, res, next) => {
  const userModified = req.body;
  const usersList = searchUser.filter(val => val.id !== userModified.id);
  searchUser = [...usersList, userModified];
  res.status(201).json("Success");
});

app.get("/api/user-management/users/manager", (req, res, next) => {
  const managers = {
    users: [
      {
        id: 3,
        firstName: "Deepa",
        lastName: "John"
      },
      {
        id: 4,
        firstName: "Roy",
        lastName: "Mathew"
      },
      {
        id: 5,
        firstName: "Santosh",
        lastName: "Hariharan"
      }
    ]
  };
  res.status(200).json(managers);
});

app.post("/api/admin/reports/users-list-report", (req, res, next) => {
  res.status(201).json();
});

app.post("/api/reports/leads/user-list-report", (req, res, next) => {
  res.status(201).json();
});

app.post("/api/reports/leads/users-list-report-Lead-view", (req, res, next) => {
  const data = [
    {
      slNo: 0,
      firstName: "Pallavi",
      lastName: "Babu",
      userName: "pallavibabu@ust-global.com",
      role: "Claims Examiner",
      status: "Active",
      activeDate: "2020-03-24",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "LDAP User",
      userGroup: "Missing_Member_Team",
      userGroupTypes: "A",
      managerName: "Deepa John",
      leadName: "Tino Jose",
      proficiency: "Beginner"
    },
    {
      slNo: 0,
      firstName: "Devika",
      lastName: "Kumari",
      userName: "devika.kumari@ust-global.com",
      role: "Claims Examiner",
      status: "Active",
      activeDate: "2020-02-28",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "Local User",
      userGroup: "Missing_Member_Team",
      userGroupTypes: "A",
      managerName: "Deepa John",
      leadName: "Tino Jose",
      proficiency: "Beginner"
    },
    {
      slNo: 0,
      firstName: "Sonima",
      lastName: "Nambiar",
      userName: "Sonima.N",
      role: "Claims Examiner",
      status: "Active",
      activeDate: "2020-03-17",
      deactivateDate: "2020-03-31",
      ldapOrLocal: "LDAP User",
      userGroup: "Missing_Member_Team",
      userGroupTypes: "A",
      managerName: "Deepa John",
      leadName: "Tino Jose",
      proficiency: "Beginner"
    },
    {
      slNo: 0,
      firstName: "Ragil",
      lastName: "Richard",
      userName: "Ragil",
      role: "Claims Examiner",
      status: "Active",
      activeDate: "2020-03-20",
      deactivateDate: "2099-12-31",
      ldapOrLocal: "LDAP User",
      userGroup: "Missing_Member_Team",
      userGroupTypes: "A",
      managerName: "Deepa John",
      leadName: "Tino Jose",
      proficiency: "Expert"
    },
    {
      slNo: 0,
      firstName: "Pooja",
      lastName: "Prakash",
      userName: "Pooja.Prakash",
      role: "Claims Examiner",
      status: "Active",
      activeDate: "2020-03-20",
      deactivateDate: "2058-12-18",
      ldapOrLocal: "Local User",
      userGroup: "Missing_Member_Team",
      userGroupTypes: "A",
      managerName: "Deepa John",
      leadName: "Tino Jose",
      proficiency: "Beginner"
    }
  ];
  res.status(200).json(data);
});

app.post("/api/reports/users-list-data", (req, res, next) => {
  const data = [
    {
      firstName: "John",
      lastName: "Christopher",
      userName: "John C",
      role: "Manager",
      activeDate: "2020-01-01",
      deactivateDate: "2020-02-01",
      status: "Active",
      leadName: "Davis",
      managerName: "George",
      ldapOrLocal: "ldap",
      userGroupType: "Expert"
    }
  ];
  res.status(200).json(data);
});

app.post("/api/reports/claim-examiners-quality-report", (req, res, next) => {
  // res.status(404).json({ message: "No audited claim details found for the user in the selected date range", status: 404 });
  res.status(201).json();
});

app.post(
  "/api/reports/leads/claim-examiners-quality-report",
  (req, res, next) => {
    // res.status(404).json({ message: "No audited claim details found for the user in the selected date range", status: 404 });
    res.status(201).json();
  }
);

app.post("/api/reports/audit-grid-view", (req, res, next) => {
  // res.status(404).json({ message: "No audited claim details found for the user in the selected date range", status: 404 });
  const data = [
    {
      slNo: 1,
      claimId: "2019100400000136",
      claimType: null,
      claimStatus: "FINAL",
      processorName: null,
      claimExaminerName: "Devika Kumari",
      processedDate: "2019-12-01T05:05:00.000+0000",
      memberId: "JB123452",
      memberName: "Johnny Blaze",
      supplierId: "45653542",
      supplierName: "Physician Billing Services",
      billedAmount: 29248.75,
      allowedAmount: 29248.75,
      totalPaidAmount: 28748.75,
      passedOrFailed: "PASSED",
      errorDescription: "TEST ACCEPT",
      overPaidOrUnderPaid: 0,
      auditedBy: "Mohammad Fazil",
      auditDate: "2020-02-10",
      errorType: "Financial"
    },
    {
      slNo: 2,
      claimId: "2019082800000200",
      claimType: null,
      claimStatus: "FINAL",
      processorName: null,
      claimExaminerName: "Devika Kumari",
      processedDate: "2019-12-01T05:09:00.000+0000",
      memberId: "JB123452",
      memberName: "Johnny Blaze",
      supplierId: "45653542",
      supplierName: "Physician Billing Services",
      billedAmount: 23220.5,
      allowedAmount: 23220.5,
      totalPaidAmount: 22720.5,
      passedOrFailed: "PASSED",
      errorDescription: "TEST ACCEPT",
      overPaidOrUnderPaid: 0,
      auditedBy: "Mohammad Fazil",
      auditDate: "2020-02-10",
      errorType: "Financial"
    },
    {
      slNo: 3,
      claimId: "2019100700000045",
      claimType: null,
      claimStatus: "FINAL",
      processorName: null,
      claimExaminerName: "Devika Kumari",
      processedDate: "2019-12-01T05:10:00.000+0000",
      memberId: "JB123452",
      memberName: "Johnny Blaze",
      supplierId: "45653542",
      supplierName: "Physician Billing Services",
      billedAmount: 47602.16,
      allowedAmount: 47602.16,
      totalPaidAmount: 47102.16,
      passedOrFailed: "PASSED",
      errorDescription: "TEST ACCEPT",
      overPaidOrUnderPaid: 0,
      auditedBy: "Mohammad Fazil",
      auditDate: "2020-02-10",
      errorType: "Financial"
    },
    {
      slNo: 4,
      claimId: "2019020100001543",
      claimType: null,
      claimStatus: "FINAL",
      processorName: null,
      claimExaminerName: "Devika Kumari",
      processedDate: "2019-12-01T06:02:00.000+0000",
      memberId: "JB123452",
      memberName: "Johnny Blaze",
      supplierId: "45653542",
      supplierName: "Physician Billing Services",
      billedAmount: 17361.84,
      allowedAmount: 17361.84,
      totalPaidAmount: 16861.84,
      passedOrFailed: "PASSED",
      errorDescription: "TEST ACCEPT",
      overPaidOrUnderPaid: 0,
      auditedBy: "Mohammad Fazil",
      auditDate: "2020-02-10",
      errorType: "Financial"
    },
    {
      slNo: 5,
      claimId: "2019101500000250",
      claimType: null,
      claimStatus: "Review",
      processorName: null,
      claimExaminerName: "Devika Kumari",
      processedDate: "2019-12-02T10:09:00.000+0000",
      memberId: "JB123452",
      memberName: "Johnny Blaze",
      supplierId: "45653542",
      supplierName: "Physician Billing Services",
      billedAmount: 69563.22,
      allowedAmount: null,
      totalPaidAmount: null,
      passedOrFailed: "PASSED",
      errorDescription: "TEST ACCEPT",
      overPaidOrUnderPaid: 0,
      auditedBy: "Mohammad Fazil",
      auditDate: "2020-02-10",
      errorType: "Procedural"
    }
  ];
  res.status(200).json(data);
});

app.post(
  "/api/reports/leads/claim-examiners-quality-grid-view",
  (req, res, next) => {
    // res.status(404).json({ message: "No audited claim details found for the user in the selected date range", status: 404 });
    const data = [
      {
        slNo: 1,
        claimId: "2019100400000136",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-01T05:05:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 29248.75,
        allowedAmount: 29248.75,
        totalPaidAmount: 28748.75,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 2,
        claimId: "2019082800000200",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-01T05:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 23220.5,
        allowedAmount: 23220.5,
        totalPaidAmount: 22720.5,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 3,
        claimId: "2019100700000045",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-01T05:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 47602.16,
        allowedAmount: 47602.16,
        totalPaidAmount: 47102.16,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 4,
        claimId: "2019020100001543",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-01T06:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 17361.84,
        allowedAmount: 17361.84,
        totalPaidAmount: 16861.84,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 5,
        claimId: "2019101500000250",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-02T10:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 69563.22,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 6,
        claimId: "2019101100000004",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-03T08:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 31398.2,
        allowedAmount: 31398.2,
        totalPaidAmount: 30898.2,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 7,
        claimId: "2019101600000069",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-03T10:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 37894.19,
        allowedAmount: 37894.19,
        totalPaidAmount: 37394.19,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 8,
        claimId: "2019101800000115",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-03T10:15:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 126050.23,
        allowedAmount: 126050.23,
        totalPaidAmount: 125550.23,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 9,
        claimId: "2019102300000158",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-30T10:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 83108,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 20,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 10,
        claimId: "2019102300000005",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-30T11:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 68176.8,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 25,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 11,
        claimId: "2019102300000043",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2019-12-30T13:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 35432,
        allowedAmount: 35432,
        totalPaidAmount: 34932,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 75,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 12,
        claimId: "2019102300000102",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-01T06:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 32937.25,
        allowedAmount: 32937.25,
        totalPaidAmount: 32437.25,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 80,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 13,
        claimId: "2019102400000126",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-01T08:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 133465.01,
        allowedAmount: 133465.01,
        totalPaidAmount: 132965.01,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 90,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 14,
        claimId: "2019102400000128",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-01T10:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 75732.29,
        allowedAmount: 75732.29,
        totalPaidAmount: 75232.29,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 45,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 15,
        claimId: "2019102400000131",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-01T11:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 40493.23,
        allowedAmount: 40493.23,
        totalPaidAmount: 39993.23,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 55,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 16,
        claimId: "2019102400000232",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-02T10:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 30373.38,
        allowedAmount: 30373.38,
        totalPaidAmount: 29873.38,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 17,
        claimId: "2019102800000129",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-02T10:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 34172.19,
        allowedAmount: 34172.19,
        totalPaidAmount: 33672.19,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 18,
        claimId: "2019102400000108",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-02T10:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 39934.06,
        allowedAmount: 39934.06,
        totalPaidAmount: 39434.06,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 85,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 19,
        claimId: "2019102800002001",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-02T11:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 75540.41,
        allowedAmount: 75540.41,
        totalPaidAmount: 75040.41,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 20,
        claimId: "2019102800000136",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-03T06:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 29901.5,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 21,
        claimId: "2019102800000241",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-03T08:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 25056,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 22,
        claimId: "2019102800000137",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-03T10:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 24157,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 23,
        claimId: "2019102900000246",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-03T11:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 105410.18,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 76,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 24,
        claimId: "2019102900000002",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-03T13:15:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 43790.54,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 85,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 25,
        claimId: "2019103000000131",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-30T10:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 56520.32,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-01-10"
      },
      {
        slNo: 26,
        claimId: "2019103000000176",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-30T11:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 53827.92,
        allowedAmount: 53827.92,
        totalPaidAmount: 53327.92,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 86,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 27,
        claimId: "2019103000000095",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-01-30T13:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 41469.13,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-01-28"
      },
      {
        slNo: 28,
        claimId: "2019103000000100",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-01T08:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 34929.12,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 58,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-10"
      },
      {
        slNo: 29,
        claimId: "2019100300000107",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-01T10:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 31434.82,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 63,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-11"
      },
      {
        slNo: 30,
        claimId: "2019103000000134",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-01T11:10:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 28717.93,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 70,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-11"
      },
      {
        slNo: 31,
        claimId: "2019103100000024",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-02T10:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 66633.23,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 88,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-11"
      },
      {
        slNo: 32,
        claimId: "2019103100000029",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-03T10:02:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 47754.65,
        allowedAmount: 47754.65,
        totalPaidAmount: 47254.65,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-01-23"
      },
      {
        slNo: 33,
        claimId: "2019103100000143",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-03T11:09:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 40791.47,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-02-11"
      },
      {
        slNo: 34,
        claimId: "2019103100000051",
        claimType: null,
        claimStatus: "Review",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-03T13:15:00.000+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 35393.02,
        allowedAmount: null,
        totalPaidAmount: null,
        passedOrFailed: "FAILED",
        errorDescription: "TEST DENY",
        overPaidOrUnderPaid: 47,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-01-13"
      },
      {
        slNo: 35,
        claimId: "2019110500000404",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-28T05:26:48.997+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 27211.07,
        allowedAmount: 27211.07,
        totalPaidAmount: 26711.07,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-01-10"
      },
      {
        slNo: 36,
        claimId: "2019110500000418",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-28T05:26:51.214+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 23777.24,
        allowedAmount: 23777.24,
        totalPaidAmount: 23277.24,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-01-10"
      },
      {
        slNo: 37,
        claimId: "2019110600000215",
        claimType: null,
        claimStatus: "FINAL",
        processorName: null,
        claimExaminerName: "Devika Kumari",
        processedDate: "2020-02-28T05:26:53.148+0000",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        supplierId: "45653542",
        supplierName: "Physician Billing Services",
        billedAmount: 91331.48,
        allowedAmount: 91331.48,
        totalPaidAmount: 90831.48,
        passedOrFailed: "PASSED",
        errorDescription: "TEST ACCEPT",
        overPaidOrUnderPaid: 0,
        auditedBy: "Mohammad Fazil",
        auditDate: "2020-01-10"
      }
    ];
    res.status(200).json(data);
  }
);

// API Claim Routing

app.get("/api/claim/lead/list/routed-in", (req, res, next) => {
  const userGroups = [
    {
      claimId: "2019101500000250",
      taskId: 7,
      receivedDate: "10/15/2019",
      age: 142,
      queueName: "Itemized Bill WB",
      routeFrom: "Devika Kumari",
      routeDate: "12/02/2019",
      routeReason: "Incorrect Assignment",
      comments: "Test24",
      endTimer: "10:10:10"
    }
  ];
  for (i = 2; i <= 10; i++)
    userGroups.push({
      claimId: "2019101500000250",
      taskId: i,
      receivedDate: "10/15/2019",
      age: 142,
      queueName: "Itemized Bill WB",
      routeFrom: "Devika Kumari",
      routeDate: "12/02/2019",
      routeReason: "Incorrect Assignment",
      comments: "Test24",
      endTimer: "10:10:10"
    });
  res.status(200).json(userGroups);
});

app.get("/api/claim/list/routedin", (req, res, next) => {
  const userGroups = [
    {
      claimId: "2019101500000250",
      taskId: 7,
      receivedDate: "10/15/2019",
      age: 142,
      queueName: "Itemized Bill WB",
      routeFrom: "Devika Kumari",
      routeDate: "12/02/2019",
      routeReason: "Incorrect Assignment",
      comments: "Test24",
      endTimer: "10:10:10"
    }
  ];
  for (i = 2; i <= 10; i++)
    userGroups.push({
      claimId: "2019101500000250",
      taskId: i,
      receivedDate: "10/15/2019",
      age: 142,
      queueName: "Itemized Bill WB",
      routeFrom: "Devika Kumari",
      routeDate: "12/02/2019",
      routeReason: "Incorrect Assignment",
      comments: "Test24",
      endTimer: "10:10:10"
    });
  res.status(200).json(userGroups);
});

// ADMIN SNAP SHOT

app.get("/api/admin/landing/active-user-snapshot", (req, res, next) => {
  const payload = {
    usersCount: 100,
    leadCount: 23,
    managerCount: 20,
    queueCount: 22,
    userGroups: 11,
    auditorCount: 6,
    examinerCount: 50,
    enrollmentLeadCount: 0,
    enrollmentAuditorCount: 0,
    enrollmentSpecialistCount: 0
  };

  res.status(200).json(payload);
});

app.post("/api/maintenance-notification/save", (req, res, next) => {
  res.status(200).json("success");
});

app.post("/api/maintenance-notification/send", (req, res, next) => {
  res.status(200).json("send success!");
});

app.post("/api/data-load/claims", (req, res, next) => {
  setTimeout(() => {
    res.status(200).json({
      status: "SUCCESS",
      message: "Claims refreshed successfully"
    });
  }, 10000);
});

app.post("/api/data-load/claim-queues", (req, res, next) => {
  res.status(200).json("Queue success!");
});

app.get("/api/admin/landing/upcoming-scheduled-details", (req, res, next) => {
  /* const payload = {
    maintenanceMessage: "System will be having a downtime on next Tuesday",
    maintenanceFrom: "12 / 03 / 2020",
    maintenanceTo: "13 / 03 / 2020"
  }; */
  const payload = [
    {
      emailSubject: "Server Maintenance",
      maintenanceMessage:
        "Hi Team,\nMaintenance has been scheduled on 25th March. Plan accordingly.",
      maintenanceFrom: "08/25/2020 09:30",
      maintenanceTo: "08/25/2020 10:30",
      emailTriggerDate: "08/24/2020 10:00",
      recipients: "MANAGER"
    },
    {
      emailSubject: "Planned System Maintenance",
      maintenanceMessage:
        "A system maintenance is planned at 03/28/2019 06:00 AM EST to 03/28/2019 07:00 AM EST, Please plan your work accordingly.",
      maintenanceFrom: "08/28/2020 18:00",
      maintenanceTo: "08/28/2020 19:00",
      emailTriggerDate: "08/28/2020 19:35",
      recipients: "LEAD,CLAIMS EXAMINER"
    }
  ];

  res.status(200).json(payload);
});

app.get(
  "/api/user-management/user/lead/details/user-name=:name",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];

    res.status(200).json(payload);
  }
);

app.get(
  "/api/user-management/user/lead/details/first-name=:name",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];
    res.status(200).json(payload);
  }
);

app.post("/api/audit-dashboard/productivity", (req, res, next) => {
  const payload = {
    userProductivityDto: [
      {
        hour: 9,
        claimCount: 0
      },
      {
        hour: 10,
        claimCount: 2
      },
      {
        hour: 11,
        claimCount: 1
      },
      {
        hour: 12,
        claimCount: 0
      },
      {
        hour: 13,
        claimCount: 1
      },
      {
        hour: 14,
        claimCount: 0
      },
      {
        hour: 15,
        claimCount: 0
      },
      {
        hour: 16,
        claimCount: 0
      },
      {
        hour: 17,
        claimCount: 0
      },
      {
        hour: 18,
        claimCount: 0
      },
      {
        hour: 19,
        claimCount: 0
      },
      {
        hour: 20,
        claimCount: 0
      }
    ]
  };
  res.status(200).json(payload);
});

app.get("/api/tableData", (req, res, next) => {
  tableData = [
    { vin: "a1653d4d", brand: "VW", year: 1998, color: "White", price: 10000 },
    {
      vin: "ddeb9b10",
      brand: "Mercedes",
      year: 1985,
      color: "Green",
      price: 25000
    },
    {
      vin: "d8ebe413",
      brand: "Jaguar",
      year: 1979,
      color: "Silver",
      price: 30000
    },
    {
      vin: "aab227b7",
      brand: "Audi",
      year: 1970,
      color: "Black",
      price: 12000
    },
    { vin: "631f7412", brand: "Volvo", year: 1992, color: "Red", price: 15500 },
    { vin: "7d2d22b0", brand: "VW", year: 1993, color: "Maroon", price: 40000 },
    { vin: "50e900ca", brand: "Fiat", year: 1964, color: "Blue", price: 25000 },
    {
      vin: "4bbcd603",
      brand: "Renault",
      year: 1983,
      color: "Maroon",
      price: 22000
    },
    {
      vin: "70214c7e",
      brand: "Renault",
      year: 1961,
      color: "Black",
      price: 19000
    },
    {
      vin: "ec229a92",
      brand: "Audi",
      year: 1984,
      color: "Brown",
      price: 36000
    },
    {
      vin: "1083ee40",
      brand: "VW",
      year: 1984,
      color: "Silver",
      price: 215000
    },
    {
      vin: "6e0da3ab",
      brand: "Volvo",
      year: 1987,
      color: "Silver",
      price: 32000
    },
    {
      vin: "5aee636b",
      brand: "Jaguar",
      year: 1995,
      color: "Maroon",
      price: 20000
    },
    {
      vin: "7cc43997",
      brand: "Jaguar",
      year: 1984,
      color: "Orange",
      price: 14000
    },
    {
      vin: "88ec9f66",
      brand: "Honda",
      year: 1989,
      color: "Maroon",
      price: 36000
    },
    { vin: "f5a4a5f5", brand: "BMW", year: 1986, color: "Blue", price: 28000 },
    {
      vin: "15b9a5c9",
      brand: "Mercedes",
      year: 1986,
      color: "Orange",
      price: 14000
    },
    {
      vin: "f7e18d01",
      brand: "Mercedes",
      year: 1991,
      color: "White",
      price: 25000
    },
    { vin: "cec593d7", brand: "VW", year: 1992, color: "Blue", price: 36000 },
    {
      vin: "d5bac4f0",
      brand: "Renault",
      year: 2001,
      color: "Blue",
      price: 25000
    },
    {
      vin: "56b527c8",
      brand: "Jaguar",
      year: 1990,
      color: "Yellow",
      price: 52000
    },
    {
      vin: "1ac011ff",
      brand: "Audi",
      year: 1966,
      color: "Maroon",
      price: 45000
    },
    { vin: "fc074185", brand: "BMW", year: 1962, color: "Blue", price: 54000 },
    {
      vin: "606ba663",
      brand: "Honda",
      year: 1982,
      color: "Blue",
      price: 22000
    },
    {
      vin: "d05060b8",
      brand: "Mercedes",
      year: 2003,
      color: "Silver",
      price: 15000
    },
    {
      vin: "46e4bbe8",
      brand: "Mercedes",
      year: 1986,
      color: "White",
      price: 18000
    },
    { vin: "c29da0d7", brand: "BMW", year: 1983, color: "Brown", price: 32000 },
    { vin: "24622f70", brand: "VW", year: 1973, color: "Maroon", price: 36000 },
    {
      vin: "7f573d2c",
      brand: "Mercedes",
      year: 1991,
      color: "Red",
      price: 21000
    },
    {
      vin: "b69e6f5c",
      brand: "Jaguar",
      year: 1993,
      color: "Yellow",
      price: 16000
    },
    {
      vin: "ead9bf1d",
      brand: "Fiat",
      year: 1968,
      color: "Maroon",
      price: 43000
    },
    {
      vin: "bc58113e",
      brand: "Renault",
      year: 1981,
      color: "Silver",
      price: 36000
    },
    {
      vin: "2989d5b1",
      brand: "Honda",
      year: 2006,
      color: "Blue",
      price: 240000
    },
    {
      vin: "c243e3a0",
      brand: "Fiat",
      year: 1990,
      color: "Maroon",
      price: 15000
    },
    {
      vin: "e3d3ebf3",
      brand: "Audi",
      year: 1996,
      color: "White",
      price: 28000
    },
    {
      vin: "45337e7a",
      brand: "Mercedes",
      year: 1982,
      color: "Blue",
      price: 14000
    },
    {
      vin: "36e9cf7e",
      brand: "Fiat",
      year: 2000,
      color: "Orange",
      price: 26000
    },
    {
      vin: "036bf135",
      brand: "Mercedes",
      year: 1973,
      color: "Black",
      price: 22000
    },
    {
      vin: "ad612e9f",
      brand: "Mercedes",
      year: 1975,
      color: "Red",
      price: 45000
    },
    {
      vin: "97c6e1e9",
      brand: "Volvo",
      year: 1967,
      color: "Green",
      price: 42000
    },
    { vin: "ae962274", brand: "Volvo", year: 1982, color: "Red", price: 36000 },
    { vin: "81f8972a", brand: "BMW", year: 2007, color: "Black", price: 56000 },
    { vin: "f8506743", brand: "Audi", year: 1975, color: "Blue", price: 42000 },
    {
      vin: "596859d1",
      brand: "Fiat",
      year: 2002,
      color: "Green",
      price: 48000
    },
    {
      vin: "d83c1d9a",
      brand: "Volvo",
      year: 1972,
      color: "Black",
      price: 29000
    },
    {
      vin: "32f41550",
      brand: "Mercedes",
      year: 1978,
      color: "Brown",
      price: 17000
    },
    {
      vin: "c28cd2e4",
      brand: "Volvo",
      year: 1982,
      color: "Silver",
      price: 24000
    },
    {
      vin: "80890dcc",
      brand: "Audi",
      year: 1962,
      color: "White",
      price: 36000
    },
    { vin: "4bf1aeb5", brand: "VW", year: 2000, color: "Silver", price: 24000 },
    {
      vin: "45ca4786",
      brand: "BMW",
      year: 1995,
      color: "Maroon",
      price: 50000
    }
  ];
  res.status(200).json(tableData);
});

// Claim Reprio
app.get("/api/claims/unassigned", (req, res, next) => {
  const data = {
    claimDetails: [
      {
        id: 10,
        claimId: "2019101400000121",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 11,
        claimId: "2019101400001656",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 12,
        claimId: "2019101400001655",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 13,
        claimId: "2019101500001736",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 16,
        claimId: "2019101500001730",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 31,
        claimId: "2019102300000004",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 32,
        claimId: "2019093000001059",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 50,
        claimId: "2019102900000006",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 49,
        claimId: "2019102900001840",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 285,
        claimId: "2018123100000188",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 442,
        claimId: "2019111200000238",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 512,
        claimId: "2019111200000271",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 521,
        claimId: "2019111200000377",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      }
    ]
  };
  res.status(200).json(data);
});

app.post("/api/claims/search/details", (req, res, next) => {
  const data = {
    claimDetails: [
      {
        id: 2,
        claimId: "2019022200000150",
        claimQueueName: "Hdsadssa",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 9,
        claimId: "2019101400000267",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "PENDED",
        claimPriorityStatus: true
      },
      {
        id: 10,
        claimId: "2019101400000121",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 11,
        claimId: "2019101400001656",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 12,
        claimId: "2019101400001655",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 13,
        claimId: "2019101500001736",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 16,
        claimId: "2019101500001730",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 31,
        claimId: "2019102300000004",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 32,
        claimId: "2019093000001059",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 50,
        claimId: "2019102900000006",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 49,
        claimId: "2019102900001840",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 203,
        claimId: "2019110800000220",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 317,
        claimId: "2019111100000074",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 275,
        claimId: "2019111100000007",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 283,
        claimId: "2019010100000216",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 284,
        claimId: "2019060500000168",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 273,
        claimId: "2019111100000297",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 272,
        claimId: "2019111100000155",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 285,
        claimId: "2018123100000188",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 442,
        claimId: "2019111200000238",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 512,
        claimId: "2019111200000271",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 521,
        claimId: "2019111200000377",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      }
    ]
  };
  res.status(200).json(data);
});

app.post("/api/claims/save/details/priority", (req, res, next) => {
  res.status(200).json({ success: "true" });
});

app.post(
  "/api/reports/leads/claims-status-routedin-report",
  (req, res, next) => {
    res.status(200).json({ success: "true" });
  }
);

app.post("/api/reports/leads/claims-status-pended-report", (req, res, next) => {
  res.status(200).json({ success: "true" });
});

app.post("/api/configuration/support/create", (req, res, next) => {
  setTimeout(() => {
    res.status(200).json({ success: "true" });
  }, 3000);
});

app.get("/api/configuration/support/details", (req, res, next) => {
  const payload = {
    helpDeskNumber: 9746366124,
    supportEmailDL: "test@g.com",
    adminOrManagerEmailDL: "test@g.com"
  };
  res.status(200).json(payload);
});
app.post(
  "/api/reports/leads/claims-status-routedin-grid-view",
  (req, res, next) => {
    const data = [
      {
        slNo: 1,
        id: 0,
        processorName: "Megha Murali",
        routedInDate: null,
        claimId: "2019060500000168",
        claimStatus: "ROUTED",
        claimType: null,
        receiptDate: "2019-11-11",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 49166.09,
        allowedAmount: null,
        totalPaidAmount: null,
        claimProcessedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-17",
        claimByAge: 141,
        pendedDate: null
      },
      {
        slNo: 2,
        id: 0,
        processorName: "Megha Murali",
        routedInDate: null,
        claimId: "2019111200001480",
        claimStatus: "ROUTED",
        claimType: null,
        receiptDate: "2020-01-07",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 16300.75,
        allowedAmount: null,
        totalPaidAmount: null,
        claimProcessedDate: "2020-03-03T18:30:00.000+0000",
        reportProcessedDate: "2020-03-31",
        claimByAge: 84,
        pendedDate: null
      },
      {
        slNo: 3,
        id: 0,
        processorName: "Megha Murali",
        routedInDate: null,
        claimId: "2019111200001495",
        claimStatus: "ROUTED",
        claimType: null,
        receiptDate: "2020-01-07",
        claimAge: 0.0,
        memberId: "MD123453",
        memberName: "Matt Damon",
        providerId: "45653543",
        providerName: "United Health Group",
        billedAmount: 16300.75,
        allowedAmount: null,
        totalPaidAmount: null,
        claimProcessedDate: "2020-03-03T18:30:00.000+0000",
        reportProcessedDate: "2020-03-31",
        claimByAge: 84,
        pendedDate: null
      }
    ];
    res.status(200).json(data);
  }
);

app.post(
  "/api/reports/leads/claims-status-pended-grid-view",
  (req, res, next) => {
    const data = [
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2018123100000188",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-11",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 26312.5,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-05",
        claimByAge: 140
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019100300000107",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-30",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 31434.82,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-02-01",
        claimByAge: 152
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019102800000136",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-28",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 29901.5,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-01-03",
        claimByAge: 154
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019102800000137",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-28",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 24157,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-01-03",
        claimByAge: 154
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019102900000246",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-29",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 105410.18,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-01-03",
        claimByAge: 153
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019103000000095",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-30",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 41469.13,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-01-30",
        claimByAge: 152
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019103000000113",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-30",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 23120.42,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-02-02",
        claimByAge: 152
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019103100000051",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-31",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 35393.02,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-02-03",
        claimByAge: 151
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019103100000143",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-31",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 40791.47,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-02-03",
        claimByAge: 151
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019103100000171",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-10-31",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 58642.42,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-02-03",
        claimByAge: 151
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019110400000106",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-04",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 24192.49,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-02-28",
        claimByAge: 147
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019110500000424",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-05",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 80359.55,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-02-28",
        claimByAge: 146
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019111100000460",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-11",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 390,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-10",
        claimByAge: 140
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019111100001870",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-11",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 285,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-12",
        claimByAge: 140
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019111100001898",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-11",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 56.75,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-19",
        claimByAge: 140
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019111200000017",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-12",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 661,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-20",
        claimByAge: 139
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019111200000238",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-12",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 73757.08,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-04",
        claimByAge: 139
      },
      {
        slNo: 0,
        id: 0,
        processorName: "Devika Kumari",
        processedDate: null,
        claimId: "2019111200000377",
        claimStatus: "PENDED",
        claimType: null,
        receiptDate: "2019-11-12",
        claimAge: 0.0,
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerId: "45653542",
        providerName: "Physician Billing Services",
        billedAmount: 26461.63,
        allowedAmount: null,
        totalPaidAmount: null,
        pendedDate: "2020-02-28T15:19:11.706+0000",
        reportProcessedDate: "2020-03-04",
        claimByAge: 139
      }
    ];
    res.status(200).json(data);
  }
);
app.get("/api/managerlanding/claimQueue/detail", (req, res, next) => {
  const managerStatusScoreDto = [
    {
      managerStatusDto: {
        Assigned: 3,
        queueName: "Missing Member WB",
        Pended: 5,
        "To-Do": 18
      }
    },
    {
      managerStatusDto: {
        Assigned: 3,
        queueName: "High Dollar WB",
        Pended: 5,
        "To-Do": 15
      }
    },
    {
      managerStatusDto: {
        queueName: "Itemized Bill WB",
        Pended: 14,
        "To-Do": 54
      }
    }
  ];
  res.status(200).json(managerStatusScoreDto);
});

app.post(
  "/api/audit-dashboard/claims-audited-by-type-status",
  (req, res, next) => {
    const auditStatusScoreDto = {
      auditStatusScoreDto: [
        {
          denied: 1,
          checkIssued: 2,
          checkNotIssued: 3,
          claimType: "Institutional IP"
        },
        {
          denied: 2,
          checkIssued: 1,
          checkNotIssued: 0,
          claimType: "Institutional OP"
        },
        { denied: 2, checkIssued: 2, checkNotIssued: 0, claimType: "Others" },
        {
          denied: 2,
          checkIssued: 0,
          checkNotIssued: 2,
          claimType: "Professional"
        }
      ]
    };
    res.status(200).json(auditStatusScoreDto);
  }
);

app.post("/api/reports/audit-claims-bar-chart", (req, res, next) => {
  const auditReportBarChartMaps = {
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
  res.status(200).json(auditReportBarChartMaps);
});

app.get("/api/lead/landing-page/count", (req, res) => {
  const payload = {
    examinerCount: 20,
    routedCount: 30,
    routedInCount: 25,
    routedOutCount: 35,
    pendedCount: 20,
    completedCount: 10
  };
  res.status(200).json(payload);
});

app.get("/api/lead/review/get-claim-count-review", (req, res) => {
  res.status(200).json(10);
});

app.get("/api/lead/landing-page/pie-chart", (req, res) => {
  const payload = {
    pendedCount: 10,
    assignedCount: 10,
    toDoCount: 20
  };
  res.status(200).json(payload);
});

app.get("/api/managerlanding/userdetail/count", (req, res) => {
  const payload = {
    claimExaminerCount: 21,
    auditorCount: 0,
    userGroupCount: 5,
    leadUserCount: 3
  };
  res.status(200).json(payload);
});

app.post("/api/admin/reports/users-list-grid", (req, res) => {
  const data = {
    examinerCount: 1,
    leadCount: 1,
    userListDtoList: [
      {
        slNo: 1,
        firstName: "Brian",
        lastName: "Blaze",
        userName: "Brian.Blaze@ust-global.com",
        role: "Claims Lead",
        status: "Active",
        activeDate: "2020-02-17",
        deactivateDate: "2099-12-31",
        ldapOrLocal: "Local User",
        userGroup: null,
        managerName: "Deepa John",
        leadName: null,
        id: 1
      },
      {
        slNo: 2,
        firstName: "Dhanya",
        lastName: "Saraswathi",
        userName: "Dhanya.Saraswathi@ust-global.com",
        role: "Claims Lead",
        status: "Active",
        activeDate: "2020-02-17",
        deactivateDate: "2099-12-31",
        ldapOrLocal: "Local User",
        userGroup: null,
        managerName: "Deepa John",
        leadName: null,
        id: 2
      },
      {
        slNo: 3,
        firstName: "Manju",
        lastName: "Vargheese",
        userName: "Manju.Vargheese@ust-global.com",
        role: "Claims Lead",
        status: "Active",
        activeDate: "2020-02-17",
        deactivateDate: "2099-12-31",
        ldapOrLocal: "Local User",
        userGroup: null,
        id: 3,
        managerName: "Deepa John",
        leadName: null
      }
    ]
  };
  res.status(200).json(data);
});

app.get("/api/user-management/users/manager", (req, res) => {
  const list = {
    users: [
      {
        id: 1,
        firstName: "Deepa",
        lastName: "John"
      },
      {
        id: 2,
        firstName: "Roy",
        lastName: "Mathew"
      }
    ]
  };
  res.status(200).json(list);
});

app.get("/api/user-management/users/lead", (req, res) => {
  const list = {
    users: [
      {
        id: 7,
        firstName: "Brian",
        lastName: "Blaze"
      },
      {
        id: 6,
        firstName: "Devika",
        lastName: "M"
      }
    ]
  };
  res.status(200).json(list);
});

app.get("/api/reports/leads/getClaimAgeRange", (req, res) => {
  res
    .status(200)
    .json([
      "1-7",
      "8-14",
      "15-21",
      "22-28",
      "29-35",
      "36-42",
      "43-49",
      "50-56",
      "57-63",
      ">64"
    ]);
});

app.get("/api/login/password-reset-flag", (req, res, next) => {
  res.status(200).json({
    passwordReset: false
  });
});

// User Group

app.post("/api/userGroup/createUserGroup", (req, res, next) => {
  res.status(200).json();
});

app.post("/api/userGroup/updateUserGroup", (req, res, next) => {
  res.status(200).json();
});

app.get("/api/userGroup/deleteUserGroup", (req, res, next) => {
  res.status(200).json();
});

app.get("/api/userGroup/getUserGroupsForManager", (req, res, next) => {
  const payload = [
    {
      groupId: 9,
      groupName: "Missing_Member_Team",
      leadId: 6,
      leadName: "Tino Jose",
      managerId: 3,
      managerName: "Deepa John",
      target: 500,
      description: "Missing_Member",
      userGroupType: {
        id: 2,
        name: "Enrollment"
      },
      queueName: {
        queueId: 8,
        queueName: "Missing Member WB"
      }
    },
    {
      groupId: 14,
      groupName: "UserGroup_Test",
      leadId: 11,
      leadName: "Princy Antony",
      managerId: 3,
      managerName: "Deepa John",
      target: 10,
      description: "UserGroup_Test",
      userGroupType: {
        id: 1,
        name: "Claims"
      },
      queueName: {
        queueId: 3,
        queueName: "Quality Audit and Recovery WB"
      }
    },
    {
      groupId: 2,
      groupName: "High_Dollar_Team",
      leadId: 5,
      leadName: "Manju Varghese",
      managerId: 3,
      managerName: "Deepa John",
      target: 500,
      description: "High Dollar Work Group",
      userGroupType: {
        id: 1,
        name: "Claims"
      },
      queueName: {
        queueId: 2,
        queueName: "High Dollar WB"
      }
    },
    {
      groupId: 11,
      groupName: "Manual_Pends_Team",
      leadId: 12,
      leadName: "Dhanya Saraswathi",
      managerId: 3,
      managerName: "Deepa John",
      target: 10,
      description: "Manual_Pends_Team",
      userGroupType: {
        id: 1,
        name: "Claims"
      },
      queueName: {
        queueId: 6,
        queueName: "Authorization WB"
      }
    }
  ];
  res.status(200).json(payload);
});

app.get("/api/userGroup/lead-names", (req, res, next) => {
  const payload = [
    { label: "Claims Lead 1", value: 1 },
    { label: "Claims Lead 2", value: 2 },
    { label: "Claims Lead 3", value: 3 }
  ];
  res.status(200).json(payload);
});

app.get("/api/target-settings/getAllTargetSettings", (req, res, next) => {
  const payload = {
    financialTargetDtos: [
      {
        id: 1,
        startPeriod: "2020-02-02",
        endPeriod: "2020-04-27",
        financialScores: 92
      },
      {
        id: 2,
        startPeriod: "2020-05-25",
        endPeriod: "2020-06-26",
        financialScores: 95
      },
      {
        id: 3,
        startPeriod: "2020-06-22",
        endPeriod: "2020-07-21",
        financialScores: 92
      },
      {
        id: 4,
        startPeriod: "2020-07-24",
        endPeriod: "2020-08-25",
        financialScores: 96
      },
      {
        id: 5,
        startPeriod: "2020-09-02",
        endPeriod: "2020-10-27",
        financialScores: 97
      },
      {
        id: 6,
        startPeriod: "2020-10-30",
        endPeriod: "2020-11-05",
        financialScores: 93
      },
      {
        id: 7,
        startPeriod: "2020-11-02",
        endPeriod: "2020-12-27",
        financialScores: 97
      },
      {
        id: 8,
        startPeriod: "2020-12-30",
        endPeriod: "2021-01-05",
        financialScores: 91
      }
    ],
    proceduralTargetDtos: [
      {
        id: 3,
        startPeriod: "2020-02-20",
        endPeriod: "2020-04-27",
        proceduralScores: 92
      },
      {
        id: 4,
        startPeriod: "2020-06-20",
        endPeriod: "2020-07-27",
        proceduralScores: 94
      }
    ]
  };

  res.status(200).json(payload);
});

app.get("/api/userGroup/work-item-types", (req, res, next) => {
  const payload = [
    { label: "Claims", value: 1 },
    { label: "Enrollment", value: 2 }
  ];
  res.status(200).json(payload);
});

//new user creation
let users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Steve",
    userName: "johnst@prompt.com",
    dateOfBirth: "12/12/1989",
    userRoleId: 1,
    communicationEmail: "johnst@prompt.com",
    status: "Active",
    activeDate: "12/12/2015",
    deactiveDate: "12/12/2022",
    ldapUser: true,
    userGroupId: 19,
    managerUserId: 3,
    target: null
  },
  {
    id: 2,
    firstName: "George",
    lastName: "Steve",
    userName: "georgesteve@prompt.com",
    dateOfBirth: "12/12/1989",
    userRoleId: 3,
    communicationEmail: "georgesteve@prompt.com",
    status: "Active",
    activeDate: "12/12/2015",
    deactiveDate: "12/12/2022",
    ldapUser: true,
    userGroupId: 19,
    managerUserId: 4,
    target: 10
  }
];
app.post("/api/user-management/user/create", (req, res, next) => {
  const newUser = {
    id: users.length + 1,
    ...req.body.users[0]
  };
  users = [...users, newUser];
  res.status(201).json("success");
});

app.get("/api/user-management/user/all", (req, res, next) => {
  res.status(200).json({
    users: users
  });
});

app.get("/api/userGroup/fetchTargetSettings", (req, res, next) => {
  res.status(200).json({
    userId: 1,
    financialScores: 10,
    proceduralScores: 30
  });
  return res;
});

app.get(
  "/api/user-management/user/manager/details/first-name=mwe",
  (req, res, next) => {
    const modifyUserTargetResponse = [
      {
        id: 5,
        firstName: "Manju",
        lastName: "Varghese",
        dateOfBirth: "1987-11-21",
        userName: "manju.varghese@ust-global.com",
        communicationEmail: "manju.varghese@gmail.com",
        role: "Claims Examiner",
        status: "Inactive",
        activeDate: "2020-01-01",
        deactivateDate: "2020-02-01",
        ldapOrLocal: "lDAP User",
        userGroupId: 2,
        userGroupName: "Group B",
        leadName: "Deepa",
        managerName: "Roy",
        target: 20
      }
    ];
    res.status(200).json(modifyUserTargetResponse);
    return res;
  }
);

var searchUser = [
  {
    id: 5,
    firstName: "Manju",
    lastName: "Varghese",
    dateOfBirth: "1987-11-21",
    userName: "manju.varghese@ust-global.com",
    communicationEmail: "manju.varghese@gmail.com",
    role: "Claims Examiner",
    status: "Inactive",
    activeDate: "2020-01-01",
    deactivateDate: "2020-02-01",
    ldapOrLocal: "Local User",
    userGroups: [
      {
        groupId: 9,
        groupName: "Missing_Member_Team"
      },
      {
        groupId: 14,
        groupName: "UserGroup_Test"
      }
    ],
    userGroupName: "Group B",
    leadName: "Deepa",
    managerUserId: 1,
    managerName: "Roy",
    target: 20,
    isAccountLocked: false
  },
  {
    id: 4,
    firstName: "Tino",
    lastName: "Jose",
    dateOfBirth: "1987-11-21",
    userName: "tino.jose@ust-global.com",
    communicationEmail: "tino.jose@gmail.com",
    role: "Claims Examiner",
    status: "Active",
    activeDate: "2020-01-01",
    deactivateDate: "2020-08-30",
    ldapOrLocal: "LDAP",
    userGroups: [
      {
        groupId: 9,
        groupName: "Missing_Member_Team"
      },
      {
        groupId: 14,
        groupName: "UserGroup_Test"
      }
    ],
    userGroupName: "Group B",
    leadName: "Deepa",
    managerUserId: 1,
    managerName: "Roy",
    target: 20,
    isAccountLocked: true
  }
];

app.get(
  "/api/user-management/user/admin/details/user-name=:userName",
  (req, res, next) => {
    const usersList = searchUser.filter(
      val =>
        String(val.userName)
          .toLowerCase()
          .indexOf(String(req.params.userName).toLowerCase()) > -1
    );
    res.status(200).json(usersList);
  }
);

app.get(
  "/api/user-management/user/admin/details/first-name=:firstName",
  (req, res, next) => {
    const usersList = searchUser.filter(
      val =>
        String(val.firstName)
          .toLowerCase()
          .indexOf(String(req.params.firstName).toLowerCase()) > -1
    );
    res.status(200).json(usersList);
  }
);

app.post("/api/user-management/user/modify", (req, res, next) => {
  const userModified = req.body;
  const usersList = searchUser.filter(val => val.id !== userModified.id);
  searchUser = [...usersList, userModified];
  res.status(201).json("Success");
});

app.get("/api/user-management/users/manager", (req, res, next) => {
  const managers = {
    users: [
      {
        id: 3,
        firstName: "Deepa",
        lastName: "John"
      },
      {
        id: 4,
        firstName: "Roy",
        lastName: "Mathew"
      },
      {
        id: 5,
        firstName: "Santosh",
        lastName: "Hariharan"
      }
    ]
  };
  res.status(200).json(managers);
});

app.post("/api/admin/reports/users-list-report", (req, res, next) => {
  res.status(201).json();
});

app.post("/api/reports/leads-user-list-report", (req, res, next) => {
  res.status(201).json();
});

app.post("/api/reports/manger-user-list-report", (req, res, next) => {
  res.status(201).json();
});

app.post("/api/reports/claim-examiners-quality-report", (req, res, next) => {
  // res.status(404).json({ message: "No audited claim details found for the user in the selected date range", status: 404 });
  res.status(201).json();
});

// ADMIN SNAP SHOT
app.get("/api/admin/landing/active-user-snapshot", (req, res, next) => {
  const payload = {
    usersCount: 20,
    leadCount: 10,
    managerCount: 5,
    queueCount: 30,
    userGroups: 4
  };

  res.status(200).json(payload);
});

app.post("/api/maintenance-notification/save", (req, res, next) => {
  res.status(200).json("success");
});

app.post("/api/maintenance-notification/send", (req, res, next) => {
  res.status(200).json("send success!");
});

// app.post("/api/data-load/claims", (req, res, next) => {
//   console.log("inside app.js.....");
//   res.status(200).json("success!");
// });

app.get("/api/admin/landing/upcoming-scheduled-details", (req, res, next) => {
  const payload = {
    maintenanceMessage: "System will be having a downtime on next Tuesday",
    maintenanceDateFrom: "12 / 03 / 2020",
    maintenanceDateTo: null,
    fromTime: "12: 00 PM",
    toTime: "12.30 PM"
  };
  res.status(200).json(payload);
});

app.get(
  "/api/user-management/user/lead/details/first-name=Devika",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15
      }
    ];
    res.status(200).json(payload);
  }
);

app.get(
  "/api/user-management/user/lead/details/user-name=devika.k@ust-global.com",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 90
      }
    ];

    res.status(200).json(payload);
  }
);

app.get(
  "/api/user-management/user/lead/details/first-name=Devika",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];
    res.status(200).json(payload);
  }
);

app.get(
  "/api/user-management/user/lead/details/first-name=Devika",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];
    res.status(200).json(payload);
  }
);
app.get(
  "/api/user-management/user/lead/details/user-name=devika.k@ust-global.com",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];

    res.status(200).json(payload);
  }
);

app.get(
  "/api/user-management/user/lead/details/first-name=Devika",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];
    res.status(200).json(payload);
  }
);

app.get(
  "/api/user-management/user/lead/details/user-name=devika.k@ust-global.com",
  (req, res, next) => {
    const payload = [
      {
        id: 7,
        firstName: "Devika",
        lastName: "Kumari",
        dateOfBirth: "2020-02-28",
        userName: "devika.k@ust-global.com",
        communicationEmail: "devika.kumari@ust-global.com",
        role: "Claims Examiner",
        status: "Active",
        activeDate: "2020-02-28",
        deactivateDate: "2099-12-31",
        ldapOrLocal: false,
        userGroupId: 2,
        userGroupName: "UG1",
        leadName: "Tino",
        managerName: "Deepa",
        target: 15,
        userRoleId: 4
      }
    ];

    res.status(200).json(payload);
  }
);

app.get("/api/tableData", (req, res, next) => {
  tableData = [
    { vin: "a1653d4d", brand: "VW", year: 1998, color: "White", price: 10000 },
    {
      vin: "ddeb9b10",
      brand: "Mercedes",
      year: 1985,
      color: "Green",
      price: 25000
    },
    {
      vin: "d8ebe413",
      brand: "Jaguar",
      year: 1979,
      color: "Silver",
      price: 30000
    },
    {
      vin: "aab227b7",
      brand: "Audi",
      year: 1970,
      color: "Black",
      price: 12000
    },
    { vin: "631f7412", brand: "Volvo", year: 1992, color: "Red", price: 15500 },
    { vin: "7d2d22b0", brand: "VW", year: 1993, color: "Maroon", price: 40000 },
    { vin: "50e900ca", brand: "Fiat", year: 1964, color: "Blue", price: 25000 },
    {
      vin: "4bbcd603",
      brand: "Renault",
      year: 1983,
      color: "Maroon",
      price: 22000
    },
    {
      vin: "70214c7e",
      brand: "Renault",
      year: 1961,
      color: "Black",
      price: 19000
    },
    {
      vin: "ec229a92",
      brand: "Audi",
      year: 1984,
      color: "Brown",
      price: 36000
    },
    {
      vin: "1083ee40",
      brand: "VW",
      year: 1984,
      color: "Silver",
      price: 215000
    },
    {
      vin: "6e0da3ab",
      brand: "Volvo",
      year: 1987,
      color: "Silver",
      price: 32000
    },
    {
      vin: "5aee636b",
      brand: "Jaguar",
      year: 1995,
      color: "Maroon",
      price: 20000
    },
    {
      vin: "7cc43997",
      brand: "Jaguar",
      year: 1984,
      color: "Orange",
      price: 14000
    },
    {
      vin: "88ec9f66",
      brand: "Honda",
      year: 1989,
      color: "Maroon",
      price: 36000
    },
    { vin: "f5a4a5f5", brand: "BMW", year: 1986, color: "Blue", price: 28000 },
    {
      vin: "15b9a5c9",
      brand: "Mercedes",
      year: 1986,
      color: "Orange",
      price: 14000
    },
    {
      vin: "f7e18d01",
      brand: "Mercedes",
      year: 1991,
      color: "White",
      price: 25000
    },
    { vin: "cec593d7", brand: "VW", year: 1992, color: "Blue", price: 36000 },
    {
      vin: "d5bac4f0",
      brand: "Renault",
      year: 2001,
      color: "Blue",
      price: 25000
    },
    {
      vin: "56b527c8",
      brand: "Jaguar",
      year: 1990,
      color: "Yellow",
      price: 52000
    },
    {
      vin: "1ac011ff",
      brand: "Audi",
      year: 1966,
      color: "Maroon",
      price: 45000
    },
    { vin: "fc074185", brand: "BMW", year: 1962, color: "Blue", price: 54000 },
    {
      vin: "606ba663",
      brand: "Honda",
      year: 1982,
      color: "Blue",
      price: 22000
    },
    {
      vin: "d05060b8",
      brand: "Mercedes",
      year: 2003,
      color: "Silver",
      price: 15000
    },
    {
      vin: "46e4bbe8",
      brand: "Mercedes",
      year: 1986,
      color: "White",
      price: 18000
    },
    { vin: "c29da0d7", brand: "BMW", year: 1983, color: "Brown", price: 32000 },
    { vin: "24622f70", brand: "VW", year: 1973, color: "Maroon", price: 36000 },
    {
      vin: "7f573d2c",
      brand: "Mercedes",
      year: 1991,
      color: "Red",
      price: 21000
    },
    {
      vin: "b69e6f5c",
      brand: "Jaguar",
      year: 1993,
      color: "Yellow",
      price: 16000
    },
    {
      vin: "ead9bf1d",
      brand: "Fiat",
      year: 1968,
      color: "Maroon",
      price: 43000
    },
    {
      vin: "bc58113e",
      brand: "Renault",
      year: 1981,
      color: "Silver",
      price: 36000
    },
    {
      vin: "2989d5b1",
      brand: "Honda",
      year: 2006,
      color: "Blue",
      price: 240000
    },
    {
      vin: "c243e3a0",
      brand: "Fiat",
      year: 1990,
      color: "Maroon",
      price: 15000
    },
    {
      vin: "e3d3ebf3",
      brand: "Audi",
      year: 1996,
      color: "White",
      price: 28000
    },
    {
      vin: "45337e7a",
      brand: "Mercedes",
      year: 1982,
      color: "Blue",
      price: 14000
    },
    {
      vin: "36e9cf7e",
      brand: "Fiat",
      year: 2000,
      color: "Orange",
      price: 26000
    },
    {
      vin: "036bf135",
      brand: "Mercedes",
      year: 1973,
      color: "Black",
      price: 22000
    },
    {
      vin: "ad612e9f",
      brand: "Mercedes",
      year: 1975,
      color: "Red",
      price: 45000
    },
    {
      vin: "97c6e1e9",
      brand: "Volvo",
      year: 1967,
      color: "Green",
      price: 42000
    },
    { vin: "ae962274", brand: "Volvo", year: 1982, color: "Red", price: 36000 },
    { vin: "81f8972a", brand: "BMW", year: 2007, color: "Black", price: 56000 },
    { vin: "f8506743", brand: "Audi", year: 1975, color: "Blue", price: 42000 },
    {
      vin: "596859d1",
      brand: "Fiat",
      year: 2002,
      color: "Green",
      price: 48000
    },
    {
      vin: "d83c1d9a",
      brand: "Volvo",
      year: 1972,
      color: "Black",
      price: 29000
    },
    {
      vin: "32f41550",
      brand: "Mercedes",
      year: 1978,
      color: "Brown",
      price: 17000
    },
    {
      vin: "c28cd2e4",
      brand: "Volvo",
      year: 1982,
      color: "Silver",
      price: 24000
    },
    {
      vin: "80890dcc",
      brand: "Audi",
      year: 1962,
      color: "White",
      price: 36000
    },
    { vin: "4bf1aeb5", brand: "VW", year: 2000, color: "Silver", price: 24000 },
    {
      vin: "45ca4786",
      brand: "BMW",
      year: 1995,
      color: "Maroon",
      price: 50000
    }
  ];
  res.status(200).json(tableData);
});

// Claim Reprio
app.get("/api/claims/unassigned", (req, res, next) => {
  const data = {
    claimDetails: [
      {
        id: 10,
        claimId: "2019101400000121",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 11,
        claimId: "2019101400001656",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 12,
        claimId: "2019101400001655",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 13,
        claimId: "2019101500001736",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 16,
        claimId: "2019101500001730",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 31,
        claimId: "2019102300000004",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 32,
        claimId: "2019093000001059",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 50,
        claimId: "2019102900000006",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 49,
        claimId: "2019102900001840",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 285,
        claimId: "2018123100000188",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 442,
        claimId: "2019111200000238",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 512,
        claimId: "2019111200000271",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 521,
        claimId: "2019111200000377",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      }
    ]
  };
  res.status(200).json(data);
});

app.post("/api/claims/search/details", (req, res, next) => {
  const data = {
    claimDetails: [
      {
        id: 2,
        claimId: "2019022200000150",
        claimQueueName: "Hdsadssa",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: false
      },
      {
        id: 9,
        claimId: "2019101400000267",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "PENDED",
        claimPriorityStatus: true
      },
      {
        id: 10,
        claimId: "2019101400000121",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 11,
        claimId: "2019101400001656",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 12,
        claimId: "2019101400001655",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 13,
        claimId: "2019101500001736",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 16,
        claimId: "2019101500001730",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 31,
        claimId: "2019102300000004",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 32,
        claimId: "2019093000001059",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 50,
        claimId: "2019102900000006",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 49,
        claimId: "2019102900001840",
        claimQueueName: "Missing Data Elements WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "Missing_data_team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 203,
        claimId: "2019110800000220",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 317,
        claimId: "2019111100000074",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 275,
        claimId: "2019111100000007",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 283,
        claimId: "2019010100000216",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 284,
        claimId: "2019060500000168",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 273,
        claimId: "2019111100000297",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 272,
        claimId: "2019111100000155",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 285,
        claimId: "2018123100000188",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 442,
        claimId: "2019111200000238",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 512,
        claimId: "2019111200000271",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      },
      {
        id: 521,
        claimId: "2019111200000377",
        claimQueueName: "High Dollar WB",
        memberId: "JB123452",
        memberName: "Johnny Blaze",
        providerName: "Physician Billing Services",
        taxId: "DUMMY",
        groupName: "High_Dollar_Team",
        taskStatus: "UNASSIGNED",
        claimPriorityStatus: true
      }
    ]
  };
  res.status(200).json(data);
});

app.post("/api/claims/save/details/priority", (req, res, next) => {
  res.status(200).json({ success: "true" });
});

app.post("/api/reassign/claim-status-reassign", (req, res, next) => {
  res
    .status(200)
    .json(["Auditor Routed In", "Review/Rebuttal", "Backlog", "Routed In"]);
});

app.get("/api/reassign/get-roles", (req, res, next) => {
  res.status(200).json([
    {
      value: 4,
      label: "Claims Examiner"
    },
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
  ]);
});

app.post("/api/reassign/get-assign-to-roles", (req, res, next) => {
  res.status(200).json([
    {
      value: 4,
      label: "Claims Examiner"
    },
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
  ]);
});

app.post("/api/reassign/list-claims", (req, res, next) => {
  const payload = [];
  for (i = 0; i < 50; i++)
    payload.push({
      slNo: i,
      claimId: "2019060500000168" + i,
      claimStatus: "ROUTED",
      claimType: null,
      receiptDate: "2019-11-11",
      age: 0,
      memberName: "Johnny Blaze",
      providerName: "Physician Billing Services",
      billedAmount: 49166.09 + i,
      queueName: "Q1",
      wfmStatus: "Pended",
      wfmAge: 0,
      taskAssignmentId: 1,
      pendedId: 1,
      routedId: 1,
      userGroup: "Itemized Bill"
    });
  setTimeout(() => {
    res.status(200).json(payload);
  }, 6000);
});

app.post("/api/reassign/refresh-claims", (req, res, next) => {
  const payload = [];
  for (i = 0; i < 50; i++)
    payload.push({
      slNo: i,
      claimId: "2019060500000168" + i,
      claimStatus: "ROUTED",
      claimType: null,
      receiptDate: "2019-11-11",
      age: 0,
      memberName: "Johnny Blaze",
      providerName: "Physician Billing Services",
      billedAmount: 49166.09,
      queueName: "Q1",
      wfmStatus: "Pended",
      wfmAge: 0,
      taskAssignmentId: 1,
      pendedId: 1,
      routedId: 1,
      userGroup: "Itemized Bill"
    });
  res.status(200).json(payload);
});

app.get("/api/refresh/materialized-view", (req, res, next) => {
  res.status(201).json("success");
});

app.post("/api/reassign/get-users-list", (req, res, next) => {
  res.status(200).json([
    {
      value: 3,
      label: "Deepa John"
    },
    {
      value: 18,
      label: "Izaria John"
    },
    {
      value: 4,
      label: "Manu Manoharan"
    }
  ]);
});

app.get("/api/claim/route/reassign/reasons", (req, res, next) => {
  res.status(200).json([
    {
      routeReasonCode: 19,
      routeReason: "Already Routed Claim"
    },
    {
      routeReasonCode: 1,
      routeReason: "Incorrect Assignment"
    },
    {
      routeReasonCode: 2,
      routeReason: "Approval Required"
    },
    {
      routeReasonCode: 3,
      routeReason: "Pending Claim"
    },
    {
      routeReasonCode: 4,
      routeReason: "Pending For Long Time"
    },
    {
      routeReasonCode: 5,
      routeReason: "Review to Medical Management"
    },
    {
      routeReasonCode: 7,
      routeReason: "Unidentified claim type"
    },
    {
      routeReasonCode: 6,
      routeReason: "Approval is Required"
    },
    {
      routeReasonCode: 8,
      routeReason: "Incorrect assigne"
    },
    {
      routeReasonCode: 9,
      routeReason: "Missing ID"
    },
    {
      routeReasonCode: 10,
      routeReason: "Missing configuration"
    }
  ]);
});

app.get("/api/claims-audit/route/reasons", (req, res, next) => {
  res.status(200).json([
    {
      routeReasonCode: 19,
      routeReason: "Already Routed Claim"
    },
    {
      routeReasonCode: 1,
      routeReason: "Incorrect Assignment"
    },
    {
      routeReasonCode: 2,
      routeReason: "Approval Required"
    },
    {
      routeReasonCode: 3,
      routeReason: "Pending Claim"
    },
    {
      routeReasonCode: 4,
      routeReason: "Pending For Long Time"
    },
    {
      routeReasonCode: 5,
      routeReason: "Review to Medical Management"
    },
    {
      routeReasonCode: 7,
      routeReason: "Unidentified claim type"
    },
    {
      routeReasonCode: 6,
      routeReason: "Approval is Required"
    },
    {
      routeReasonCode: 8,
      routeReason: "Incorrect assigne"
    },
    {
      routeReasonCode: 9,
      routeReason: "Missing ID"
    },
    {
      routeReasonCode: 10,
      routeReason: "Missing configuration"
    }
  ]);
});

app.get("/api/configuration/reassignment-reasons", (req, res, next) => {
  res.status(200).json({
    reassignmentReasonDtos: [
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Missing configuration",
        status: true
      },
      {
        reassignmentReasonCode: 2,
        reassignmentReason: "Missing Info",
        status: true
      }
    ]
  });
});

app.post("/api/reassign/users-per-user-group", (req, res, next) => {
  res.status(200).json([
    {
      value: 15,
      label: "To Robert Downey"
    },
    {
      value: 5,
      label: "To Manju Varghese"
    }
  ]);
});

app.post("/api/reassign/reassign-claims", (req, res, next) => {
  setTimeout(() => {
    res.status(200).json({ success: true });
  }, 3000);
});

app.get("/api/audit/home/dashboard/queue/summary", (req, res, next) => {
  res.status(200).json({
    todayQueue: 0,
    backlog: 1,
    rebuttalQueue: 1
  });
});

app.post("/api/configuration/create/review-roles", (req, res, next) => {
  res.status(201).json("success");
});

app.get("/api/audit/home/dashboard/status", (req, res, next) => {
  res.status(200).json({
    completeCount: 2,
    successCount: 1,
    failedCount: 1
  });
});

app.get(
  "/api/audit/home/dashboard/processed-claims-inventory",
  (req, res, next) => {
    res.status(200).json({
      totalClaimsCount: 2,
      manualClaimsCount: 1,
      adjustedClaimsCount: 1,
      claimSource: {
        Paper: 1,
        EDI: 1
      },
      claimType: {
        Others: 1,
        Professional: 1
      },
      claimDecision: {
        Paid: 1,
        Deny: 1
      }
    });
  }
);

app.post("/api/audit/home/sampling/queue/add", (req, res, next) => {
  res.status(201).json("success");
});

app.post("/api/audit/home/sampling/count", (req, res, next) => {
  res.status(201).json({
    autoSamplingCount: 8,
    manualSamplingCount: 0
  });
});

app.get("/api/audit/home/dashboard/backlog/detail", (req, res, next) => {
  const data = [
    {
      taskId: 4,
      claimId: "2019100700000045",
      claimType: "Institutional OP",
      status: "Denied",
      receiptDate: "01/15/2020",
      age: 111,
      providerName: "Demo_Test_Supplier",
      memberGroupName: "Test1",
      billedAmount: 18.25,
      allowedAmount: 0,
      paidAmount: 0,
      claimQueueName: "hcc_super_user",
      processedDate: "04/29/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 5,
      backlogStatus: null,
      assignType: "Auditor"
    }
  ];
  res.status(200).json(data);
});

app.get("/api/audit/home/dashboard/queue/detail", (req, res, next) => {
  const data = [
    {
      taskId: 1,
      claimId: "2019020100001543",
      claimType: "Professional",
      status: "Final",
      receiptDate: "10/01/2020",
      age: -147,
      providerName: "MA Physician Network",
      memberGroupName: "Test1",
      billedAmount: 100,
      allowedAmount: 60,
      paidAmount: 60,
      claimQueueName: "hcc_super_user",
      processedDate: "10/02/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 7
    },
    {
      taskId: 2,
      claimId: "2019082800000200",
      claimType: "Institutional IP",
      status: "Final",
      receiptDate: "02/11/2020",
      age: 86,
      providerName: "Demo_Test_Supplier",
      memberGroupName: "Test1",
      billedAmount: 500,
      allowedAmount: 200,
      paidAmount: 130,
      claimQueueName: "hcc_super_user",
      processedDate: "02/29/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 9
    },
    {
      taskId: 7,
      claimId: "2019082800000205",
      claimType: "Institutional IP",
      status: "Final",
      receiptDate: "02/11/2020",
      age: 86,
      providerName: "Demo_Test_Supplier",
      memberGroupName: "Test1",
      billedAmount: 500,
      allowedAmount: 200,
      paidAmount: 130,
      claimQueueName: "hcc_super_user",
      processedDate: "02/29/2020 10:43",
      examinerName: "Manju Varghese",
      backlogAge: 3
    }
  ];
  res.status(200).json(data);
});

app.get(
  "/api/audit/home/dashboard/backlog/remove?taskIds=8",
  (req, res, next) => {
    res.status(201).json("success");
  }
);

app.post("/api/audit/home/dashboard/queue/remove", (req, res, next) => {
  res.status(201).json("success");
});

// API's for manual sampling

app.get("/api/enrollment/audit/manual/settings", (req, res, next) => {
  const payload = {
    userGroup: [
      {
        id: 3,
        name: "User Group 3"
      },
      {
        id: 4,
        name: "User Group 4"
      }
    ],
    workCategory: [
      {
        id: 2,
        name: "RECONCILIATION"
      },
      {
        id: 3,
        name: "WORKBASKET"
      },
      {
        id: 3,
        name: "IDCARDREQUEST"
      }
    ],
    transactionCategory: [
      // {
      //   id: 3,
      //   name: "Transaction Category 3"
      // },
      // {
      //   id: 4,
      //   name: "Transaction Category 4"
      // }
    ],
    benefitPlan: [
      {
        id: 1,
        name: "Benefit Plan 1"
      },
      {
        id: 2,
        name: "Benefit Plan 2"
      }
    ],
    memberGroup: [
      {
        id: 1,
        name: "Member Group 1"
      },
      {
        id: 2,
        name: "Member Group 2"
      }
    ],
    planType: [
      {
        id: "1",
        name: "planType Type 1"
      },
      {
        id: "2",
        name: "planType Type 2"
      }
    ],
    enrollmentSpecilst: [
      { id: "1", name: "Brad Pitt" },
      { id: "2", name: "Archana Sreekmar" },
      { id: "3", name: "Liya Jose" }
    ],

    totalSamplingClaimsPercentage: 0,
    workbasketPercentage: 25,
    reconciliationPercentage: 65,
    falloutPercentage: 0.0,
    newGroupEnrollmentPercentage: 0,
    groupRenewalPercentage: 0,
    idCardRequestPercentage: 78.5,
    bulkTerminationPercentage: 0,
    otherTicketsPercentage: 0
  };
  res.status(200).json(payload);
});

app.get("/api/audit/manual/filter", (re, res, next) => {
  const payload = {
    userGroup: [
      {
        id: "1",
        name: "QAudit-1"
      },
      {
        id: "2",
        name: "QAudit-2"
      }
    ],
    lineOfBusiness: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "Medicaid"
      },
      {
        id: 3,
        name: "Commercial"
      },
      {
        id: 4,
        name: "Medicare"
      }
    ],
    planType: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "POS"
      },
      {
        id: 3,
        name: "HMO"
      },
      {
        id: 4,
        name: "PPO"
      }
    ],
    diagnosisCodes: [
      {
        id: 1,
        name: "J30.1"
      },
      {
        id: 2,
        name: "A00"
      },
      {
        id: 3,
        name: "J30.2"
      },
      {
        id: 4,
        name: "B81.1"
      },
      {
        id: 5,
        name: "A02"
      },
      {
        id: 6,
        name: "005.1"
      },
      {
        id: 7,
        name: "A15.7"
      },
      {
        id: 8,
        name: "001.0"
      }
    ],
    procedureCodes: [
      {
        id: 1,
        name: "005H4ZZ"
      },
      {
        id: 2,
        name: "00970ZZ"
      },
      {
        id: 3,
        name: "00930ZZ"
      },
      {
        id: 4,
        name: "008J4ZZ"
      }
    ],
    providers: [
      {
        code: "Mary Black Physicians Group LLC",
        name: "Mary Black Physicians Group LLC"
      },
      {
        code: "TestProv",
        name: "Physician Billing Services"
      },
      {
        code: "RP1005",
        name: "Demo Out of Area Supplier"
      },
      {
        code: "PHC_Supplier",
        name: "PHC_Supplier"
      },
      {
        code: "TESTUNI01",
        name: "Physician Billing Services"
      },
      {
        code: "RP1003",
        name: "Demo Test Supplier 3"
      },
      {
        code: "RP1007",
        name: "Demo Out of Network Supplier"
      },
      {
        code: "TESTUST001",
        name: "Do Not Use Doctors Care"
      },
      {
        code: "MAP0001",
        name: "MA Physician Network"
      },
      {
        code: "Physician Billing Services",
        name: "Physician Billing Services"
      },
      {
        code: "MP1001",
        name: "Mridula Test Provider"
      },
      {
        code: "S00000026",
        name: "Test_Ancillary1"
      },
      {
        code: "S00000003",
        name: "Test Supplier2"
      },
      {
        code: "S00000025",
        name: "Test_Facility3"
      },
      {
        code: "EDGE_DUMMY_SUPP",
        name: "EDGE_DUMMY_SUPPID"
      },
      {
        code: "S00000002",
        name: "Test Supplier1"
      },
      {
        code: "S00000101",
        name: "Test Supplier_Reshma"
      },
      {
        code: "S00000021",
        name: "Downtown Greenville Hospital1"
      },
      {
        code: "MP1002",
        name: "Mridula Test Provider"
      },
      {
        code: "S0000001",
        name: "Physician Billing Services"
      },
      {
        code: "S00000028",
        name: "Test_Facility5"
      },
      {
        code: "S00000005",
        name: "Test_Medicare"
      },
      {
        code: "TESTUNI02",
        name: "SPARTANBURG REGIONAL HEALTH SERVICES"
      },
      {
        code: "RP1002",
        name: "Demo Test Supplier_2"
      },
      {
        code: "RP1001",
        name: "Rakesh Test Provider"
      },
      {
        code: "S00000061",
        name: "Non PAR Supplier"
      },
      {
        code: "S00000082",
        name: "Test_Supplier_RS"
      }
    ],
    memberGroup: [
      {
        code: "Louisville-0000",
        name: "Louisville-0000"
      },
      {
        code: "Test523",
        name: "Test5"
      },
      {
        code: "0000000021-002",
        name: "South Carolina"
      },
      {
        code: "Test423",
        name: "Test4"
      },
      {
        code: "Test123",
        name: "Test1"
      },
      {
        code: "0000000021-002-001",
        name: "Greenville"
      },
      {
        code: "R00010101",
        name: "Carmel-Sub-1"
      },
      {
        code: "0000",
        name: "Lexington"
      },
      {
        code: "R00010102",
        name: "Fishers-Sub-2"
      },
      {
        code: "R000102",
        name: "Marion County"
      },
      {
        code: "PHC_Medical Account",
        name: "PHC_Medical Account"
      },
      {
        code: "Test1234",
        name: "Test Account - 01"
      },
      {
        code: "0000000021",
        name: "MA"
      }
    ]
  };

  res.status(200).json(payload);
});

app.get("/api/enrollment/audit/manual/filter", (re, res, next) => {
  // const payload = {
  //   userGroup: [
  //     {
  //       id: "1",
  //       name: "QAudit-1"
  //     },
  //     {
  //       id: "2",
  //       name: "QAudit-2"
  //     }
  //   ],
  //   workCategory: [
  //     {
  //       id: "1",
  //       name: "Reconciliation"
  //     },
  //     {
  //       id: "2",
  //       name: "Work Basket"
  //     },
  //     {
  //       id: "3",
  //       name: "Fallout"
  //     },
  //     {
  //       id: "4",
  //       name: "New Group"
  //     },
  //     {
  //       id: "5",
  //       name: "ID Card Request"
  //     },
  //     {
  //       id: "6",
  //       name: "Payment Posting"
  //     },
  //     {
  //       id: "7",
  //       name: "Bulk Termination"
  //     },
  //     {
  //       id: "8",
  //       name: "Group Renewal"
  //     },
  //     {
  //       id: "9",
  //       name: "Other Tickets"
  //     },
  //   ],
  //   transactionStartegy: [
  //     {
  //       id: "1",
  //       name: "Strategy Type 1"
  //     },
  //     {
  //       id: "2",
  //       name: "Strategy Type 2"
  //     }
  //   ],
  //   benefitPlan: [
  //     {
  //       id: "1",
  //       name: "benefitPlan Type 1"
  //     },
  //     {
  //       id: "2",
  //       name: "benefitPlan Type 2"
  //     }
  //   ],
  //   memberGroup: [
  //     {
  //       id: "1",
  //       name: "memberGroup Type 1"
  //     },
  //     {
  //       id: "2",
  //       name: "memberGroup Type 2"
  //     }
  //   ],
  //   planType: [
  //     {
  //       id: "1",
  //       name: "planType Type 1"
  //     },
  //     {
  //       id: "2",
  //       name: "planType Type 2"
  //     }
  //   ]
  // };

  const payload = {
    benefitPlan: [
      {
        id: 1,
        name: "Benefit Plan 1"
      },
      {
        id: 2,
        name: "Benefit Plan 2"
      },
      {
        id: 3,
        name: "Benefit Plan 3"
      }
    ],
    memberGroup: [
      {
        id: 1,
        name: "Member Group 1"
      },
      {
        id: 2,
        name: "Member Group 2"
      },
      {
        id: 3,
        name: "Member Group 3"
      }
    ],
    transactionCategory: [
      {
        id: 1,
        name: "Transaction Category 1"
      },
      {
        id: 2,
        name: "Transaction Category 2"
      },
      {
        id: 3,
        name: "Transaction Category 3"
      },
      {
        id: 4,
        name: "Transaction Category 4"
      }
    ],
    userGroup: [
      {
        id: 1,
        name: "User Group 1"
      },
      {
        id: 2,
        name: "User Group 2"
      },
      {
        id: 3,
        name: "User Group 3"
      },
      {
        id: 4,
        name: "User Group 4"
      }
    ],
    workCategory: [
      {
        id: 1,
        name: "FALLOUT"
      },
      {
        id: 2,
        name: "RECONCILIATION"
      },
      {
        id: 3,
        name: "WORKBASKET"
      }
    ],
    falloutPercentage: 40,
    workbasketPercentage: 20,
    reconciliationPercentage: 30,
    bulkTerminationPercentage: 0,
    groupRenewalPercentage: 0,
    idCardRequestPercentage: 0,
    newGroupEnrollmentPercentage: 0,
    otherTicketsPercentage: 0,
    totalPercentage: 15
  };
  res.status(200).json(payload);
});

app.post("/api/audit/manual/examiner", (req, res, next) => {
  const payload = [
    { id: "1", name: "Brad Pitt" },
    { id: "2", name: "Archana Sreekmar" },
    { id: "3", name: "Liya Jose" },
    { id: "4", name: "Rinu Jacob" },
    { id: "5", name: "Harris Ameen" },
    { id: "6", name: "Tino Jose" }
  ];

  res.status(200).json(payload);
});

app.post("/api/enrollment/audit/manual/specialist", (req, res, next) => {
  const payload = [
    { id: "1", name: "Brad Pitt" },
    { id: "2", name: "Archana Sreekmar" },
    { id: "3", name: "Liya Jose" },
    { id: "4", name: "Rinu Jacob" },
    { id: "5", name: "Harris Ameen" },
    { id: "6", name: "Tino Jose" }
  ];
  res.status(200).json(payload);
});

app.post("/api/audit/manual/refresh/count", (req, res, next) => {
  const payload = { totalClaimsCount: 100 };
  res.status(200).json(payload);
});

app.post("/api/enrollment/audit/manual/general/queue/add", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.get(
  "/api/enrollment/audit/manual/assigned/count/user",
  (req, res, next) => {
    res.status(200).json({ auditQueueCount: 25 });
  }
);

app.get("/api/audit/auditor/queue/get-claim", (req, res, next) => {
  res.status(201).json({
    auditTaskId: 32,
    claimId: "20190422000625",
    claimType: "Institutional-IP",
    receiptDate: "04/22/2019",
    claimsAge: 386,
    providerName: "Mridula Test Provider",
    memberGroupName: "Carmel-Sub-1",
    billedAmount: 13000,
    allowedAmount: 3000600,
    paidAmount: 2999680,
    processedDate: "01/29/2020",
    queueName: "hcc_super_user",
    examinerName: null,
    savedForLater: false,
    errorType: null,
    financialImpact: null,
    auditorAmount: null,
    auditorComments: null,
    endTimer: null,
    attachmentOne: null,
    attachmentTwo: null,
    attachmentThree: null,
    attachmentFour: null,
    attachmentFive: null,
    attachmentSix: null,
    checkListItems: [
      {
        id: "check3",
        name: "check3"
      },
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check2",
        name: "check2"
      }
    ],
    savedCheckListItems: null,
    managerLeadNameDetails: [
      {
        id: 3,
        name: "Deepa John"
      },
      {
        id: 5,
        name: "Manju Varghese"
      }
    ],
    routeReasons: [
      {
        id: 1,
        name: "ASDDSD"
      },
      {
        id: 2,
        name: "ASDSDSD"
      }
    ]
  });
});

app.get("/api/audit/home/dashboard/queue/:id", (req, res, next) => {
  res.status(201).json({
    auditTaskId: 32,
    claimId: "20190422000625",
    claimType: "Institutional-IP",
    receiptDate: "04/22/2019",
    claimsAge: 386,
    providerName: "Mridula Test Provider",
    memberGroupName: "Carmel-Sub-1",
    billedAmount: 13000,
    allowedAmount: 3000600,
    paidAmount: 2999680,
    processedDate: "01/29/2020",
    queueName: "hcc_super_user",
    examinerName: null,
    savedForLater: true,
    savedForLaterStatus: "PASSED",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 1000,
    auditorComments: "financial error",
    endTimer: "00:01:03",
    attachmentOne: null,
    attachmentTwo: null,
    attachmentThree: null,
    attachmentFour: null,
    attachmentFive: null,
    attachmentSix: null,
    checkListItems: [
      {
        id: "check3",
        name: "check3"
      },
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check2",
        name: "check2"
      }
    ],
    savedCheckListItems: [
      {
        id: "check3",
        name: "check3"
      },
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check2",
        name: "check2"
      }
    ],
    managerLeadNameDetails: [
      {
        id: 3,
        name: "Deepa John"
      },
      {
        id: 5,
        name: "Manju Varghese"
      }
    ],
    routeReasons: [
      {
        id: 1,
        name: "ASDDSD"
      },
      {
        id: 2,
        name: "ASDSDSD"
      }
    ]
  });
});
app.get("/api/audit/auditor/queue/get-claim/initialized", (req, res, next) => {
  const data = {
    auditTaskId: 35,
    claimId: "20190121001224",
    claimType: "Institutional-IP",
    claimStatus: "Final",
    receiptDate: "01/21/2019",
    claimsAge: 477,
    providerName: "SUPPLIER_1563771690521213964",
    memberGroupName: "Lexington",
    billedAmount: 100,
    allowedAmount: 70,
    paidAmount: 70,
    processedDate: "01/20/2020",
    queueName: "hcc_super_user",
    examinerName: null,
    savedForLater: true,
    savedForLaterStatus: "FAILED",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: 250,
    auditorComments: "Test",
    endTimer: "00:27:28",
    attachmentOne: {
      filePosition: "attachmentOne",
      fileId: 20,
      fileName: "My Users Report-04082020.xlsx"
    },
    attachmentTwo: {
      filePosition: "attachmentTwo",
      fileId: 21,
      fileName: "144273-ECard.pdf"
    },
    attachmentThree: null,
    attachmentFour: null,
    attachmentFive: null,
    attachmentSix: null,
    checkListItems: [
      {
        id: "check3",
        name: "check3"
      },
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check2",
        name: "check2"
      }
    ],
    savedCheckListItems: [
      {
        id: "check1",
        name: "check1"
      },
      {
        id: "check3",
        name: "check3"
      }
    ],
    managerLeadNameDetails: [
      {
        id: 3,
        name: "Deepa John"
      },
      {
        id: 5,
        name: "Manju Varghese"
      }
    ],
    routeReasons: [
      {
        id: 1,
        name: "ASDDSD"
      },
      {
        id: 2,
        name: "ASDSDSD"
      }
    ]
  };
  res.status(201).json(data);
});

app.post(
  "/api/file/management/upload/audit/task/attachments",
  (req, res, next) => {
    const payload = { success: "OK" };
    res.status(200).json(payload);
  }
);

app.post("/api/audit/auditor/queue/save-for-later", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.post("/api/audit/auditor/queue/claim/final/submit", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.get("/api/file/management/download/:fileId", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(201).json(payload);
});

app.get("/api/file/management/delete/audit/task/:id", (req, res, next) => {
  const payload = [
    {
      filePosition: "attachmentOne",
      fileId: 20,
      fileName: "My Users Report-04082020.xlsx"
    }
  ];
  res.status(201).json(payload);
});

app.get("/api/file/management/delete/audit/flow/:id", (req, res, next) => {
  res.status(201).json("success");
});

app.post("/api/lead/review/rebut", (req, res, next) => {
  res.status(201).json("success");
});

app.post("/api/enrollment/audit/manual/settings/save", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.post(
  "/api/enrollment/audit/manual/population/statistics",
  (req, res, next) => {
    const payload = {
      create: 1,
      amend: 160,
      terminate: 16,
      errorReport: 366,
      reconReport: 574,
      idCardRequest: 0,
      demoGraphicChange: 345,
      planChange: 255,
      nameCorrection: 1,
      genderCorrection: 0,
      checkNotIssued: 102,
      denied: 141,
      totalClaims: 700
    };
    res.status(200).json(payload);
  }
);

app.get("/api/audit/auto/settings", (req, res, next) => {
  const payload = {
    userGroups: [
      {
        id: 1,
        name: "QAudit 1"
      }
    ],
    lineOfBusiness: [
      {
        id: 1,
        name: "DDD"
      },
      {
        id: 2,
        name: "Medicaid"
      }
    ],
    planTypes: [
      {
        id: 3,
        name: "HMO"
      },
      {
        id: 4,
        name: "PPO"
      }
    ],
    processWorkFlowExclusions: [
      "Auto Adjudicated",
      "Adjusted Claims",
      "Externally Priced"
    ],
    billedAmount: 10,
    paidAmount: 0,
    claimSources: [
      {
        EDI: 100,
        Paper: 100
      }
    ],
    claimTypes: [
      {
        Professional: 1,
        "Institutional-IP": 2,
        "Institutional-OP": 3,
        Others: 4
      }
    ],
    paymentStatus: [
      {
        Denied: 11,
        "Check Issued": 22,
        "Check Not Issued": 33
      }
    ],
    totalSamplingClaimsPercentage: 78
  };

  res.status(200).json(payload);
});

app.get("/api/audit/auto/filter", (req, res, next) => {
  const payload = {
    userGroup: [
      {
        id: 1,
        name: "QAudit 1"
      },
      {
        id: 2,
        name: "QAudit 2"
      }
    ],
    lineOfBusiness: [
      {
        id: 1,
        name: "DDD"
      },
      {
        id: 2,
        name: "Medicaid"
      },
      {
        id: 3,
        name: "Commercial"
      },
      {
        id: 4,
        name: "SSS"
      }
    ],
    planType: [
      {
        id: 1,
        name: "SSS"
      },
      {
        id: 2,
        name: "POS"
      },
      {
        id: 3,
        name: "HMO"
      },
      {
        id: 4,
        name: "PPO"
      }
    ]
  };
  res.status(200).json(payload);
});
app.post(
  "/api/reports/auditor/audit-rebuttal-list-report",
  (req, res, next) => {
    res.status(200).json({ success: true });
  }
);

app.post("/api/audit/auto/settings/save", (req, res, next) => {
  res.status(200).json({ success: true });
});

let checkpoint = {
  Professional: ["check1", "check2"],
  "Institutional-IP": ["check1", "check3", "check4", "check5"],
  "Institutional-OP": ["check1", "check3", "check4", "check5"],
  Others: ["check1", "check2"]
};

app.get("/api/audit/configuration/checklist", (req, res, next) => {
  res.status(201).json({
    checkpoints: checkpoint
  });
});

app.post("/api/audit/configuration/checklist/add", (req, res, next) => {
  const payload = req.body && req.body.checkpoints;
  console.log(req.body);
  checkpoint["Institutional-IP"] = [
    ...checkpoint["Institutional-IP"],
    ...(payload["Institutional-IP"] || [])
  ];
  checkpoint["Institutional-OP"] = [
    ...checkpoint["Institutional-OP"],
    ...(payload["Institutional-OP"] || [])
  ];
  checkpoint["Professional"] = [
    ...checkpoint["Professional"],
    ...(payload["Professional"] || [])
  ];
  checkpoint["Others"] = [
    ...checkpoint["Others"],
    ...(payload["Others"] || [])
  ];
  res.status(201).json({
    checkpoints: checkpoint
  });
});

app.post("/api/audit/configuration/checklist/remove", (req, res, next) => {
  const payload = req.body && req.body.checkpoints;
  checkpoint["Institutional-IP"] = checkpoint["Institutional-IP"].filter(
    val => {
      const values = payload["Institutional-IP"] || [];
      return values.indexOf(val) === -1;
    }
  );
  checkpoint["Institutional-OP"] = checkpoint["Institutional-OP"].filter(
    val => {
      const values = payload["Institutional-OP"] || [];
      return values.indexOf(val) === -1;
    }
  );
  checkpoint["Professional"] = checkpoint["Professional"].filter(val => {
    const values = payload["Professional"] || [];
    return values.indexOf(val) === -1;
  });
  checkpoint["Others"] = checkpoint["Others"].filter(val => {
    const values = payload["Others"] || [];
    return values.indexOf(val) === -1;
  });
  res.status(201).json({
    checkpoints: checkpoint
  });
});

module.exports = app;

app.post("/api/reports/auditor/audit-list-grid-view", (req, res, next) => {
  const response = {
    passed: 1,
    failed: 0,
    auditReportDtoList: [
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      },
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      },
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      },
      {
        claimId: "20180731000391",
        claimType: "Institutional IP",
        claimStatus: "Final",
        receiptDate: "2020-02-11",
        age: 91,
        providerName: "Demo_Test_Supplier",
        groupName: "Test1",
        billedAmount: 500,
        allowedAmount: 200,
        paidAmount: 130,
        processedDate: "2020-02-29",
        examinerName: "Devika",
        queueName: "hcc_super_user",
        auditorName: "Manu",
        auditDate: "2020-02-29",
        auditStatus: "PASSED",
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null
      }
    ]
  };
  res.status(200).json(
    response
    // timestamp: "2019-12-31T06:34:32.758+0000",
    // providerName: 404,
    // error: "Not Found",
    // message: "No report data found for the selected criteria",
    // path: "/api/reports/auditor/audit-list-grid-view"
  );
});

app.post(
  "/api/reports/auditor/audit-backlog-list-grid-view",
  (req, res, next) => {
    const response = {
      pendedCount: 1,
      savedCount: 1,
      reassignedCount: 0,
      totalCount: 2,
      auditBacklogReportDtoList: [
        {
          claimId: "20180731000341",
          claimType: "Professional",
          claimStatus: "Final",
          receiptDate: "2020-10-01",
          age: -142,
          providerName: "MA Physician Network",
          groupName: "Test1",
          billedAmount: 100,
          allowedAmount: 60,
          paidAmount: 60,
          processedDate: "2020-10-02",
          examinerName: "Devika",
          queueName: "hcc_super_user",
          backlogAge: 72,
          backlogStatus: "Saved"
        },
        {
          claimId: "20180731000341",
          claimType: "Professional",
          claimStatus: "Final",
          receiptDate: "2020-10-01",
          age: -142,
          providerName: "MA Physician Network",
          groupName: "Test1",
          billedAmount: 100,
          allowedAmount: 60,
          paidAmount: 60,
          processedDate: "2020-10-02",
          examinerName: "Devika",
          queueName: "hcc_super_user",
          backlogAge: 72,
          backlogStatus: "Saved"
        }
      ]
    };
    res.status(200).json(
      response

      // timestamp: "2019-12-31T06:34:32.758+0000",
      // providerName: 404,
      // error: "Not Found",
      // message: "No report data found for the selected criteria",
      // path: "/api/reports/auditor/audit-list-grid-view"
    );
  }
);

app.post("/api/auditor-reports/audit-backlog-report", (req, res, next) => {
  const response = [
    {
      claimId: 0,
      claimType: "Manju",
      claimproviderName: "Varghese",
      receiptDate: "manju.varghese@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "345",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Beginner",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Failed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    },
    {
      claimId: 0,
      claimType: "Tino",
      claimproviderName: "Jose",
      receiptDate: "tino.jose@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "757",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Expert",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Failed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    },
    {
      claimId: 0,
      claimType: "Tino",
      claimproviderName: "Jose",
      receiptDate: "tino.jose@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "890",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Expert",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Passed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    },
    {
      claimId: 0,
      claimType: "Tino",
      claimproviderName: "Jose",
      receiptDate: "tino.jose@ust-global.com",
      age: "Claims Lead",
      providerName: "Active",
      groupName: "2020-02-28",
      billedAmount: "2099-12-31",
      allowedAmount: "890",
      paidAmount: "Deepa John",
      processedDate: "2020-02-28",
      examinerName: "Expert",
      queueName: "Medi",
      auditorName: "Deepa",
      auditDate: "2020-02-28",
      auditStatus: "Passed",
      errorType: "Default",
      errorDescription: "Defaulted",
      financialImpact: "High",
      Amount: "45056"
    }
  ];
  res.status(200).json(
    response

    // timestamp: "2019-12-31T06:34:32.758+0000",
    // providerName: 404,
    // error: "Not Found",
    // message: "No report data found for the selected criteria",
    // path: "/api/reports/auditor/audit-list-grid-view"
  );
});

app.post(
  "/api/reports/auditor/audit-rebuttal-list-grid-view",
  (req, res, next) => {
    const response = {
      firstLevel: 0,
      secondLevel: 2,
      thirdLevel: 0,
      total: 2,
      examinerAccepted: 2,
      auditorAccepted: 2,
      auditRebuttalReportDtoList: [
        {
          claimId: "20180731000391",
          claimType: "Institutional IP",
          claimStatus: "Final",
          receiptDate: "2020-02-11",
          age: 91,
          providerName: "Demo_Test_Supplier",
          groupName: "Test1",
          billedAmount: 500,
          allowedAmount: 200,
          paidAmount: 130,
          processedDate: "2020-02-29",
          examinerName: "Devika",
          errorDescription: null,
          examinerAgreed: true,
          examinerRebuttalComment: "invalid",
          rebuttalLevel: "SECOND LEVEL",
          level2AuditorComments: "true",
          leadName: "Devika",
          managerName: "Manu",
          rebuttalDate: "2020-05-12",
          rebuttalStatus: "true"
        },
        {
          claimId: "20180731000341",
          claimType: "Professional",
          claimStatus: "Final",
          receiptDate: "2020-10-01",
          age: -142,
          providerName: "MA Physician Network",
          groupName: "Test1",
          billedAmount: 100,
          allowedAmount: 60,
          paidAmount: 60,
          processedDate: "2020-10-02",
          examinerName: "Devika",
          errorDescription: null,
          examinerAgreed: true,
          examinerRebuttalComment: "invalid",
          rebuttalLevel: "SECOND LEVEL",
          level2AuditorComments: "true",
          leadName: "Devika",
          managerName: "Manu",
          rebuttalDate: "2020-05-12",
          rebuttalStatus: "true"
        }
      ]
    };
    res.status(200).json(
      response

      // timestamp: "2019-12-31T06:34:32.758+0000",
      // providerName: 404,
      // error: "Not Found",
      // message: "No report data found for the selected criteria",
      // path: "/api/reports/auditor/audit-list-grid-view"
    );
  }
);

app.post("/api/reports/auditor/audit-list-report", (req, res, next) => {
  res.status(200).json("success");
});
app.post("/api/reports/auditor/audit-backlog-list-report", (req, res, next) => {
  res.status(200).json("success");
});
app.post("/api/reports/audit-claims-list-report-template", (req, res, next) => {
  res.status(200).json("success");
});
app.post("/api/reports/reassign-excel-download", (req, res, next) => {
  res.status(200).json("success");
});
app.post("/api/deletion/reports-excel", (req, res, next) => {
  res.status(200).json("success");
});
app.get("/api/get-audit-failed-count", (req, res, next) => {
  res.status(200).json({
    auditFailed: 1
  });
});

app.get("/api/get-audit-failed-list", (req, res, next) => {
  res.status(200).json([
    {
      slNo: 1,

      claimId: "2019102900000246",

      claimType: "Institutional",

      claimStatus: "Review",

      receiptDate: "2019-10-29",

      claimByAge: 196,

      providerName: "Physician Billing Services",

      groupName: null,

      billedAmount: null,

      allowedAmount: null,

      totalPaidAmount: null,

      processedDate: "2020-01-03T11:09:00.000+0000",

      queueName: "Itemized Bill WB",

      auditorName: "Sonima Nambiar",

      auditDate: "2020-05-03",

      auditStatus: "FAILED",

      errorType: null,

      errorDescription: null,

      financialImpact: null,

      amount: null
    }
  ]);
});

app.get("/api/userGroup/getAllUserGroupsForLead", (req, res, next) => {
  res.status(200).json([
    {
      groupId: 7,
      groupName: "Itemized_Bill_Team",
      leadId: 5,
      leadName: "Manju Varghese",
      managerId: 3,
      managerName: "Deepa John",
      target: 55,
      description: "Itemized Bill Work Group",
      userGroupType: {
        id: 1,
        name: "Claims"
      },
      queueName: {
        queueId: 1,
        queueName: "Itemized Bill WB"
      }
    }
  ]);
});

app.post("/api/userGroup/updateUserGroupTarget", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.get("/api/lead/review/get-claim", (req, res, next) => {
  const data = {
    auditTaskId: 19,
    auditFlowId: 47,
    claimId: "20190603000765",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 19,
    providerName: "Test Supplier1",
    memberGroupName: "Test Account - 01",
    billedAmount: 2000,
    allowedAmount: 2000,
    paidAmount: 2000,
    currentLevel: 3,
    processedDate: "05/17/2020 07:32",
    queueName: "hcc_super_user",
    errorType: null,
    financialImpact: null,
    auditorAmount: null,
    auditorComments: ["Rebutted ", "Failed due to financial error"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 31,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 30,
          fileName: "frogs.jpg"
        }
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Audit - 06012020.xlsx"
        }
      }
    ],
    status: "REBUTTED",
    managerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerName: "Brian Blaze",
    auditorName: "Brian Blaze",
    isComplete: false,
    examinerId: 107,
    auditorId: 107,
    examinerComments: ["rebutted"],
    managerComments: ["rebutted"],
    isRebut: true,
    leadComments: "Pended",
    leadAttachmentOne: null,
    leadAttachmentTwo: null
  };
  const dataNew = {
    auditTaskId: 31,
    auditFlowId: 144,
    claimId: "20190403000184",
    claimType: "Institutional (OP)",
    claimStatus: "Final",
    receiptDate: "05/18/2020",
    claimsAge: 102,
    providerName: "Supplier_UST5",
    memberGroupName: "Medicare Advantage",
    billedAmount: 900,
    allowedAmount: 630,
    paidAmount: 630,
    processedDate: "05/18/2020 07:41",
    queueName: "hcc_super_user",
    errorType: "Procedural",
    financialImpact: null,
    auditorAmount: null,
    status: "Rebut",
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    isComplete: false,
    examinerId: 7,
    auditorId: 107,
    isRebut: true,
    currentLevel: 3,
    leadComments: "Pend",
    leadAttachmentOne: null,
    leadAttachmentTwo: null,
    auditorAttachmentsComments: {
      timestamp: "06/24/2020 01:38:27",
      comments: "Test Procedural Error",
      attachments: [
        {
          filePosition: "attachmentOne",
          fileId: 69,
          fileName: "20190403000184.docx"
        },
        {
          filePosition: "attachmentOne",
          fileId: 69,
          fileName: "20190403000184.docx"
        },
        {
          filePosition: "attachmentOne",
          fileId: 69,
          fileName: "20190403000184.docx"
        }
      ]
    },
    attachmentsCommentsForAllUsers: [
      {
        userName: "Deepa John",
        userRole: "Manager",
        rebuttalLevel: 3,
        timestamp: "08/06/2020 07:11:35",
        comments: "Review completed",
        attachments: null
      },
      {
        userName: "Brian Blaze",
        userRole: "Claims Auditor",
        rebuttalLevel: 2,
        timestamp: "06/29/2020 07:30:28",
        comments: "Procedural error still there",
        attachments: null
      },
      {
        userName: "Deepa John",
        userRole: "Manager",
        rebuttalLevel: 2,
        timestamp: "06/29/2020 07:29:27",
        comments: "Please verify",
        attachments: null
      },
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 2,
        timestamp: "06/29/2020 07:28:44",
        comments: "Please recheck,amount paid correctly",
        attachments: null
      },
      {
        userName: "Brian Blaze",
        userRole: "Claims Auditor",
        rebuttalLevel: 1,
        timestamp: "06/29/2020 07:27:58",
        comments: "Procedural error exists",
        attachments: null
      },
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 1,
        timestamp: "06/29/2020 07:26:52",
        comments: "Rebutting,please check",
        attachments: null
      },
      {
        userName: "Devika Kumari",
        userRole: "Claims Examiner",
        rebuttalLevel: 1,
        timestamp: "06/26/2020 08:41:22",
        comments: "Please check ",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 72,
            fileName: "Institutional(IP).xlsx"
          },
          {
            filePosition: "attachmentOne",
            fileId: 69,
            fileName: "20190403000184.docx"
          },
          {
            filePosition: "attachmentOne",
            fileId: 69,
            fileName: "20190403000184.docx"
          },
          {
            filePosition: "attachmentOne",
            fileId: 69,
            fileName: "20190403000184.docx"
          },
          {
            filePosition: "attachmentOne",
            fileId: 69,
            fileName: "20190403000184.docx"
          },
          {
            filePosition: "attachmentOne",
            fileId: 69,
            fileName: "20190403000184.docx"
          }
        ]
      }
    ]
  };

  res.status(200).json(dataNew);
});

app.get("/api/lead/review/:id", (req, res, next) => {
  const params = req.params;
  let data = {
    auditTaskId: 19,
    auditFlowId: 47,
    claimId: "20190603000765",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 19,
    providerName: "Test Supplier1",
    memberGroupName: "Test Account - 01",
    billedAmount: 2000,
    allowedAmount: 2000,
    paidAmount: 2000,
    processedDate: "05/17/2020 07:32",
    queueName: "hcc_super_user",
    errorType: null,
    financialImpact: null,
    currentLevel: 3,
    auditorAmount: null,
    auditorComments: ["Rebutted ", "Failed due to financial error"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 31,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 30,
          fileName: "frogs.jpg"
        }
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Audit - 06012020.xlsx"
        }
      }
    ],
    status: "ACCEPTED",
    managerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerName: "Brian Blaze",
    auditorName: "Brian Blaze",
    isComplete: true,
    examinerId: 107,
    auditorId: 107,
    examinerComments: ["rebutted"],
    managerComments: ["rebutted"],
    isRebut: false,
    leadComments: "Pended",
    leadAttachmentOne: null,
    leadAttachmentTwo: null,
    prevLeadAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 37,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 36,
          fileName: "frogs.jpg"
        }
      }
    ],
    prevLeadComments: ["Rebutted"]
  };
  if (params.id === "get-claim-review-list") {
    data = [
      {
        slNo: 0,
        auditFlowId: 36,
        claimId: "20190603000765",
        claimType: "Institutional-IP",
        claimStatus: "Final",
        receiptDate: "05/17/2020",
        claimByAge: 17,
        providerName: "Test Supplier1",
        groupName: "Test Account - 01",
        billedAmount: 2000,
        allowedAmount: 2000,
        totalPaidAmount: 2000,
        processedDate: null,
        queueName: "hcc_super_user",
        auditorName: null,
        auditDate: null,
        auditStatus: null,
        errorType: null,
        errorDescription: null,
        financialImpact: null,
        amount: null,
        auditFlowStatus: "ACCEPTED"
      }
    ];
  } else if (params.id === "get-claim-count-review") {
    data = 10;
  }
  res.status(200).json(data);
});

app.post("/api/lead/review/submit/pend", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.get("/api/manager/review/get-claim", (req, res, next) => {
  const data = {
    auditTaskId: 14,
    auditFlowId: 23,
    claimId: "20190722001261",
    claimType: "Institutional (OP)",
    claimStatus: "Denied",
    receiptDate: "05/17/2020",
    claimsAge: 22,
    providerName: "Test Supplier1",
    memberGroupName: "Greenville",
    billedAmount: 500,
    currentLevel: 3,
    allowedAmount: 0,
    paidAmount: 0,
    processedDate: "05/17/2020 07:15",
    queueName: "hcc_super_user",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: ["Financial error, please verify"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 31,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 30,
          fileName: "frogs.jpg"
        }
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Audit - 06012020.xlsx"
        }
      }
    ],
    status: "ACCEPT",
    examinerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    leadAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    examinerId: 7,
    auditorId: 107,
    examinerComments: ["Financial error, please verify"],
    leadComments: ["Failed"],
    managerComments: "Pended",
    managerAttachmentOne: null,
    managerAttachmentTwo: null,
    managerPreviousAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 19,
          fileName: "Test Audit Upload Details.docx"
        }
      }
    ],
    managerPreviousComments: ["Failed"],
    isComplete: false
  };
  const dataNew = {
    auditTaskId: 97,
    auditFlowId: 226,
    claimId: "20200403000002",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/19/2020",
    claimsAge: 101,
    providerName: "Supplier_UST5",
    memberGroupName: "Test_Individual OffEx",
    billedAmount: 6000,
    allowedAmount: 4200,
    paidAmount: 4200,
    processedDate: "05/19/2020 10:30",
    queueName: "hcc_super_user",
    errorType: "Both",
    financialImpact: "Over Paid",
    auditorAmount: 100,
    status: "Rebut",
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    isComplete: false,
    examinerId: 7,
    auditorId: 107,
    managerComments: "Pending",
    isRebut: true,
    managerAttachmentOne: null,
    managerAttachmentTwo: null,
    currentLevel: 3,
    auditorAttachmentsComments: {
      timestamp: "08/15/2020 10:26:53",
      comments: "Having both financial and procedural error.",
      attachments: [
        {
          filePosition: "attachmentOne",
          fileId: 162,
          fileName: "20200403000002.docx"
        }
      ]
    },
    attachmentsCommentsForAllUsers: [
      {
        userName: "Brian Blaze",
        userRole: "Claims Auditor",
        rebuttalLevel: 2,
        timestamp: "08/15/2020 11:31:34",
        comments: "Please recheck",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 169,
            fileName: "20200403000002.docx"
          }
        ]
      },
      {
        userName: "Deepa John",
        userRole: "Manager",
        rebuttalLevel: 2,
        timestamp: "08/15/2020 11:29:57",
        comments: "Please check",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 168,
            fileName: "20200403000002.docx"
          }
        ]
      },
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 2,
        timestamp: "08/15/2020 11:28:34",
        comments: "Please verify",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 167,
            fileName: "20200403000002.docx"
          }
        ]
      },
      {
        userName: "Brian Blaze",
        userRole: "Claims Auditor",
        rebuttalLevel: 1,
        timestamp: "08/15/2020 11:27:00",
        comments: "Please verify",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 166,
            fileName: "20200403000002.docx"
          }
        ]
      },
      {
        userName: "Deepa John",
        userRole: "Manager",
        rebuttalLevel: 1,
        timestamp: "08/15/2020 10:38:04",
        comments: "Please check.",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 165,
            fileName: "20200403000002.docx"
          }
        ]
      },
      {
        userName: "Manju Varghese",
        userRole: "Claims Lead",
        rebuttalLevel: 1,
        timestamp: "08/15/2020 10:36:15",
        comments: "Please verify.",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 164,
            fileName: "20200403000002.docx"
          }
        ]
      },
      {
        userName: "Devika Kumari",
        userRole: "Claims Examiner",
        rebuttalLevel: 1,
        timestamp: "08/15/2020 10:29:13",
        comments: "Please review",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 163,
            fileName: "20200403000002.docx"
          }
        ]
      }
    ]
  };
  res.status(200).json(dataNew);
});

app.post("/api/manager/review/submit/pend", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.post("/api/manager/review/rebut", (req, res, next) => {
  res.status(201).json("success");
});

app.post(
  "/api/file/management/upload/audit/flow/attachments",
  (req, res, next) => {
    const payload = { succes: "true" };
    res.status(200).json(payload);
  }
);

app.post("/api/audit/checklist/import", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.post("/api/user-management/user/import-users", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.post("/api/user-management/user/import-user-groups", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.post("/api/configuration/import-reasons", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.get("/api/lead/review/download/:file", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.get("/api/audit/auditor/review-rebut/claim", (req, res, next) => {
  const data = {
    auditFlowId: 42,
    auditTaskId: 18,
    claimId: "20190603000753",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 25,
    providerName: "Test Supplier1",
    memberGroupName: "Test Account - 01",
    billedAmount: 22000,
    allowedAmount: 22000,
    paidAmount: 21656,
    processedDate: "05/17/2020 03:41",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    status: "PASSED",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: "Financailly isse",
    reviewOrRebut: "Rebut",
    endTimer: null, // for pended/saved claims this will have value
    currentLevel: 3,
    resubmitAuditorComments: null, // for pended/saved claims this will have value
    auditorAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 20,
          fileName: "FileUpload1.docx"
        }
      }
    ],
    examinerAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 23,
          fileName: "FileUpload1.docx"
        }
      }
    ],
    leadAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 24,
          fileName: "Audit_Details.xlsx"
        }
      }
    ],
    managerAttachments: [],
    examinerComments: ["rebutting the claim"],
    leadComments: [null, "rebutted-lead", "Reviewed  the claim"],
    managerComments: [
      "rebutted-manager",
      "reviewed-manager",
      null,
      null,
      null,
      "reviewed-manager"
    ],
    auditorSavedAttachmentOne: {
      filePosition: "attachmentTwo",
      fileId: 21,
      fileName: "Audit_Details.xlsx"
    },
    auditorSavedAttachmentTwo: {
      filePosition: "attachmentOne",
      fileId: 22,
      fileName: "FileUpload1.docx"
    },
    auditorSavedAttachmentThree: null,
    prevAuditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 118,
          fileName: "Institutional_OP__Claim_Validation_Rules.docx"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 117,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        }
      },
      {
        attachmentThree: {
          filePosition: " attachmentThree ",
          fileId: 179,
          fileName: "Institutional_OP__Claim_Validation_Rules.docx"
        }
      },
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 149,
          fileName: "Institutional_OP__Claim_Validation_Rules.docx"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 148,
          fileName: "Institutional_IP__Claim_Validation_Rules.docx"
        }
      }
    ],
    prevAuditorComments: ["Rebuttal by auditor", "Test"],
    auditorAttachmentsComments: {
      timestamp: "06/16/2020 23:52",
      comments: "Over paid financially, please verify",
      attachments: [
        {
          filePosition: "attachmentOne",
          fileId: 42,
          fileName: "Professional_Claim_Validation_Rules.docx"
        }
      ],
      userRole: null,
      userName: null,
      rebuttalLevel: 0
    },
    attachmentsCommentsForAllUsers: [
      {
        timestamp: "06/17/2020 06:35",
        comments: "Reviewed,fine",
        attachments: null,
        userRole: "Manager",
        userName: "Deepa John",
        rebuttalLevel: 0
      },
      {
        timestamp: "06/17/2020 06:34",
        comments: "Please review",
        attachments: null,
        userRole: "Claims Lead",
        userName: "Manju Varghese",
        rebuttalLevel: 0
      },
      {
        timestamp: "06/17/2020 06:33",
        comments: "Corrected,please check",
        attachments: null,
        userRole: "Claims Examiner",
        userName: "Devika Kumari",
        rebuttalLevel: 0
      },
      {
        timestamp: "06/17/2020 06:32",
        comments: "Please accept and correct it",
        attachments: null,
        userRole: "Claims Lead",
        userName: "Manju Varghese",
        rebuttalLevel: 3
      },
      {
        timestamp: "06/17/2020 06:31",
        comments: "Please check the issue once again",
        attachments: null,
        userRole: "Manager",
        userName: "Deepa John",
        rebuttalLevel: 3
      },
      {
        timestamp: "06/17/2020 06:29",
        comments: "Financial errors still exists",
        attachments: null,
        userRole: "Claims Auditor",
        userName: "Brian Blaze",
        rebuttalLevel: 2
      },
      {
        timestamp: "06/17/2020 06:28",
        comments: "Verified the issue,please recheck",
        attachments: null,
        userRole: "Manager",
        userName: "Deepa John",
        rebuttalLevel: 2
      },
      {
        timestamp: "06/17/2020 06:28",
        comments: "Verified in HRP,please check",
        attachments: null,
        userRole: "Claims Lead",
        userName: "Manju Varghese",
        rebuttalLevel: 2
      },
      {
        timestamp: "06/17/2020 06:26",
        comments: "Rebutting to lead for checking",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 61,
            fileName: "Institutional(IP).xlsx"
          }
        ],
        userRole: "Claims Auditor",
        userName: "Brian Blaze",
        rebuttalLevel: 1
      },
      {
        timestamp: "06/17/2020 06:25",
        comments: "Verified,please check",
        attachments: null,
        userRole: "Claims Lead",
        userName: "Manju Varghese",
        rebuttalLevel: 1
      },
      {
        timestamp: "06/17/2020 06:24",
        comments: "No financial errors",
        attachments: [
          {
            filePosition: "attachmentOne",
            fileId: 60,
            fileName: "Institutional(IP).xlsx"
          }
        ],
        userRole: "Claims Examiner",
        userName: "Devika Kumari",
        rebuttalLevel: 1
      }
    ]
  };

  res.status(200).json(data);
});

app.post("/api/audit/auditor/review-rebut/complete", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.post("/api/audit/auditor/review-rebut/accept", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.post("/api/audit/auditor/review-rebut/resubmit", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.post("/api/audit/auditor/review-rebut/pend", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.get("/api/file/management/download/:file", (req, res, next) => {
  const payload = { succes: "true" };
  res.status(200).json(payload);
});

app.get("/api/configuration/review-roles", (req, res, next) => {
  res.status(200).json([
    {
      id: 4,
      roleName: "Claims Lead",
      isReviewWorkflowEnabled: true
    },
    {
      id: 6,
      roleName: "Manager",
      isReviewWorkflowEnabled: false
    },
    {
      id: 3,
      roleName: "Claims Auditor",
      isReviewWorkflowEnabled: true
    }
  ]);
});

app.get("/api/audit/home/dashboard/review/detail", (req, res, next) => {
  const payload = [
    {
      auditTaskId: 2,
      claimId: "TESTPROF001",
      claimType: "Professional",
      status: "Final",
      receiptDate: "04/19/2019",
      age: 395,
      providerName: "Do Not Use Doctors Care",
      memberGroupName: "Test Account - 01",
      billedAmount: 200,
      allowedAmount: 160,
      paidAmount: 160,
      claimQueueName: "hcc_super_user",
      processedDate: "05/13/2020 05:23",
      examinerName: "Manju Varghese",
      reviewRebutStatus: "Review",
      auditDate: null,
      errorType: "test",
      errorDesc: "financial",
      financialImpact: "test",
      amount: null
    },
    {
      auditTaskId: 4,
      claimId: "Inpatient77",
      claimType: "Institutional-IP",
      status: "Final",
      receiptDate: "05/14/2019",
      age: 370,
      providerName: "Mridula Test Provider",
      memberGroupName: "Carmel-Sub-1",
      billedAmount: 21000,
      allowedAmount: 12461.549999999999,
      paidAmount: 8906.5499999999993,
      claimQueueName: "hcc_super_user",
      processedDate: "05/13/2020 05:23",
      examinerName: "Manju Varghese",
      reviewRebutStatus: "Review",
      auditDate: null,
      errorType: "test",
      errorDesc: null,
      financialImpact: "test",
      amount: null
    }
  ];
  res.status(200).json(payload);
});

app.get("/api/audit/auditor/review-rebut/claim/:id", (req, res, next) => {
  const payload = {
    auditFlowId: 42,
    auditTaskId: 18,
    claimId: "20190603000753",
    claimType: "Institutional (IP)",
    claimStatus: "Final",
    receiptDate: "05/17/2020",
    claimsAge: 25,
    providerName: "Test Supplier1",
    memberGroupName: "Test Account - 01",
    billedAmount: 22000,
    allowedAmount: 22000,
    paidAmount: 21656,
    processedDate: "05/17/2020 03:41",
    queueName: "hcc_super_user",
    examinerName: "Devika Kumari",
    status: "PASSED",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: "Financailly isse",
    reviewOrRebut: "Accept",
    endTimer: null, // for pended/saved claims this will have value
    currentLevel: 2,
    resubmitAuditorComments: "Test", // for pended/saved claims this will have value
    examinerAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 23,
          fileName: "FileUpload1.docx"
        }
      }
    ],
    leadAttachments: null,
    managerAttachments: [],
    examinerComments: ["rebutting the claim"],
    leadComments: [null, "rebutted-lead", "Reviewed  the claim"],
    managerComments: [
      "rebutted-manager",
      "reviewed-manager",
      null,
      null,
      null,
      "reviewed-manager"
    ],
    auditorSavedAttachmentOne: {
      filePosition: "attachmentTwo",
      fileId: 21,
      fileName: "Audit_Details.xlsx"
    },
    auditorSavedAttachmentTwo: {
      filePosition: "attachmentOne",
      fileId: 22,
      fileName: "FileUpload1.docx"
    },
    auditorSavedAttachmentThree: null
  };
  res.status(200).json(payload);
});

let reassignmentReason = [
  {
    reassignmentReasonCode: 1,
    reassignmentReason: "Missing configuration",
    status: true
  }
];

app.get("/api/configuration/reassignment-reasons", (req, res, next) => {
  res.status(201).json({
    reassignmentReasonDtos: reassignmentReason
  });
});

app.post("/api/configuration/save-reassignment-reasons", (req, res, next) => {
  const body = req.body;
  const reasons = body.reassignmentReasonDtos || [];
  reasons.forEach(element => {
    if (element.status && !element.reassignmentReasonCode) {
      reassignmentReason.push({
        reassignmentReasonCode: reassignmentReason.length + 1,
        reassignmentReason: element.reassignmentReason,
        status: element.status
      });
    } else if (!element.status) {
      reassignmentReason = reassignmentReason.filter(
        e => e.reassignmentReasonCode !== element.reassignmentReasonCode
      );
    }
  });
  res.status(200).json("success");
});
module.exports = app;

app.get("/api/resource-dashboard/user-group", (req, res, next) => {
  res.status(201).json([
    {
      groupId: 1,
      groupName: "Group A"
    },
    {
      groupId: 2,
      groupName: "Group B"
    }
  ]);
});

app.get("/api/resource-dashboard/lead/user-group/:userId", (req, res, next) => {
  res.status(201).json([
    {
      groupId: 1,
      groupName: "Group ABC"
    },
    {
      groupId: 2,
      groupName: "Group DEF"
    }
  ]);
});

app.get("/api/audit-dashboard/user-group", (req, res, next) => {
  res.status(201).json([
    {
      examinerId: 3,
      examinerName: "Jim Tom"
    },
    {
      examinerId: 5,
      examinerName: "Manju Varghese"
    },
    {
      examinerId: 1,
      examinerName: "Devika Minikumari"
    },
    {
      examinerId: 4,
      examinerName: "Deepa John"
    },
    {
      examinerId: 8,
      examinerName: "Tino Jose"
    },
    {
      examinerId: 10,
      examinerName: "Krishna Kondaswamy"
    },
    {
      examinerId: 7,
      examinerName: "Brian Blaze"
    },
    {
      examinerId: 6,
      examinerName: "Megha Muraleedharan"
    },
    {
      examinerId: 11,
      examinerName: "Dhanya Saraswathy"
    },
    {
      examinerId: 12,
      examinerName: "Manu Manoharan"
    }
  ]);
});

app.get("/api/resource-dashboard/manager/examiners", (req, res, next) => {
  res.status(201).json([
    {
      examinerId: 3,
      examinerName: "Jim Tom"
    },
    {
      examinerId: 5,
      examinerName: "Manju Varghese"
    },
    {
      examinerId: 1,
      examinerName: "Devika Minikumari"
    },
    {
      examinerId: 4,
      examinerName: "Deepa John"
    },
    {
      examinerId: 8,
      examinerName: "Tino Jose"
    },
    {
      examinerId: 10,
      examinerName: "Krishna Kondaswamy"
    },
    {
      examinerId: 7,
      examinerName: "Brian Blaze"
    },
    {
      examinerId: 6,
      examinerName: "Megha Muraleedharan"
    },
    {
      examinerId: 11,
      examinerName: "Dhanya Saraswathy"
    },
    {
      examinerId: 12,
      examinerName: "Manu Manoharan"
    }
  ]);
});
app.get("/api/reports/reassigned-by-names", (req, res, next) => {
  res.status(201).json([
    {
      value: 3,
      label: "Deepa John"
    },
    {
      value: 12,
      label: "Dhanya Saraswathi"
    }
  ]);
});

app.get("/api/resource-dashboard/lead/examiners", (req, res, next) => {
  res.status(201).json([
    {
      examinerId: 3,
      examinerName: "Jim Tom"
    },
    {
      examinerId: 5,
      examinerName: "Manju Varghese"
    },
    {
      examinerId: 1,
      examinerName: "Devika Minikumari"
    },
    {
      examinerId: 4,
      examinerName: "Deepa John"
    },
    {
      examinerId: 8,
      examinerName: "Tino Jose"
    },
    {
      examinerId: 10,
      examinerName: "Krishna Kondaswamy"
    },
    {
      examinerId: 7,
      examinerName: "Brian Blaze"
    },
    {
      examinerId: 6,
      examinerName: "Megha Muraleedharan"
    },
    {
      examinerId: 11,
      examinerName: "Dhanya Saraswathy"
    },
    {
      examinerId: 12,
      examinerName: "Manu Manoharan"
    }
  ]);
});

app.get("/api/audit-dashboard/examiners", (req, res, next) => {
  res.status(201).json([
    {
      examinerId: 1,
      examinerName: "Jim Tom"
    },
    {
      examinerId: 2,
      examinerName: "Manju Varghese"
    },
    {
      examinerId: 3,
      examinerName: "Devika Minikumari"
    },
    {
      examinerId: 4,
      examinerName: "Deepa John"
    },
    {
      examinerId: 5,
      examinerName: "Tino Jose"
    },
    {
      examinerId: 6,
      examinerName: "Krishna Kondaswamy"
    },
    {
      examinerId: 7,
      examinerName: "Brian Blaze"
    },
    {
      examinerId: 8,
      examinerName: "Megha Muraleedharan"
    },
    {
      examinerId: 9,
      examinerName: "Dhanya Saraswathy"
    },
    {
      examinerId: 10,
      examinerName: "Manu Manoharan"
    }
  ]);
});

app.post(
  "/api/resource-dashboard/manager/financial-score",
  (req, res, next) => {
    res.status(201).json({
      name: "Avg Procedural Score",
      financialScoreManagerDtos: [
        {
          monthStartDate: "2020-05-01",
          financialAccuracy: 97.53,
          target: 99.0
        },
        {
          monthStartDate: "2020-06-01",
          financialAccuracy: 96.89,
          target: 98.0
        },
        {
          monthStartDate: "2020-07-01",
          financialAccuracy: 99.92,
          target: 98.0
        }
      ]
    });
  }
);

app.post("/api/audit-dashboard/financial-score", (req, res, next) => {
  res.status(201).json({
    name: "Avg Financial Score",
    financialScoreAuditorDtos: [
      {
        monthStartDate: "2020-05-01",
        financialAccuracy: 97.53,
        target: 99.0
      },
      {
        monthStartDate: "2020-06-01",
        financialAccuracy: 96.89,
        target: 99.0
      }
    ]
  });
});

app.get(
  "/api/audit/home/dashboard/audited-backlog-claims",
  (req, res, next) => {
    res.status(200).json({
      auditedAndBacklogDtos: [
        {
          startDate: "2020-05-18",
          endDate: "2020-05-23",
          completedAuditCount: 6,
          backlogAuditCount: 0
        },
        {
          startDate: "2020-06-15",
          endDate: "2020-06-20",
          completedAuditCount: 10,
          backlogAuditCount: 7
        },
        {
          startDate: "2020-06-22",
          endDate: "2020-06-27",
          completedAuditCount: 6,
          backlogAuditCount: 10
        },
        {
          startDate: "2020-06-29",
          endDate: "2020-06-30",
          completedAuditCount: 2,
          backlogAuditCount: 0
        }
      ]
    });
    //   res.status(404).json({
    //     timestamp: "2019-12-31T06:34:32.758+0000",
    //     status: 404,
    //     error: "",
    //     message: "No Data Found!",
    //     path: "/api/resource-dashboard/claims-audited-per-user"
    // });
  }
);

app.post("/api/resource-dashboard/lead/financial-score", (req, res, next) => {
  res.status(201).json({
    name: "Avg Procedural Score",
    financialScoreLeadDtos: [
      {
        monthStartDate: "2020-05-01",
        financialAccuracy: 97.53,
        target: 99.0
      },
      {
        monthStartDate: "2020-06-01",
        financialAccuracy: 96.89,
        target: 98.0
      },
      {
        monthStartDate: "2020-07-01",
        financialAccuracy: 99.92,
        target: 98.0
      }
    ]
  });
});

app.post("/api/resource-dashboard/user-group/examiners", (req, res, next) => {
  res.status(201).json([
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
  ]);
});
app.post("/api/audit/dashboard/auditor/assigned/claims", (req, res, next) => {
  res.status(200).json([
    {
      auditorName: "Brian Blaze",
      assignedClaimsCount: 13,
      passedAuditCount: 16,
      failedAuditCount: 9,
      auditorId: 107
    },
    {
      auditorName: "Dory Wilson",
      assignedClaimsCount: 0,
      passedAuditCount: 0,
      failedAuditCount: 0,
      auditorId: 108
    }
  ]);
});

app.post("/api/resource-dashboard/lead/procedural-score", (req, res, next) => {
  res.status(201).json({
    name: "Devika Kumari",
    proceduralScoreLeadDtos: [
      {
        monthStartDate: "2020-05-01",
        proceduralAccuracy: 100.0,
        target: 98.0
      },
      {
        monthStartDate: "2020-06-01",
        proceduralAccuracy: 100.0,
        target: 94.0
      },
      {
        monthStartDate: "2020-07-01",
        proceduralAccuracy: 78.0,
        target: 94.0
      }
    ]
  });
});

app.post("/api/audit-dashboard/procedural-score", (req, res, next) => {
  res.status(201).json({
    name: "Devika Kumari",
    proceduralScoreAuditorTeamDtos: [
      {
        monthStartDate: "2020-05-01",
        proceduralAccuracy: 100.0,
        target: 98.0
      },
      {
        monthStartDate: "2020-06-01",
        proceduralAccuracy: 100.0,
        target: 94.0
      },
      {
        monthStartDate: "2020-07-01",
        proceduralAccuracy: 78.0,
        target: 94.0
      }
    ]
  });
});

app.post(
  "/api/resource-dashboard/manager/procedural-score",
  (req, res, next) => {
    res.status(201).json({
      name: "Devika Kumari",
      proceduralScoreManagerDtos: [
        {
          monthStartDate: "2020-05-01",
          proceduralAccuracy: 100.0,
          target: 98.0
        },
        {
          monthStartDate: "2020-06-01",
          proceduralAccuracy: 100.0,
          target: 94.0
        },
        {
          monthStartDate: "2020-07-01",
          proceduralAccuracy: 78.0,
          target: 94.0
        }
      ]
    });
  }
);

app.post("/api/deletion/deleted-by-names", (req, res, next) => {
  const payload = [
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
  res.status(200).json(payload);
});

app.get("/api/deletion/deleted-by-roles", (req, res, next) => {
  const payload = [
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
  res.status(200).json(payload);
});

app.get("/api/lead/review/get-claim-review-list", (req, res, next) => {
  const payload = [
    {
      slNo: 0,
      auditFlowId: 98,
      claimId: "20190403000184",
      claimType: "Institutional (OP)",
      claimStatus: "Final",
      receiptDate: "05/18/2020",
      claimByAge: 58,
      providerName: "Supplier_UST5",
      groupName: "Medicare Advantage",
      billedAmount: 900,
      allowedAmount: 630,
      totalPaidAmount: 630,
      processedDate: "06/24/2020 05:38",
      queueName: "hcc_super_user",
      auditorName: null,
      auditDate: null,
      auditStatus: "PENDED",
      errorType: null,
      errorDescription: null,
      financialImpact: null,
      amount: null,
      auditFlowStatus: "Pended"
    }
  ];
  res.status(200).json(payload);
});
app.post(
  "/api/audit/dashboard/auditor/assigned/claims/grid",
  (req, res, next) => {
    const payload = [
      {
        claimId: "20190681000122",
        auditStatus: "Passed",
        auditorName: "BrianBlaze",
        examinerName: null,
        auditDate: "09/08/2020",
        claimType: "Institutional-OP",
        claimStatus: "Denied",
        billedAmount: 900,
        allowedAmount: 0,
        paidAmount: 0,
        processedDate: "11/21/2019",
        errorType: null,
        financialImpact: null,
        amount: null,
        claimAge: null,
        assignedDate: null
      }
    ];
    res.status(200).json(payload);
  }
);

app.post("/api/audit-dashboard/low-performing-examiners", (req, res, next) => {
  res.status(200).json({
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
  });
});

app.get("/api/audit/home/dashboard/complete/detail", (req, res, next) => {
  res.status(200).json([
    {
      taskId: 17,
      claimId: "20190828000004",
      assignmentType: "",
      claimType: "Professional",
      status: "Denied",
      receiptDate: "05/17/2020",
      age: 57,
      billedAmount: 180,
      allowedAmount: 0,
      paidAmount: 0,
      processedDate: "05/17/2020 03:41",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      auditDate: "07/13/2020 18:23",
      auditStatus: "FAILED",
      errorType: "Financial",
      errorDesc: "Audit failed financially",
      financialImpact: "Under Paid",
      amount: 20
    },
    {
      taskId: 43,
      claimId: "20200506000002",
      assignmentType: "",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 55,
      billedAmount: 9150,
      allowedAmount: 6862.5,
      paidAmount: 0,
      processedDate: "05/19/2020 07:07",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      auditDate: "07/13/2020 18:23",
      auditStatus: "PASSED",
      errorType: null,
      errorDesc: "",
      financialImpact: null,
      amount: null
    }
  ]);
});

app.get("/api/audit/home/dashboard/success/detail", (req, res, next) => {
  res.status(200).json([
    {
      taskId: 43,
      claimId: "20200506000002",
      assignmentType: "Auto",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 55,
      billedAmount: 9150,
      allowedAmount: 6862.5,
      paidAmount: 0,
      processedDate: "05/19/2020 07:07",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      auditDate: "07/13/2020 18:23"
    }
  ]);
});

app.get("/api/audit/home/dashboard/failed/detail", (req, res, next) => {
  res.status(200).json([
    {
      taskId: 17,
      claimId: "20190828000004",
      assignmentType: "Manual",
      claimType: "Professional",
      status: "Denied",
      receiptDate: "05/17/2020",
      age: 57,
      billedAmount: 180,
      allowedAmount: 0,
      paidAmount: 0,
      processedDate: "05/17/2020 03:41",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      auditDate: "07/13/2020 18:23",
      errorType: "Financial",
      errorDesc: "Audit failed financially",
      financialImpact: "Under Paid",
      amount: 20
    }
  ]);
});

app.get("/api/claims-audit/routed-in-claim-details", (req, res, next) => {
  res.status(200).json([
    {
      auditTaskId: 55,
      claimId: "20190101000011",
      routeType: "AUDITOR",
      claimType: "Institutional-OP",
      claimStatus: "Final",
      receiptDate: "05/16/2020",
      claimsAge: 62,
      processedDate: "05/18/2020",
      queueName: "hcc_super_user",
      fullName: "Brian Blaze",
      routeReason: "Pending Claim"
    },
    {
      auditTaskId: 56,
      claimId: "20190827000005",
      routeType: "REASSIGNED",
      claimType: "Professional",
      claimStatus: "Final",
      receiptDate: "05/18/2020",
      claimsAge: 60,
      processedDate: "03/04/2020",
      queueName: "hcc_super_user",
      fullName: "Brian Blaze",
      routeReason: "Incorrect Assignment"
    }
  ]);
});
app.post(
  "/api/audit/dashboard/auditor/assigned/claims/report",
  (req, res, next) => {
    res.status(200).json("success");
  }
);

app.get("/api/audit/manual/diagnosis/search", (req, res, ne) => {
  res.status(200).json(
    [
      {
        description:
          "Afghanistan Afghanistan AfghanistanAfghanistan AfghanistanAfghanistanAfghanistan AfghanistanAfghanistanAfghanistan",
        code: "AF"
      },
      { description: "Åland Islands", code: "AX" },
      { description: "Albania", code: "AL" },
      { description: "Algeria", code: "DZ" },
      { description: "American Samoa", code: "AS" },
      { description: "Andorra", code: "AD" },
      { description: "Angola", code: "AO" },
      { description: "Anguilla", code: "AI" },
      { description: "Antarctica", code: "AQ" },
      { description: "Antigua and Barbuda", code: "AG" },
      { description: "Argentina", code: "AR" },
      { description: "Armenia", code: "AM" },
      { description: "Aruba", code: "AW" },
      { description: "Australia", code: "AU" },
      { description: "Austria", code: "AT" },
      { description: "Azerbaijan", code: "AZ" },
      { description: "Bahamas", code: "BS" },
      { description: "Bahrain", code: "BH" },
      { description: "Bangladesh", code: "BD" },
      { description: "Barbados", code: "BB" },
      { description: "Belarus", code: "BY" },
      { description: "Belgium", code: "BE" },
      { description: "Belize", code: "BZ" },
      { description: "Benin", code: "BJ" },
      { description: "Bermuda", code: "BM" },
      { description: "Bhutan", code: "BT" },
      { description: "Bolivia", code: "BO" },
      { description: "Bosnia and Herzegovina", code: "BA" },
      { description: "Botswana", code: "BW" },
      { description: "Bouvet Island", code: "BV" },
      { description: "Brazil", code: "BR" },
      { description: "British Indian Ocean Territory", code: "IO" },
      { description: "Brunei Darussalam", code: "BN" },
      { description: "Bulgaria", code: "BG" },
      { description: "Burkina Faso", code: "BF" },
      { description: "Burundi", code: "BI" },
      { description: "Cambodia", code: "KH" },
      { description: "Cameroon", code: "CM" },
      { description: "Canada", code: "CA" },
      { description: "Cape Verde", code: "CV" },
      { description: "Cayman Islands", code: "KY" },
      { description: "Central African Republic", code: "CF" },
      { description: "Chad", code: "TD" },
      { description: "Chile", code: "CL" },
      { description: "China", code: "CN" },
      { description: "Christmas Island", code: "CX" },
      { description: "Cocos (Keeling) Islands", code: "CC" },
      { description: "Colombia", code: "CO" },
      { description: "Comoros", code: "KM" },
      { description: "Congo", code: "CG" },
      { description: "Congo, The Democratic Republic of the", code: "CD" },
      { description: "Cook Islands", code: "CK" },
      { description: "Costa Rica", code: "CR" },
      { description: 'Cote D"Ivoire', code: "CI" },
      { description: "Croatia", code: "HR" },
      { description: "Cuba", code: "CU" },
      { description: "Cyprus", code: "CY" },
      { description: "Czech Republic", code: "CZ" },
      { description: "Denmark", code: "DK" },
      { description: "Djibouti", code: "DJ" },
      { description: "Dominica", code: "DM" },
      { description: "Dominican Republic", code: "DO" },
      { description: "Ecuador", code: "EC" },
      { description: "Egypt", code: "EG" },
      { description: "El Salvador", code: "SV" },
      { description: "Equatorial Guinea", code: "GQ" },
      { description: "Eritrea", code: "ER" },
      { description: "Estonia", code: "EE" },
      { description: "Ethiopia", code: "ET" },
      { description: "Falkland Islands (Malvinas)", code: "FK" },
      { description: "Faroe Islands", code: "FO" },
      { description: "Fiji", code: "FJ" },
      { description: "Finland", code: "FI" },
      { description: "France", code: "FR" },
      { description: "French Guiana", code: "GF" },
      { description: "French Polynesia", code: "PF" },
      { description: "French Southern Territories", code: "TF" },
      { description: "Gabon", code: "GA" },
      { description: "Gambia", code: "GM" },
      { description: "Georgia", code: "GE" },
      { description: "Germany", code: "DE" },
      { description: "Ghana", code: "GH" },
      { description: "Gibraltar", code: "GI" },
      { description: "Greece", code: "GR" },
      { description: "Greenland", code: "GL" },
      { description: "Grenada", code: "GD" },
      { description: "Guadeloupe", code: "GP" },
      { description: "Guam", code: "GU" },
      { description: "Guatemala", code: "GT" },
      { description: "Guernsey", code: "GG" },
      { description: "Guinea", code: "GN" },
      { description: "Guinea-Bissau", code: "GW" },
      { description: "Guyana", code: "GY" },
      { description: "Haiti", code: "HT" },
      { description: "Heard Island and Mcdonald Islands", code: "HM" },
      { description: "Holy See (Vatican City State)", code: "VA" },
      { description: "Honduras", code: "HN" },
      { description: "Hong Kong", code: "HK" },
      { description: "Hungary", code: "HU" },
      { description: "Iceland", code: "IS" },
      { description: "India", code: "IN" },
      { description: "Indonesia", code: "ID" },
      { description: "Iran, Islamic Republic Of", code: "IR" },
      { description: "Iraq", code: "IQ" },
      { description: "Ireland", code: "IE" },
      { description: "Isle of Man", code: "IM" },
      { description: "Israel", code: "IL" },
      { description: "Italy", code: "IT" },
      { description: "Jamaica", code: "JM" },
      { description: "Japan", code: "JP" },
      { description: "Jersey", code: "JE" },
      { description: "Jordan", code: "JO" },
      { description: "Kazakhstan", code: "KZ" },
      { description: "Kenya", code: "KE" },
      { description: "Kiribati", code: "KI" },
      { description: 'Korea, Democratic People"S Republic of', code: "KP" },
      { description: "Korea, Republic of", code: "KR" },
      { description: "Kuwait", code: "KW" },
      { description: "Kyrgyzstan", code: "KG" },
      { description: 'Lao People"S Democratic Republic', code: "LA" },
      { description: "Latvia", code: "LV" },
      { description: "Lebanon", code: "LB" },
      { description: "Lesotho", code: "LS" },
      { description: "Liberia", code: "LR" },
      { description: "Libyan Arab Jamahiriya", code: "LY" },
      { description: "Liechtenstein", code: "LI" },
      { description: "Lithuania", code: "LT" },
      { description: "Luxembourg", code: "LU" },
      { description: "Macao", code: "MO" },
      { description: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
      { description: "Madagascar", code: "MG" },
      { description: "Malawi", code: "MW" },
      { description: "Malaysia", code: "MY" },
      { description: "Maldives", code: "MV" },
      { description: "Mali", code: "ML" },
      { description: "Malta", code: "MT" },
      { description: "Marshall Islands", code: "MH" },
      { description: "Martinique", code: "MQ" },
      { description: "Mauritania", code: "MR" },
      { description: "Mauritius", code: "MU" },
      { description: "Mayotte", code: "YT" },
      { description: "Mexico", code: "MX" },
      { description: "Micronesia, Federated States of", code: "FM" },
      { description: "Moldova, Republic of", code: "MD" },
      { description: "Monaco", code: "MC" },
      { description: "Mongolia", code: "MN" },
      { description: "Montserrat", code: "MS" },
      { description: "Morocco", code: "MA" },
      { description: "Mozambique", code: "MZ" },
      { description: "Myanmar", code: "MM" },
      { description: "Namibia", code: "NA" },
      { description: "Nauru", code: "NR" },
      { description: "Nepal", code: "NP" },
      { description: "Netherlands", code: "NL" },
      { description: "Netherlands Antilles", code: "AN" },
      { description: "New Caledonia", code: "NC" },
      { description: "New Zealand", code: "NZ" },
      { description: "Nicaragua", code: "NI" },
      { description: "Niger", code: "NE" },
      { description: "Nigeria", code: "NG" },
      { description: "Niue", code: "NU" },
      { description: "Norfolk Island", code: "NF" },
      { description: "Northern Mariana Islands", code: "MP" },
      { description: "Norway", code: "NO" },
      { description: "Oman", code: "OM" },
      { description: "Pakistan", code: "PK" },
      { description: "Palau", code: "PW" },
      { description: "Palestinian Territory, Occupied", code: "PS" },
      { description: "Panama", code: "PA" },
      { description: "Papua New Guinea", code: "PG" },
      { description: "Paraguay", code: "PY" },
      { description: "Peru", code: "PE" },
      { description: "Philippines", code: "PH" },
      { description: "Pitcairn", code: "PN" },
      { description: "Poland", code: "PL" },
      { description: "Portugal", code: "PT" },
      { description: "Puerto Rico", code: "PR" },
      { description: "Qatar", code: "QA" },
      { description: "Reunion", code: "RE" },
      { description: "Romania", code: "RO" },
      { description: "Russian Federation", code: "RU" },
      { description: "RWANDA", code: "RW" },
      { description: "Saint Helena", code: "SH" },
      { description: "Saint Kitts and Nevis", code: "KN" },
      { description: "Saint Lucia", code: "LC" },
      { description: "Saint Pierre and Miquelon", code: "PM" },
      { description: "Saint Vincent and the Grenadines", code: "VC" },
      { description: "Samoa", code: "WS" },
      { description: "San Marino", code: "SM" },
      { description: "Sao Tome and Principe", code: "ST" },
      { description: "Saudi Arabia", code: "SA" },
      { description: "Senegal", code: "SN" },
      { description: "Serbia and Montenegro", code: "CS" },
      { description: "Seychelles", code: "SC" },
      { description: "Sierra Leone", code: "SL" },
      { description: "Singapore", code: "SG" },
      { description: "Slovakia", code: "SK" },
      { description: "Slovenia", code: "SI" },
      { description: "Solomon Islands", code: "SB" },
      { description: "Somalia", code: "SO" },
      { description: "South Africa", code: "ZA" },
      {
        description: "South Georgia and the South Sandwich Islands",
        code: "GS"
      },
      { description: "Spain", code: "ES" },
      { description: "Sri Lanka", code: "LK" },
      { description: "Sudan", code: "SD" },
      { description: "Suriname", code: "SR" },
      { description: "Svalbard and Jan Mayen", code: "SJ" },
      { description: "Swaziland", code: "SZ" },
      { description: "Sweden", code: "SE" },
      { description: "Switzerland", code: "CH" },
      { description: "Syrian Arab Republic", code: "SY" },
      { description: "Taiwan, Republic of China", code: "TW" },
      { description: "Tajikistan", code: "TJ" },
      { description: "Tanzania, United Republic of", code: "TZ" },
      { description: "Thailand", code: "TH" },
      { description: "Timor-Leste", code: "TL" },
      { description: "Togo", code: "TG" },
      { description: "Tokelau", code: "TK" },
      { description: "Tonga", code: "TO" },
      { description: "Trinidad and Tobago", code: "TT" },
      { description: "Tunisia", code: "TN" },
      { description: "Turkey", code: "TR" },
      { description: "Turkmenistan", code: "TM" },
      { description: "Turks and Caicos Islands", code: "TC" },
      { description: "Tuvalu", code: "TV" },
      { description: "Uganda", code: "UG" },
      { description: "Ukraine", code: "UA" },
      { description: "United Arab Emirates", code: "AE" },
      { description: "United Kingdom", code: "GB" },
      { description: "United States", code: "US" },
      { description: "United States Minor Outlying Islands", code: "UM" },
      { description: "Uruguay", code: "UY" },
      { description: "Uzbekistan", code: "UZ" },
      { description: "Vanuatu", code: "VU" },
      { description: "Venezuela", code: "VE" },
      { description: "Viet Nam", code: "VN" },
      { description: "Virgin Islands, British", code: "VG" },
      { description: "Virgin Islands, U.S.", code: "VI" },
      { description: "Wallis and Futuna", code: "WF" },
      { description: "Western Sahara", code: "EH" },
      { description: "Yemen", code: "YE" },
      { description: "Zambia", code: "ZM" },
      { description: "Zimbabwe", code: "ZW" }
    ].filter(el => {
      return (
        el.description.toLowerCase().indexOf(req.query.code.toLowerCase()) >
          -1 || el.code.toLowerCase().indexOf(req.query.code.toLowerCase()) > -1
      );
    })
  );
});
app.get("/api/audit/manual/procedure/search", (req, res, ne) => {
  res.status(200).json(
    [
      {
        description:
          "Afghanistan Afghanistan AfghanistanAfghanistan AfghanistanAfghanistanAfghanistan AfghanistanAfghanistanAfghanistan",
        code: "AF"
      },
      { description: "Åland Islands", code: "AX" },
      { description: "Albania", code: "AL" },
      { description: "Algeria", code: "DZ" },
      { description: "American Samoa", code: "AS" },
      { description: "Andorra", code: "AD" },
      { description: "Angola", code: "AO" },
      { description: "Anguilla", code: "AI" },
      { description: "Antarctica", code: "AQ" },
      { description: "Antigua and Barbuda", code: "AG" },
      { description: "Argentina", code: "AR" },
      { description: "Armenia", code: "AM" },
      { description: "Aruba", code: "AW" },
      { description: "Australia", code: "AU" },
      { description: "Austria", code: "AT" },
      { description: "Azerbaijan", code: "AZ" },
      { description: "Bahamas", code: "BS" },
      { description: "Bahrain", code: "BH" },
      { description: "Bangladesh", code: "BD" },
      { description: "Barbados", code: "BB" },
      { description: "Belarus", code: "BY" },
      { description: "Belgium", code: "BE" },
      { description: "Belize", code: "BZ" },
      { description: "Benin", code: "BJ" },
      { description: "Bermuda", code: "BM" },
      { description: "Bhutan", code: "BT" },
      { description: "Bolivia", code: "BO" },
      { description: "Bosnia and Herzegovina", code: "BA" },
      { description: "Botswana", code: "BW" },
      { description: "Bouvet Island", code: "BV" },
      { description: "Brazil", code: "BR" },
      { description: "British Indian Ocean Territory", code: "IO" },
      { description: "Brunei Darussalam", code: "BN" },
      { description: "Bulgaria", code: "BG" },
      { description: "Burkina Faso", code: "BF" },
      { description: "Burundi", code: "BI" },
      { description: "Cambodia", code: "KH" },
      { description: "Cameroon", code: "CM" },
      { description: "Canada", code: "CA" },
      { description: "Cape Verde", code: "CV" },
      { description: "Cayman Islands", code: "KY" },
      { description: "Central African Republic", code: "CF" },
      { description: "Chad", code: "TD" },
      { description: "Chile", code: "CL" },
      { description: "China", code: "CN" },
      { description: "Christmas Island", code: "CX" },
      { description: "Cocos (Keeling) Islands", code: "CC" },
      { description: "Colombia", code: "CO" },
      { description: "Comoros", code: "KM" },
      { description: "Congo", code: "CG" },
      { description: "Congo, The Democratic Republic of the", code: "CD" },
      { description: "Cook Islands", code: "CK" },
      { description: "Costa Rica", code: "CR" },
      { description: 'Cote D"Ivoire', code: "CI" },
      { description: "Croatia", code: "HR" },
      { description: "Cuba", code: "CU" },
      { description: "Cyprus", code: "CY" },
      { description: "Czech Republic", code: "CZ" },
      { description: "Denmark", code: "DK" },
      { description: "Djibouti", code: "DJ" },
      { description: "Dominica", code: "DM" },
      { description: "Dominican Republic", code: "DO" },
      { description: "Ecuador", code: "EC" },
      { description: "Egypt", code: "EG" },
      { description: "El Salvador", code: "SV" },
      { description: "Equatorial Guinea", code: "GQ" },
      { description: "Eritrea", code: "ER" },
      { description: "Estonia", code: "EE" },
      { description: "Ethiopia", code: "ET" },
      { description: "Falkland Islands (Malvinas)", code: "FK" },
      { description: "Faroe Islands", code: "FO" },
      { description: "Fiji", code: "FJ" },
      { description: "Finland", code: "FI" },
      { description: "France", code: "FR" },
      { description: "French Guiana", code: "GF" },
      { description: "French Polynesia", code: "PF" },
      { description: "French Southern Territories", code: "TF" },
      { description: "Gabon", code: "GA" },
      { description: "Gambia", code: "GM" },
      { description: "Georgia", code: "GE" },
      { description: "Germany", code: "DE" },
      { description: "Ghana", code: "GH" },
      { description: "Gibraltar", code: "GI" },
      { description: "Greece", code: "GR" },
      { description: "Greenland", code: "GL" },
      { description: "Grenada", code: "GD" },
      { description: "Guadeloupe", code: "GP" },
      { description: "Guam", code: "GU" },
      { description: "Guatemala", code: "GT" },
      { description: "Guernsey", code: "GG" },
      { description: "Guinea", code: "GN" },
      { description: "Guinea-Bissau", code: "GW" },
      { description: "Guyana", code: "GY" },
      { description: "Haiti", code: "HT" },
      { description: "Heard Island and Mcdonald Islands", code: "HM" },
      { description: "Holy See (Vatican City State)", code: "VA" },
      { description: "Honduras", code: "HN" },
      { description: "Hong Kong", code: "HK" },
      { description: "Hungary", code: "HU" },
      { description: "Iceland", code: "IS" },
      { description: "India", code: "IN" },
      { description: "Indonesia", code: "ID" },
      { description: "Iran, Islamic Republic Of", code: "IR" },
      { description: "Iraq", code: "IQ" },
      { description: "Ireland", code: "IE" },
      { description: "Isle of Man", code: "IM" },
      { description: "Israel", code: "IL" },
      { description: "Italy", code: "IT" },
      { description: "Jamaica", code: "JM" },
      { description: "Japan", code: "JP" },
      { description: "Jersey", code: "JE" },
      { description: "Jordan", code: "JO" },
      { description: "Kazakhstan", code: "KZ" },
      { description: "Kenya", code: "KE" },
      { description: "Kiribati", code: "KI" },
      { description: 'Korea, Democratic People"S Republic of', code: "KP" },
      { description: "Korea, Republic of", code: "KR" },
      { description: "Kuwait", code: "KW" },
      { description: "Kyrgyzstan", code: "KG" },
      { description: 'Lao People"S Democratic Republic', code: "LA" },
      { description: "Latvia", code: "LV" },
      { description: "Lebanon", code: "LB" },
      { description: "Lesotho", code: "LS" },
      { description: "Liberia", code: "LR" },
      { description: "Libyan Arab Jamahiriya", code: "LY" },
      { description: "Liechtenstein", code: "LI" },
      { description: "Lithuania", code: "LT" },
      { description: "Luxembourg", code: "LU" },
      { description: "Macao", code: "MO" },
      { description: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
      { description: "Madagascar", code: "MG" },
      { description: "Malawi", code: "MW" },
      { description: "Malaysia", code: "MY" },
      { description: "Maldives", code: "MV" },
      { description: "Mali", code: "ML" },
      { description: "Malta", code: "MT" },
      { description: "Marshall Islands", code: "MH" },
      { description: "Martinique", code: "MQ" },
      { description: "Mauritania", code: "MR" },
      { description: "Mauritius", code: "MU" },
      { description: "Mayotte", code: "YT" },
      { description: "Mexico", code: "MX" },
      { description: "Micronesia, Federated States of", code: "FM" },
      { description: "Moldova, Republic of", code: "MD" },
      { description: "Monaco", code: "MC" },
      { description: "Mongolia", code: "MN" },
      { description: "Montserrat", code: "MS" },
      { description: "Morocco", code: "MA" },
      { description: "Mozambique", code: "MZ" },
      { description: "Myanmar", code: "MM" },
      { description: "Namibia", code: "NA" },
      { description: "Nauru", code: "NR" },
      { description: "Nepal", code: "NP" },
      { description: "Netherlands", code: "NL" },
      { description: "Netherlands Antilles", code: "AN" },
      { description: "New Caledonia", code: "NC" },
      { description: "New Zealand", code: "NZ" },
      { description: "Nicaragua", code: "NI" },
      { description: "Niger", code: "NE" },
      { description: "Nigeria", code: "NG" },
      { description: "Niue", code: "NU" },
      { description: "Norfolk Island", code: "NF" },
      { description: "Northern Mariana Islands", code: "MP" },
      { description: "Norway", code: "NO" },
      { description: "Oman", code: "OM" },
      { description: "Pakistan", code: "PK" },
      { description: "Palau", code: "PW" },
      { description: "Palestinian Territory, Occupied", code: "PS" },
      { description: "Panama", code: "PA" },
      { description: "Papua New Guinea", code: "PG" },
      { description: "Paraguay", code: "PY" },
      { description: "Peru", code: "PE" },
      { description: "Philippines", code: "PH" },
      { description: "Pitcairn", code: "PN" },
      { description: "Poland", code: "PL" },
      { description: "Portugal", code: "PT" },
      { description: "Puerto Rico", code: "PR" },
      { description: "Qatar", code: "QA" },
      { description: "Reunion", code: "RE" },
      { description: "Romania", code: "RO" },
      { description: "Russian Federation", code: "RU" },
      { description: "RWANDA", code: "RW" },
      { description: "Saint Helena", code: "SH" },
      { description: "Saint Kitts and Nevis", code: "KN" },
      { description: "Saint Lucia", code: "LC" },
      { description: "Saint Pierre and Miquelon", code: "PM" },
      { description: "Saint Vincent and the Grenadines", code: "VC" },
      { description: "Samoa", code: "WS" },
      { description: "San Marino", code: "SM" },
      { description: "Sao Tome and Principe", code: "ST" },
      { description: "Saudi Arabia", code: "SA" },
      { description: "Senegal", code: "SN" },
      { description: "Serbia and Montenegro", code: "CS" },
      { description: "Seychelles", code: "SC" },
      { description: "Sierra Leone", code: "SL" },
      { description: "Singapore", code: "SG" },
      { description: "Slovakia", code: "SK" },
      { description: "Slovenia", code: "SI" },
      { description: "Solomon Islands", code: "SB" },
      { description: "Somalia", code: "SO" },
      { description: "South Africa", code: "ZA" },
      {
        description: "South Georgia and the South Sandwich Islands",
        code: "GS"
      },
      { description: "Spain", code: "ES" },
      { description: "Sri Lanka", code: "LK" },
      { description: "Sudan", code: "SD" },
      { description: "Suriname", code: "SR" },
      { description: "Svalbard and Jan Mayen", code: "SJ" },
      { description: "Swaziland", code: "SZ" },
      { description: "Sweden", code: "SE" },
      { description: "Switzerland", code: "CH" },
      { description: "Syrian Arab Republic", code: "SY" },
      { description: "Taiwan, Republic of China", code: "TW" },
      { description: "Tajikistan", code: "TJ" },
      { description: "Tanzania, United Republic of", code: "TZ" },
      { description: "Thailand", code: "TH" },
      { description: "Timor-Leste", code: "TL" },
      { description: "Togo", code: "TG" },
      { description: "Tokelau", code: "TK" },
      { description: "Tonga", code: "TO" },
      { description: "Trinidad and Tobago", code: "TT" },
      { description: "Tunisia", code: "TN" },
      { description: "Turkey", code: "TR" },
      { description: "Turkmenistan", code: "TM" },
      { description: "Turks and Caicos Islands", code: "TC" },
      { description: "Tuvalu", code: "TV" },
      { description: "Uganda", code: "UG" },
      { description: "Ukraine", code: "UA" },
      { description: "United Arab Emirates", code: "AE" },
      { description: "United Kingdom", code: "GB" },
      { description: "United States", code: "US" },
      { description: "United States Minor Outlying Islands", code: "UM" },
      { description: "Uruguay", code: "UY" },
      { description: "Uzbekistan", code: "UZ" },
      { description: "Vanuatu", code: "VU" },
      { description: "Venezuela", code: "VE" },
      { description: "Viet Nam", code: "VN" },
      { description: "Virgin Islands, British", code: "VG" },
      { description: "Virgin Islands, U.S.", code: "VI" },
      { description: "Wallis and Futuna", code: "WF" },
      { description: "Western Sahara", code: "EH" },
      { description: "Yemen", code: "YE" },
      { description: "Zambia", code: "ZM" },
      { description: "Zimbabwe", code: "ZW" }
    ].filter(el => {
      return (
        el.description.toLowerCase().indexOf(req.query.code.toLowerCase()) >
          -1 || el.code.toLowerCase().indexOf(req.query.code.toLowerCase()) > -1
      );
    })
  );
});

app.post("/api/audit/medical/code", (req, res, next) => {
  const payload = { success: "OK" };
  res.status(200).json(payload);
});

app.get("/api/audit/auditor/queue/examiner/:id", (req, res, next) => {
  const payload = [
    {
      value: 7,
      label: "Devika Kumari"
    },
    {
      value: 6,
      label: "Megha Murali"
    }
  ];
  res.status(200).json(payload);
});

app.post("/api/audit/manual-selection/unassigned-claim", (req, res, next) => {
  const response = {
    auditUnAssignedClaimsDtoList: [
      {
        taskAssignmentId: 95,
        claimId: "20190121001224",
        claimType: "Professional",
        claimStatus: "Final",
        queueName: "hcc_super_user",
        receiptDate: "01/21/2019",
        claimsAge: 539,
        providerName: "SUPPLIER_1563771690521213964",
        memberGroupName: "MA",
        billedAmount: 100,
        allowedAmount: 70,
        paidAmount: 70,
        processedDate: "11/20/2019 01:53",
        examinerName: "Devika Kumari",
        claimFactKey: 40131,
        isInpatient: "N",
        processWorkflow: "Manually Adjudicated",
        providerKey: "10124",
        providerId: "435700922",
        tinNumber: "65-9330019",
        createdTime: "2019-07-19T00:46:36.897",
        claimSource: "EDI",
        lineOfBusiness: "Medicare",
        planType: "HMO",
        entryDate: "2019-07-19",
        memberName: "Steinmetz, Thelma",
        memberId: "482588611",
        memberGroupCode: "0000000021",
        claimQueueName: "hcc_super_user",
        owner: "U68905",
        reviewRepairReason: null,
        serviceDate: "2019-01-21",
        payableAmount: "70",
        paymentStatus: "Check Not Issued",
        procedureCode: null,
        diagnosisCode: "J30.1",
        userGroupName: ["HR_Manager_Group"],
        userGroupId: [33]
      },
      {
        taskAssignmentId: 95,
        claimId: "20190121001225",
        claimType: "Professional",
        claimStatus: "Final",
        queueName: "hcc_super_user",
        receiptDate: "01/21/2019",
        claimsAge: 539,
        providerName: "SUPPLIER_1563771690521213964",
        memberGroupName: "MA",
        billedAmount: 100,
        allowedAmount: 70,
        paidAmount: 70,
        processedDate: "11/20/2019 01:53",
        examinerName: "Devika Kumari",
        claimFactKey: 40131,
        isInpatient: "N",
        processWorkflow: "Manually Adjudicated",
        providerKey: "10124",
        providerId: "435700922",
        tinNumber: "65-9330019",
        createdTime: "2019-07-19T00:46:36.897",
        claimSource: "EDI",
        lineOfBusiness: "Medicare",
        planType: "HMO",
        entryDate: "2019-07-19",
        memberName: "Steinmetz, Thelma",
        memberId: "482588611",
        memberGroupCode: "0000000021",
        claimQueueName: "hcc_super_user",
        owner: "U68905",
        reviewRepairReason: null,
        serviceDate: "2019-01-21",
        payableAmount: "70",
        paymentStatus: "Check Not Issued",
        procedureCode: null,
        diagnosisCode: "J30.1",
        userGroupName: ["Authorization_Group"],
        userGroupId: [36]
      }
    ],
    count: 2
  };
  res.status(200).json(response);
});

app.post(
  "/api/audit/manual-selection/lead-manager/add-to-queue",
  (req, res, next) => {
    res.status(200).json("success");
  }
);

app.post(
  "/api/audit/manual-selection/auditor/add-to-queue",
  (req, res, next) => {
    res.status(200).json("success");
  }
);

app.get("/api/manager/review/get-claim-review-list", (req, res, next) => {
  const payload = [
    {
      slNo: 0,
      auditFlowId: 98,
      claimId: "20190403000184",
      claimType: "Institutional (OP)",
      claimStatus: "Final",
      receiptDate: "05/18/2020",
      claimByAge: 58,
      providerName: "Supplier_UST5",
      groupName: "Medicare Advantage",
      billedAmount: 900,
      allowedAmount: 630,
      totalPaidAmount: 630,
      processedDate: "06/24/2020 05:38",
      queueName: "hcc_super_user",
      auditorName: null,
      auditDate: null,
      auditStatus: "PENDED",
      errorType: null,
      errorDescription: null,
      financialImpact: null,
      amount: null,
      auditFlowStatus: "Pended"
    }
  ];
  res.status(200).json(payload);
});

app.get("/api/manager/review/:id", (req, res, next) => {
  const data = {
    auditTaskId: 14,
    auditFlowId: 23,
    claimId: "20190722001261",
    claimType: "Institutional (OP)",
    claimStatus: "Denied",
    receiptDate: "05/17/2020",
    claimsAge: 22,
    providerName: "Test Supplier1",
    memberGroupName: "Greenville",
    billedAmount: 500,
    currentLevel: 3,
    allowedAmount: 0,
    paidAmount: 0,
    processedDate: "05/17/2020 07:15",
    queueName: "hcc_super_user",
    errorType: "Financial",
    financialImpact: "Over Paid",
    auditorAmount: 20,
    auditorComments: ["Financial error, please verify"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 31,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 30,
          fileName: "frogs.jpg"
        }
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Audit - 06012020.xlsx"
        }
      }
    ],
    status: "ACCEPT",
    examinerAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    leadAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    examinerName: "Devika Kumari",
    auditorName: "Brian Blaze",
    examinerId: 7,
    auditorId: 107,
    examinerComments: ["Financial error, please verify"],
    leadComments: ["Failed"],
    managerComments: "Pended",
    managerAttachmentOne: null,
    managerAttachmentTwo: null,
    managerPreviousAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 19,
          fileName: "Test Audit Upload Details.docx"
        }
      }
    ],
    managerPreviousComments: ["Failed"],
    isComplete: false
  };
  res.status(200).json(data);
});

app.post("/api/reassign/get-user-groups", (req, res, next) => {
  res.status(200).json([
    {
      value: 7,
      label: "Itemized_Bill_Team"
    },
    {
      value: 2,
      label: "High_Dollar_Team"
    }
  ]);
});

app.get("/api/audit/dashboard/lead/queue/summary", (req, res, next) => {
  res.status(200).json({
    todaysCount: 5,
    backlogCount: 2
  });
});

app.get("/api/audit/dashboard/manager/queue/summary", (req, res, next) => {
  res.status(200).json({
    todaysCount: 5,
    backlogCount: 2
  });
});

app.get("/api/claims-audit/my-queue-summary", (req, res, next) => {
  res.status(200).json({
    reviewRebuttalCount: 1,
    routedInCount: 1
  });
});

app.get("/api/claims-audit/processed-claims-inventory", (req, res, next) => {
  setTimeout(() => {
    res.status(200).json({
      totalClaimsCount: 2,
      manualClaimsCount: 1,
      adjustedClaimsCount: 1,
      claimSource: {
        Paper: 1,
        EDI: 1
      },
      claimType: {
        Others: 1,
        Professional: 1
      },
      claimDecision: {
        Paid: 1,
        Deny: 1
      }
    });
  }, 3000);
});

app.get("/api/audit/dashboard/lead/queue/detail", (req, res, next) => {
  const data = [
    {
      stagingId: 1517,
      taskId: 0,
      claimId: "20200204000002",
      samplingType: "",
      claimType: "Institutional(OP)",
      status: "Final",
      receiptDate: "05/20/2020",
      age: 58,
      assignmentStatus: "No",
      auditorName: "",
      billedAmount: 29675.25,
      allowedAmount: 29675.25,
      paidAmount: 23740.200000000001,
      processedDate: "05/20/2020 04:27",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 0
    },
    {
      stagingId: 1507,
      taskId: 43,
      claimId: "20200506000002",
      samplingType: "Auditor",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "Yes",
      auditorName: "Brian Blaze",
      billedAmount: 9150,
      allowedAmount: 6862.5,
      paidAmount: 0,
      processedDate: "05/19/2020 07:07",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 0
    },
    {
      stagingId: 1924,
      taskId: 50,
      claimId: "20190114000011",
      samplingType: "Reassign",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "Yes",
      auditorName: "Brian Blaze",
      billedAmount: 30000,
      allowedAmount: 3000,
      paidAmount: 2400,
      processedDate: "05/19/2020 03:22",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 0
    },
    {
      stagingId: 1721,
      taskId: 53,
      claimId: "20200502000001",
      samplingType: "Manual",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "Yes",
      auditorName: "Brian Blaze",
      billedAmount: 9150,
      allowedAmount: 6862.5,
      paidAmount: 0,
      processedDate: "05/19/2020 04:10",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 0
    }
  ];
  res.status(200).json(data);
});

app.get("/api/audit/dashboard/lead/backlog/detail", (req, res, next) => {
  const data = [
    {
      stagingId: 1669,
      taskId: 0,
      claimId: "20190828000003",
      samplingType: "",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/15/2020",
      age: 63,
      assignmentStatus: "No",
      auditorName: "",
      billedAmount: 15700,
      allowedAmount: 9190.25,
      paidAmount: 9190.25,
      processedDate: "05/15/2020 03:15",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 2
    },
    {
      stagingId: 2129,
      taskId: 0,
      claimId: "20190822000001",
      samplingType: "",
      claimType: "Institutional(IP)",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "No",
      auditorName: "",
      billedAmount: 1100,
      allowedAmount: 1000,
      paidAmount: 800,
      processedDate: "05/19/2020 06:17",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 1
    }
  ];
  res.status(200).json(data);
});

app.get("/api/audit/dashboard/manager/queue/detail", (req, res, next) => {
  const data = [
    {
      stagingId: 1507,
      taskId: 43,
      claimId: "20200506000002",
      samplingType: "Auditor",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "Yes",
      auditorName: "Brian Blaze",
      billedAmount: 9150,
      allowedAmount: 6862.5,
      paidAmount: 0,
      processedDate: "05/19/2020 07:07",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 0
    },
    {
      stagingId: 1924,
      taskId: 50,
      claimId: "20190114000011",
      samplingType: "Reassign",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "Yes",
      auditorName: "Brian Blaze",
      billedAmount: 30000,
      allowedAmount: 3000,
      paidAmount: 2400,
      processedDate: "05/19/2020 03:22",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 0
    },
    {
      stagingId: 1721,
      taskId: 53,
      claimId: "20200502000001",
      samplingType: "Manual",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "Yes",
      auditorName: "Brian Blaze",
      billedAmount: 9150,
      allowedAmount: 6862.5,
      paidAmount: 0,
      processedDate: "05/19/2020 04:10",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 0
    }
  ];
  res.status(200).json(data);
});

app.get("/api/audit/dashboard/manager/backlog/detail", (req, res, next) => {
  const data = [
    {
      stagingId: 1669,
      taskId: 0,
      claimId: "20190828000003",
      samplingType: "",
      claimType: "Professional",
      status: "Final",
      receiptDate: "05/15/2020",
      age: 63,
      assignmentStatus: "No",
      auditorName: "",
      billedAmount: 15700,
      allowedAmount: 9190.25,
      paidAmount: 9190.25,
      processedDate: "05/15/2020 03:15",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 2
    },
    {
      stagingId: 2129,
      taskId: 0,
      claimId: "20190822000001",
      samplingType: "",
      claimType: "Institutional(IP)",
      status: "Final",
      receiptDate: "05/19/2020",
      age: 59,
      assignmentStatus: "No",
      auditorName: "",
      billedAmount: 1100,
      allowedAmount: 1000,
      paidAmount: 800,
      processedDate: "05/19/2020 06:17",
      examinerName: "Devika Kumari",
      claimQueueName: "hcc_super_user",
      backlogAge: 1
    }
  ];
  res.status(200).json(data);
});

app.post("/api/audit/auditor/queue/claim/route", (req, res, next) => {
  res.status(201).json("success");
});

app.get("/api/audit/dashboard/audit/queue/status", (req, res, next) => {
  const data = {
    unassignedCount: 10,
    auditorNames: {
      "118": "George Floyd",
      "123": "Tony Stark",
      "107": "Brian Blaze"
    }
  };
  res.status(200).json(data);
});

app.get("/api/audit/dashboard/audit/backlog/status", (req, res, next) => {
  const data = {
    unassignedCount: 3,
    auditorNames: {
      "118": "George Floyd",
      "123": "Tony Stark",
      "107": "Brian Blaze"
    }
  };
  const dataNew = {
    unassignedCount: 25,
    assignedCountDtoList: [
      {
        userId: 107,
        auditorName: "Brian Blaze",
        assignedCount: 12
      },
      {
        userId: 115,
        auditorName: "Dory Wilson",
        assignedCount: 0
      },
      {
        userId: 118,
        auditorName: "George Floyd",
        assignedCount: 1
      },
      {
        userId: 123,
        auditorName: "Tony Stark",
        assignedCount: 8
      }
    ]
  };
  res.status(200).json(dataNew);
});

app.get("/api/audit/dashboard/backlog/unassigned/:id", (req, res, next) => {
  const data = {
    queueDetailDtoList: [
      {
        stagingId: 1613,
        taskId: 0,
        claimId: "20190520007037",
        samplingType: "",
        claimType: "Professional",
        status: "Final",
        receiptDate: "05/16/2020",
        age: 63,
        assignmentStatus: "No",
        auditorName: "",
        billedAmount: 80,
        allowedAmount: 97.049999999999997,
        paidAmount: 97.049999999999997,
        processedDate: "05/16/2020 03:15",
        examinerName: "",
        claimQueueName: "hcc_super_user",
        backlogAge: 3
      },
      {
        stagingId: 1517,
        taskId: 0,
        claimId: "20200204000002",
        samplingType: "",
        claimType: "Institutional-OP",
        status: "Final",
        receiptDate: "05/20/2020",
        age: 59,
        assignmentStatus: "No",
        auditorName: "",
        billedAmount: 29675.25,
        allowedAmount: 29675.25,
        paidAmount: 23740.200000000001,
        processedDate: "05/20/2020 04:27",
        examinerName: "",
        claimQueueName: "hcc_super_user",
        backlogAge: 1
      }
    ],
    assignedCount: 0,
    unAssignedCount: 2
  };
  res.status(200).json(data);
});

app.get("/api/audit/dashboard/todays/unassigned/:id", (req, res, next) => {
  const data = {
    queueDetailDtoList: [
      {
        stagingId: 2089,
        taskId: 0,
        claimId: "20180101000004",
        samplingType: "",
        claimType: "Institutional-OP",
        status: "Final",
        receiptDate: "05/18/2020",
        age: 61,
        assignmentStatus: "No",
        auditorName: "",
        billedAmount: 0,
        allowedAmount: 0,
        paidAmount: 0,
        processedDate: "05/18/2020 03:41",
        examinerName: "Devika Kumari",
        claimQueueName: "hcc_super_user",
        backlogAge: 0
      }
    ],
    assignedCount: 1,
    unAssignedCount: 1
  };
  res.status(200).json(data);
});

app.post("/api/audit/dashboard/assign/claims", (req, res, next) => {
  res.status(201).json("success");
});

app.post("/api/audit/dashboard/remove/claims", (req, res, next) => {
  res.status(201).json("success");
});

app.get("/api/reports/audit-claims-parameter", (req, res, next) => {
  res.status(200).json({
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
  });
});

app.post(
  "/api/reports/audit-claims-pie-chart-sampling-type",
  (req, res, next) => {
    res.status(200).json({
      //   "timestamp": "2019-12-31T06:34:32.758+0000",
      //   "status": 404,
      //   "error": "Not Found",
      //   "message": "No claim status details found",
      //   "path": "/api/resource-dashboard/claims-per-status"
      // });

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
    });
  }
);

app.post(
  "/api/reports/audit-claims-pie-chart-adjudication-type",
  (req, res, next) => {
    res.status(200).json({
      //   "timestamp": "2019-12-31T06:34:32.758+0000",
      //   "status": 404,
      //   "error": "Not Found",
      //   "message": "No claim status details found",
      //   "path": "/api/resource-dashboard/claims-per-status"
      // });
      auditClaimCountDto: [
        {
          status: "Auto",
          claimCount: 2
        },
        {
          status: "Manual",
          claimCount: 31
        },
        {
          status: "Adjusted",
          claimCount: 31
        }
      ]
    });
  }
);

app.post(
  "/api/reports/audit-claims-pie-chart-audit-status",
  (req, res, next) => {
    res.status(200).json({
      //   "timestamp": "2019-12-31T06:34:32.758+0000",
      //   "status": 404,
      //   "error": "Not Found",
      //   "message": "No claim status details found",
      //   "path": "/api/resource-dashboard/claims-per-status"
      // });
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
    });
  }
);

app.post("/api/reports/audit-claims-pie-chart-error-ype", (req, res, next) => {
  res.status(200).json({
    //   "timestamp": "2019-12-31T06:34:32.758+0000",
    //   "status": 404,
    //   "error": "Not Found",
    //   "message": "No claim status details found",
    //   "path": "/api/resource-dashboard/claims-per-status"
    // });
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
  });
});

app.post(
  "/api/reports/audit-claims-pie-chart-payment-type",
  (req, res, next) => {
    res.status(200).json({
      //   "timestamp": "2019-12-31T06:34:32.758+0000",
      //   "status": 404,
      //   "error": "Not Found",
      //   "message": "No claim status details found",
      //   "path": "/api/resource-dashboard/claims-per-status"
      // });
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
    });
  }
);
app.post(
  "/api/reports/audit-claims-pie-chart-billed-amount",
  (req, res, next) => {
    res.status(200).json({
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
    });
    //   res.status(404).json({
    //     timestamp: "2019-12-31T06:34:32.758+0000",
    //     status: 404,
    //     error: "",
    //     message: "No Data Found!",
    //     path: "/api/resource-dashboard/claims-audited-per-user"
    // });
  }
);
app.get("/api/audit/manual-selection/auditor-details", (req, res, next) => {
  res.status(200).json([
    {
      id: 2,
      name: "Brian",
      queueName: null,
      assignCount: 3,
      userGroupIds: [36],
      userGroupNames: ["Authorization_Group"]
    },
    {
      id: 3,
      name: "Megha",
      queueName: null,
      assignCount: 3,
      userGroupIds: [33],
      userGroupNames: ["Authorization_Group"]
    }
  ]);
});

app.post(
  "/api/audit/manual-selection/lead-manager/add-to-auditor-queue",
  (req, res, next) => {
    res.status(200).json("success");
  }
);

app.post(
  "/api/reports/audit-claims-pie-chart-billed-amount-claim-type",
  (req, res, next) => {
    res.status(200).json({
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
    });
  }
);

app.post("/api/reassign/get-claims-count-per-user", (req, res, next) => {
  const payload = [
    { status: "Auditor Routed In", count: 0 },
    { status: "Review/Rebuttal", count: 0 },
    { status: "Backlog", count: 56 },
    { status: "Routed In", count: 56 }
  ];
  res.status(200).json(payload);
});

app.post("/api/reports/audit-claims-list-grid-view", (req, res, next) => {
  const response = {
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
  res.status(200).json(
    response

    // timestamp: "2019-12-31T06:34:32.758+0000",
    // providerName: 404,
    // error: "Not Found",
    // message: "No report data found for the selected criteria",
    // path: "/api/reports/auditor/audit-list-grid-view"
  );
});
app.post("/api/deletion/reports", (req, res, next) => {
  res.status(200).json([
    {
      claimId: 20190827000005,
      deletedDate: "08/10/2020",
      deletedUserName: "Brian Blaze",
      deleteComments: "Too much claims"
    }
  ]);
});

app.post("/api/reports/reassign", (req, res, next) => {
  const response = [
    {
      claimId: "2019110500000278",
      claimType: "Institutional",
      claimStatus: "Review",
      receiptDate: "11/05/2019",
      age: 274,
      billedAmount: 54357.72,
      queueName: "Itemized Bill WB",
      userGroup: "usergroup1",
      wfmStatus: "Routed In",
      wfmAge: 6,
      reassignedDate: "2020-07-30T01:11:16.194",
      reassignedByRole: "Manager",
      reassignedByName: "Deepa John",
      assignedFromRole: "Claims Lead",
      assignedFromName: "Manju Varghese",
      assignedToRole: "Claims Lead",
      assignedToName: "Tino Jose",
      reassignReason: "Reassignment Claims",
      reassignComments: null
    }
  ];
  res.status(200).json(
    response

    // timestamp: "2019-12-31T06:34:32.758+0000",
    // providerName: 404,
    // error: "Not Found",
    // message: "No report data found for the selected criteria",
    // path: "/api/reports/auditor/audit-list-grid-view"
  );
});

app.get(
  "/api/audit/home/dashboard/review-rebuttal/status",
  (req, res, next) => {
    const payload = {
      withExaminerCount: 3,
      withLeadCount: 2,
      withManagerCount: 1
    };
    res.status(200).json(payload);
  }
);

app.get("/api/audit/home/dashboard/review-rebuttal/:id", (req, res, next) => {
  const payload = [
    {
      claimId: 12345676,
      reviewRebutStatus: "Review",
      claimType: "Auto",
      claimStatus: "Denied",
      claimAge: 12,
      processedDate: "12/12/2019",
      errorDesc: "Incorrect Process",
      examinerName: "John",
      leadName: "Paul",
      managerName: "Jones",
      rebuttalLevel: 3,
      rebuttalDate: "17/12/2019",
      withExaminerDate: "13/12/2019",
      withLeadDate: "14/12/2019",
      withManagerDate: "15/12/2019"
    }
  ];
  res.status(200).json(payload);
});

const allUsers = [
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser,
  ...searchUser
];
app.post("/api/user-management/admin/user/details", (req, res, next) => {
  const { pageNo, pageSize } = req.body;
  const currentList = allUsers.filter(
    (user, i) => i >= pageSize * pageNo - pageSize && i < pageSize * pageNo
  );
  const payload = {
    totalRecords: allUsers.length,
    currentPage: pageNo,
    totalPages: 64,
    users: currentList
  };
  res.status(200).json(payload);
});

app.get("/api/audit/dashboard/auditor/assigned/claims", (req, res, next) => {
  res.status(200).json({
    "Dory Wilson": 0,
    "Brian Blaze": 12,
    "George Floyd": 1,
    "Tony Stark": 8
    // "John Snow": 8,
    // "George Fxloyd": 1,
    // "Tony Sxtark": 8,
    // "John Sxnow": 8,
  });
});

app.post("/auth/token/forgot/password", (req, res, next) => {
  res.status(200).json("success");
});

app.get("/auth/token/change/password?token=:id", (req, res, next) => {
  res.status(200).json({
    isTokenExpired: false
  });
});

app.post("/auth/token/save/password", (req, res, next) => {
  res.status(200).json("success");
});
app.post("/api/user-management/manager/all/user/details", (req, res, next) => {
  const { pageNo, pageSize } = req.body;
  const currentList = allUsers.filter(
    (user, i) => i >= pageSize * pageNo - pageSize && i < pageSize * pageNo
  );
  const payload = {
    totalRecords: allUsers.length,
    currentPage: pageNo,
    totalPages: 64,
    users: currentList
  };
  res.status(200).json(payload);
});
app.post("/api/user-management/lead/all/user/details", (req, res, next) => {
  const { pageNo, pageSize } = req.body;
  const currentList = allUsers.filter(
    (user, i) => i >= pageSize * pageNo - pageSize && i < pageSize * pageNo
  );
  const payload = {
    totalRecords: allUsers.length,
    currentPage: pageNo,
    totalPages: 64,
    users: currentList
  };
  res.status(200).json(payload);
});

app.get("/api/file/download/attachment", (req, res, next) => {
  res.status(200).json("success");
});

app.get("/api/enrollment-lead/my-team-status", (req, res, next) => {
  res.status(201).json({
    specialistCount: 21,
    assignedCount: 31,
    completedCount: 0,
    pendedCount: 0
  });
});

app.post("/api/audit/examiner/queue/claim/send-back", (req, res, next) => {
  res.status(200).json("success");
});

app.get("/api/enrollment-lead/review/get-claim", (req, res, next) => {
  const data = {
    auditTaskId: 14,
    auditFlowId: 23,
    subscriptionId: "20190722001261",
    transactionType: "Workbascket",
    promtStatus: "Denied",
    auditDate: "05/17/2020",
    recordAge: 22,
    subscriberName: "Test Supplier1",
    memberGroupName: "Greenville",
    memberID: 500,
    currentLevel: 3,
    memberLastName: 0,
    memberFirstName: 0,
    processedDate: "05/17/2020 07:15",
    userGroupName: "hcc_super_user",
    memberDOB: "Financial",
    transactionCount: "Over Paid",
    relationToSubscriber: "",
    auditorComments: ["Financial error, please verify"],
    auditorAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 31,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 30,
          fileName: "frogs.jpg"
        }
      },
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 29,
          fileName: "Audit - 06012020.xlsx"
        }
      }
    ],
    status: "ACCEPT",
    specialistAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    leadAttachments: [
      {
        attachmentTwo: {
          filePosition: "attachmentTwo",
          fileId: 33,
          fileName: "unnamed.jpg"
        },
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 32,
          fileName: "frogs.jpg"
        }
      }
    ],
    specialistName: "Devika Kumari",
    auditorName: "Brian Blaze",
    specialistId: 7,
    auditorId: 107,
    specialistComments: ["Financial error, please verify"],
    leadComments: ["Failed"],
    managerComments: "Pended",
    managerAttachmentOne: null,
    managerAttachmentTwo: null,
    managerPreviousAttachments: [
      {
        attachmentOne: {
          filePosition: "attachmentOne",
          fileId: 19,
          fileName: "Test Audit Upload Details.docx"
        }
      }
    ],
    managerPreviousComments: ["Failed"],
    isComplete: false
  };
  res.status(200).json(data);
});
