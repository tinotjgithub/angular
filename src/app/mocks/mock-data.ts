export const roles = {
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

export const routeRoleList = {
  roles: [
    {
      id: 2,
      roleName: "Claims Examiner",
      isRoutingEnabled: "Y"
    },
    {
      id: 1,
      roleName: "Claims Lead",
      isRoutingEnabled: "Y"
    }
  ]
};

export const roleList = [
  {
    indexNo: 0,
    routeFrom: "Claims Examiner",
    routeTo: "Claims Lead",
    routeFromId: "2",
    routeToId: "4",
    routeStatus: true
  },
  {
    indexNo: 1,
    routeFrom: "Claims Lead",
    routeTo: "Claims Examiner",
    routeFromId: "4",
    routeToId: "2",
    routeStatus: true
  }
];

export const routeArrayList = {
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

export const pendList = [
  {
    pendReasonCode: "1",
    pendReason: "Invalid Claim",
    pendStatus: true
  },
  {
    pendReasonCode: "2",
    pendReason: "Duplicate Claim",
    pendStatus: true
  },
  {
    pendReasonCode: "3",
    pendReason: "Excalated Claim",
    pendStatus: true
  },
  {
    pendReasonCode: "4",
    pendReason: "Invalid Calim Details",
    pendStatus: true
  },
  {
    pendReasonCode: "5",
    pendReason: "Inadequate details",
    pendStatus: true
  },
  {
    pendReasonCode: "6",
    pendReason: "Already Processed Claim",
    pendStatus: true
  },
  {
    pendReasonCode: "7",
    pendReason: "Claim need to be verified",
    pendStatus: true
  }
];

export const pendArray = [
  {
    pendReasonCode: 8,
    pendReason: "test",
    pendStatus: true
  }
];

export const duplicatePendList = [
  {
    pendReasonCode: "1",
    pendReason: "Invalid Claim",
    pendStatus: true
  },
  {
    pendReasonCode: "1",
    pendReason: "Invalid Claim",
    pendStatus: true
  }
];

export const routeList = [
  {
    routeReasonCode: "1",
    routeReason: "Invalid Claim",
    routeRoleDetails: { id: 1 }
  },
  {
    routeReasonCode: "2",
    routeReason: "Duplicate Claim",
    routeRoleDetails: { id: 2 }
  }
];

export const routeArray = [
  {
    routeReasonCode: 1,
    routeReason: "test",
    routeRoleDetails: { id: 1 }
  }
];

export const duplicateRouteList = [
  {
    routeReasonCode: "1",
    routeReason: "Invalid Claim",
    routeRoleDetails: { id: 1 }
  },
  {
    routeReasonCode: "1",
    routeReason: "Invalid Claim",
    rrouteRoleDetails: { id: 2 }
  }
];

export const targetScores = {
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

export const prcRowData = {
  endPeriod: "2020-04-27",
  id: 3,
  proceduralScores: 92,
  startPeriod: "2020-02-20"
};

export const finRowData = {
  endPeriod: "2020-04-27",
  id: 3,
  financialScores: 92,
  startPeriod: "2020-02-20"
};

export const workflowData = {
  roles: [
    {
      id: 4,
      roleName: "Claims Lead",
      isRoutingEnabled: null,
      isReviewWorkflowEnabled: true
    },
    {
      id: 6,
      roleName: "Manager",
      isRoutingEnabled: "Y",
      isReviewWorkflowEnabled: true
    },
    {
      id: 3,
      roleName: "Claims Auditor",
      isRoutingEnabled: null,
      isReviewWorkflowEnabled: false
    }
  ]
};

export const slaTargetScores = {
  claimsSLATargets: [
    {
      id: 1,
      period: "06/01/2020",
      slaName: "SLA1",
      turnAroundTime: 29,
      targetSLA: 89.0,
      thresholdTime: 0
    },
    {
      id: 2,
      period: "01/04/2020",
      slaName: "SLA2",
      turnAroundTime: 11,
      targetSLA: 99.0,
      thresholdTime: null
    },
    {
      id: 3,
      period: "07/05/2020",
      slaName: "SLA3",
      turnAroundTime: 15,
      targetSLA: 97.0,
      thresholdTime: 10
    },
    {
      id: 4,
      period: "09/07/2020",
      slaName: "SLA3",
      turnAroundTime: 26,
      targetSLA: 95.0,
      thresholdTime: 6
    }
  ]
};

export const claimTargetScores = {
  claimsSLATargets: [
    {
      id: 1,
      period: "06/01/2020",
      slaName: "SLA1",
      turnAroundTime: 29,
      targetSLA: 89.0
    },
    {
      id: 1,
      period: "06/01/2020",
      slaName: "SLA1",
      turnAroundTime: 29,
      targetSLA: 89.0
    }
  ]
};

export const rowData = {
  id: 3,
  targetSLA: 92,
  period: "06/01/2020"
};
