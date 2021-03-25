// Avilable roles

export const maxTarget = 100;
export const maxHour = 24;
export const minTarget = 0;
export const minSLA = 1;

export const ROLES = {
  admin: "Administrator",
  managers: "Manager",
  auditor: "Claims Auditor",
  processor: "Claims Examiner",
  lead: "Claims Lead",
  user: "Update Checklist",
  approver: "Approver",
  manager: "Manager",
  enrollmentLead: "Enrollment Lead",
  enrollmentAuditor: "Enrollment Auditor",
  enrollmentSpecialist: "Enrollment Specialist",
};
export const auditorMenuItems = [
  /* {
    label: "Dashboard",
    icon: "fa fa-bar-chart",
    routerLink: ["/AuditorDashboard"],
    routerLinkActiveOptions: { exact: true },
    items: [],
    expanded: false,
  },
  {
    label: "Workspace",
    icon: "fa fa-tasks",
    items: [
      {
        label: "Auditor Queue",
        routerLink: ["/auditor-queue"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Review/Rebuttal Queue",
        routerLink: ["/auditor-queue/rebuttal"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Manual Claim Selection",
        routerLink: ["/manual-claim-selection-auditor"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
    expanded: false,
    route: null,
  },
  {
    label: "Reports",
    icon: "fas fa-print",
    expanded: false,
    items: [
      {
        label: "Audit Report",
        routerLink: ["/AuditorReports/audit-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Backlog Report",
        routerLink: ["/AuditorReports/audit-backlog-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Rebuttal Report",
        routerLink: ["/AuditorReports/audit-rebuttal-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Claims Report",
        routerLink: ["/AuditorReports/audited-claims-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
    route: null,
  }, */
  {
    label: "Home",
    icon: "menu-home",
    routerLink: ["/auditor-home"],
  },
  {
    label: "Action",
    icon: "menu-actions",
    routerLink: ["/actions"],
  },
  {
    label: "Dashboard",
    icon: "menu-dashboard",
    routerLink: ["/AuditorDashboard/dashboard"],
  },
  {
    label: "Reports",
    icon: "menu-report",
    routerLink: ["/AuditorReports/main"],
  },
  {
    label: "Configuration",
    icon: "menu-configuration",
    routerLink: ["/configuration-menu"],
  },
];
export const adminMenuItems = [
  /* {
    label: "Home",
    icon: "fas fa-home",
    routerLink: ["/ActiveUserSnapshot"],
    expanded: true,
    items: []
  },
  {
    label: "User Management",
    icon: "fas fa-users",
    expanded: false,
    items: [
      {
        label: "Add Users",
        routerLink: ["/UserConfig/add-user"],
        routerLinkActiveOptions: { exact: true },
        items: []
      },
      {
        label: "Modify Users",
        routerLink: ["/UserConfig/edit-user"],
        routerLinkActiveOptions: { exact: true },
        items: []
      }
    ],
    route: null
  },
  {
    label: "Reports",
    icon: "fas fa-print",
    expanded: false,
    items: [
      {
        label: "My Users",
        routerLink: ["/Reports/user-list"],
        routerLinkActiveOptions: { exact: true },
        items: []
      }
    ],
    route: null
  },
  {
    label: "Configuration",
    icon: "fas fa-cogs",
    expanded: false,
    items: [
      {
        label: "General",
        expanded: false,
        items: [
          {
            label: "Notifications",
            expanded: false,
            items: [],
            routerLink: ["/notification"],
            routerLinkActiveOptions: { exact: true }
          },
          {
            label: "Support",
            expanded: false,
            items: [],
            routerLink: ["/ConfigureSupport"],
            routerLinkActiveOptions: { exact: true }
          }
        ],
        route: null
      },
      {
        label: "Claim Ops",
        expanded: false,
        items: [
          {
            label: "Reason Codes",
            expanded: false,
            items: [
              {
                label: "Pend",
                icon: "",
                routerLink: ["/ConfigurePendReasons"],
                routerLinkActiveOptions: { exact: true },
                items: []
              },
              {
                label: "Route",
                icon: "",
                routerLink: ["/ConfigureRouteReasons"],
                items: []
              },
              {
                label: "Reassignment",
                icon: "",
                routerLink: ["/ConfigureReassignmentReasons"],
                items: []
              }
            ],
            route: null
          },
          {
            label: "Route Options",
            icon: "",
            routerLink: ["/ConfigureRouteRoles"],
            items: []
          }
        ],
        route: null
      },
      {
        label: "Enrollment Ops",
        icon: "",
        items: []
      }
    ],
    route: null
  } */
  {
    label: "Home",
    icon: "menu-home",
    routerLink: ["/ActiveUserSnapshot"],
  },
  {
    label: "Manage Users",
    icon: "menu-manage-user",
    routerLink: ["/UserConfig/edit-user"],
  },
  {
    label: "Reports",
    icon: "menu-report",
    routerLink: ["/Reports/user-list"],
  },
  {
    label: "Configuration",
    icon: "menu-configuration",
    routerLink: ["/admin-configuration"],
  },
];

export const managerMenuItems = [
  /* {
    label: "Home",
    expanded: true,
    icon: "fa fa-home",
    routerLink: ["/manager-home"],
    routerLinkActiveOptions: { exact: true },
    items: [],
  },
  {
    label: "Actions",
    icon: "fas fa-cogs",
    expanded: false,
    route: null,
    routerLink: ["/actions"],
    items: [
      {
        label: "Claim Reassignment",
        routerLink: ["/ClaimReassignment"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Manual Prioritization",
        icon: "",
        routerLink: ["/Reprioritize"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Rebuttal/Review",
        icon: "",
        routerLink: ["/rebut-review-manager"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Claims Audit",
        icon: "",
        routerLink: ["/claims-audit"],
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: "Manual Claim Selection",
            routerLink: ["/manual-claim-selection"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
        ],
      },
      {
        label: "Audit Routed In",
        routerLink: ["/audit-route-out"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
  },
  {
    label: "Dashboard",
    icon: "fa fa-bar-chart",
    routerLink: ["/ManagerScoreCard/MyScoreCard"],
    routerLinkActiveOptions: { exact: true },
    items: [],
    expanded: false,
  },
  {
    label: "Reports",
    icon: "fa fa-print",
    expanded: false,
    items: [
      {
        label: "My Users",
        routerLink: ["/ManagerReports/MyUsers"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit",
        routerLink: ["/Reports/quality-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Claims Report",
        routerLink: ["/Reports/audited-claims-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Claims Reassignment Report",
        routerLink: ["/ClaimReassignment/claims-reassignment-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Sampling Claim Deletion Report",
        routerLink: ["/AuditSamplingDeletionReport"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
    route: null,
  },
  {
    label: "User Management",
    icon: "fas fa-users",
    expanded: false,
    items: [
      {
        label: "Add Users",
        routerLink: ["/UserConfig/add-user"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Modify Users",
        routerLink: ["/UserConfig/edit-user"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Manage User Groups",
        routerLink: ["/UsergroupManagement"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
    route: null,
  },
  {
    label: "Configuration",
    icon: "fas fa-cogs",
    expanded: false,
    items: [
      {
        label: "Claims Ops",
        route: null,
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: "Audit",
            route: null,
            routerLinkActiveOptions: { exact: true },
            items: [
              {
                label: "Audit Checklist",
                routerLink: ["/auditor-checklist"],
                routerLinkActiveOptions: { exact: true },
                items: [],
              },
              {
                label: "Audit Sampling - Auto",
                routerLink: ["/auto-sampling"],
                routerLinkActiveOptions: { exact: true },
                items: [],
                expanded: false,
              },
              {
                label: "Audit Sampling Manual",
                routerLink: ["/manual-sampling"],
                routerLinkActiveOptions: { exact: true },
                items: [],
              },
              {
                label: "Review Workflow",
                icon: "",
                routerLink: ["/AuditReviewWorkflow/ReviewWorkflow"],
                routerLinkActiveOptions: { exact: true },
                items: [],
              },
              {
                label: "Rebuttal Workflow",
                icon: "",
                routerLink: ["/audit-rebuttal-workflow"],
                routerLinkActiveOptions: { exact: true },
                items: [],
              },
            ],
          },
          {
            label: "Route Reason Code",
            icon: "",
            routerLink: ["/ConfigureRouteReasons"],
            items: [],
          },
          {
            label: "Target Settings",
            icon: "",
            routerLink: ["/UserTargetSettings/TargetSettings"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
          {
            label: "Manual Synchronization",
            icon: "",
            routerLink: ["/UserConfig/manual-sync"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
        ],
      },
      {
        label: "Enrollment Ops",
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
    route: null,
  }, */
  {
    label: "Home",
    icon: "menu-home",
    routerLink: ["/manager-home"],
  },
  {
    label: "Action",
    icon: "menu-actions",
    routerLink: ["/actions"],
  },
  {
    label: "Dashboard",
    icon: "menu-dashboard",
    routerLink: ["/ManagerScoreCard/MyScoreCard"],
  },
  {
    label: "Manage Users",
    icon: "menu-manage-user",
    routerLink: ["/UserConfig/edit-user"],
  },
  {
    label: "Reports",
    icon: "menu-report",
    routerLink: ["/manager-reports"],
  },
  {
    label: "Configuration",
    icon: "menu-configuration",
    routerLink: ["/configuration-menu"],
  },
];

export const examinerMenuItems = [
  {
    label: "Claims Examiner Queue",
    icon: "menu-home",
    routerLink: ["/ClaimsExaminerQueue"],
    expanded: true,
    routerLinkActiveOptions: { exact: true },
    items: [],
  },
  {
    label: "My Score Card",
    icon: "menu-dashboard",
    routerLink: ["/MyScorecard"],
    routerLinkActiveOptions: { exact: true },
    items: [],
  },
  {
    label: "Audit Failed Queue",
    icon: "menu-report-dashboard",
    routerLink: ["/audit-failed"],
    routerLinkActiveOptions: { exact: true },
    items: [],
  },
];

export const leadMenuItems = [
  /* {
    label: "Home",
    icon: "fas fa-home",
    expanded: "true",
    routerLink: ["/lead-home"],
    routerLinkActiveOptions: { exact: true },
    items: [],
  },
  {
    label: "Actions",
    icon: "fas fa-cogs",
    items: [
      {
        label: "Route Claim",
        icon: "",
        routerLink: ["/ClaimRouting"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Modify User",
        icon: "",
        routerLink: ["/LeadModifyUser"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Modify UserGroup Target",
        icon: "",
        routerLink: ["/modify-usergroup-target"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Manual Prioritization",
        icon: "",
        routerLink: ["/Reprioritize"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Claim Reassignment",
        routerLink: ["/ClaimReassignment"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Rebuttal/Review",
        routerLink: ["/rebut-review"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Claims Audit",
        icon: "",
        routerLink: ["/claims-audit"],
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: "Manual Claim Selection",
            routerLink: ["/manual-claim-selection"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
        ],
      },
      {
        label: "Audit Routed In",
        routerLink: ["/audit-route-out"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
    route: null,
  },
  {
    label: "Dashboard",
    icon: "fa fa-bar-chart",
    routerLink: ["/LeadDashBoard"],
    routerLinkActiveOptions: { exact: true },
    items: [],
  },
  {
    label: "Reports",
    icon: "fa fa-print",
    expanded: false,
    items: [
      {
        label: "My Users",
        routerLink: ["/Reports/user-list"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit",
        routerLink: ["/Reports/quality-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Pended Claims",
        routerLink: ["/Reports/status-pended"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Routed-In Claims",
        routerLink: ["/Reports/status-routed-in"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Claims Report",
        routerLink: ["/Reports/audited-claims-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Claims Reassignment Report",
        routerLink: ["/ClaimReassignment/claims-reassignment-report"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
      {
        label: "Audit Sampling Claim Deletion Report",
        routerLink: ["/AuditSamplingDeletionReport"],
        routerLinkActiveOptions: { exact: true },
        items: [],
      },
    ],
    route: null,
  },
  {
    label: "Configuration",
    icon: "fas fa-cogs",
    expanded: false,
    items: [
      {
        label: "Claims Ops",
        route: null,
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: "Target Settings",
            icon: "",
            routerLink: ["/UserTargetSettings/TargetSettings"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
        ],
      },
      {
        label: "Audit",
        route: null,
        routerLinkActiveOptions: { exact: true },
        items: [
          {
            label: "Audit Checklist",
            routerLink: ["/auditor-checklist"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
          {
            label: "Audit Sampling - Auto",
            routerLink: ["/auto-sampling"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
          {
            label: "Audit Sampling Manual",
            routerLink: ["/manual-sampling"],
            routerLinkActiveOptions: { exact: true },
            items: [],
          },
        ],
      },
    ],
    route: null,
  }, */
  {
    label: "Home",
    icon: "menu-home",
    routerLink: ["/lead-home"],
  },
  {
    label: "Action",
    icon: "menu-actions",
    routerLink: ["/actions"],
  },
  {
    label: "Dashboard",
    icon: "menu-dashboard",
    routerLink: ["/LeadDashBoard/dashboard"],
  },
  {
    label: "Reports",
    icon: "menu-report",
    routerLink: ["/lead-reports"],
  },
  {
    label: "Configuration",
    icon: "menu-configuration",
    routerLink: ["/configuration-menu"],
  },
];

export const specialistMenuItems = [
  {
    label: "Home",
    icon: "menu-home",
    routerLink: ["/specialist"],
  },
  {
    label: "Dashboard",
    icon: "menu-dashboard",
    routerLink: ["/specialist-scorecard/view"],
  },
  {
    label: "Audit Failed Queue",
    icon: "menu-report-dashboard",
    routerLink: ["/audit-failed-specialist"],
  },
  {
    label: "Reports",
    icon: "menu-report",
    routerLink: ["/specialist-report"],
  },
];

export const enrollmentAuditorMenuItems = [
  {
    label: "Home",
    icon: "menu-home",
    routerLink: ["/enrollment-auditor"],
  },
  {
    label: "Action",
    icon: "menu-actions",
    routerLink: ["/actions"],
  },
  {
    label: "Dashboard",
    icon: "menu-dashboard",
    routerLink: ["/enrollment-auditor-dashboard/auditor-dashboard"],
  },
  {
    label: "Reports",
    icon: "menu-report",
    routerLink: ["/AuditorReports/main"],
  },
  {
    label: "Configuration",
    icon: "menu-configuration",
    routerLink: ["/configuration-menu"],
  },
];

export const enrollmentLeadMenuItems = [
  {
    label: "Home",
    icon: "menu-home",
    routerLink: ["/enrollment-lead-landing-page"],
  },
  {
    label: "Action",
    icon: "menu-actions",
    routerLink: ["/actions"],
  },
  {
    label: "Dashboard",
    icon: "menu-dashboard",
    routerLink: ["/enrollment-lead-dashBoard"],
  },
  {
    label: "Configuration",
    icon: "menu-configuration",
    routerLink: ["/configuration-menu"],
  },
];

export const INACTIVE_LOGOUT_LIMIT = 18000;

export const UserReportAdminUserDropdownRoles = [
  "Manager",
  "Claims Lead",
  "Enrollment Lead",
];

export const ADD_USER_MANAGER_ROLE = [
  "claims lead",
  "claims auditor",
  "claims examiner",
  "enrollment lead",
  "enrollment specialist",
  "enrollment auditor",
];

export const ADD_USER_USERGROUP_ROLE = [
  "claims examiner",
  "claims auditor",
  "enrollment specialist",
  "enrollment auditor",
];

export const ADD_USER_USERGROUP_REQUIRED = [
  "claims examiner",
  "enrollment specialist",
];

export const actions = {
  Manager: [
    {
      header: "Claims Operations",
      icon: "claims-operations.png",
      links: [
        {
          label: "General",
          routerLink: "",
          items: [
            {
              label: "Claim Reassignment",
              routerLink: "/ClaimReassignment/reassignment",
              items: [],
            },
            {
              label: "Manual Prioritization",
              routerLink: "/Reprioritize",
              items: [],
            },
          ],
        },
        {
          label: "Audit",
          routerLink: "",
          items: [
            {
              label: "Audit Rebuttal/Review",
              routerLink: "/rebut-review-manager",
              items: [],
            },
            {
              label: "Manual Claim Assignment",
              routerLink: "/manual-claim-selection",
              items: [],
            },
            {
              label: "Audit Routed In",
              routerLink: "/audit-route-out",
              items: [],
            },
          ],
        },
      ],
    },
    {
      header: "Enrollment Operations",
      icon: "enrollment.png",
      links: [
        {
          label: "General",
          routerLink: "",
          items: [
            {
              label: "Manual Prioritization",
              routerLink: "/enrollment-manual-prioritization",
              items: [],
            },
          ],
        },
        {
          label: "Audit",
          routerLink: "",
          items: [
            {
              label: "Audit Rebuttal/Review",
              routerLink: "/enrollment-rebut-review",
              items: [],
            },
            {
              label: "Manual Assignment",
              routerLink: ["/enrollment-manual-assignment"],
              items: [],
            }
          ],
        }
      ],
    },
  ],
  "Claims Lead": [
    {
      header: "Claims Operations",
      icon: "claims-operations.png",
      links: [
        {
          label: "General",
          icon: "general.png",
          items: [
            {
              label: "Route Claim",
              routerLink: ["/ClaimRouting"],
            },
            {
              label: "Modify User Target",
              routerLink: ["/LeadModifyUser"],
              items: [],
            },
            {
              label: "Modify UserGroup Target",
              routerLink: ["/modify-usergroup-target"],
              items: [],
            },
            {
              label: "Manual Prioritization",
              routerLink: ["/Reprioritize"],
              items: [],
            },
            {
              label: "Claim Reassignment",
              routerLink: ["/ClaimReassignment/reassignment"],
              items: [],
            },
          ],
        },
        {
          label: "Audit",
          icon: "claims-operations.png",
          items: [
            {
              label: "Audit Rebuttal/Review",
              routerLink: ["/rebut-review"],
              items: [],
            },
            {
              label: "Manual Claim Assignment",
              routerLink: ["/manual-claim-selection"],
              items: [],
            },
            {
              label: "Audit Routed In",
              routerLink: ["/audit-route-out"],
              items: [],
            },
          ],
        },
      ],
    },
  ],
  "Claims Auditor": [
    {
      header: "Claims Audit",
      icon: "claims-operations.png",
      links: [
        {
          label: "",
          items: [
            {
              label: "Auditor Queue",
              routerLink: ["/auditor-queue"],
              items: [],
            },
            {
              label: "Review/Rebuttal Queue",
              routerLink: ["/auditor-queue/rebuttal"],
              items: [],
            },
            {
              label: "Manual Claim Assignment",
              routerLink: ["/manual-claim-selection-auditor"],
              items: [],
            },
          ],
        },
      ],
    },
  ],
  "Enrollment Lead": [
    {
      header: "General",
      icon: "general.png",
      links: [
        {
          label: "",
          items: [
            {
              label: "Fallout/Recon Assignment",
              routerLink: ["/fallout-recon-assignment"],
              items: [],
            },
            {
              label: "Ticket Assignment",
              routerLink: ["/"],
              items: [],
            },
            {
              label: "Manual Prioritization",
              routerLink: ["/enrollment-manual-prioritization"],
              items: [],
            },
          ],
        },
      ],
    },
    {
      header: "Audit",
      icon: "claims-operations.png",
      links: [
        {
          label: "",
          items: [
            /* {
              label: "Manual Claim Selection",
              routerLink: ["/manual-claim-selection"],
              items: []
            },
            {
              label: "Route To Auditor",
              routerLink: ["/audit-route-out"],
              items: []
            }, */
            {
              label: "Manual Assignment",
              routerLink: ["/enrollment-manual-assignment"],
              items: [],
            },
            {
              label: "Audit Rebuttal Review",
              routerLink: ["/enrollment-rebut-review"],
              items: [],
            },
          ],
        },
      ],
    },
  ],
  "Enrollment Auditor": [
    {
      header: "Enrollment Audit",
      icon: "claims-operations.png",
      links: [
        {
          label: "",
          items: [
            {
              label: "Audit Queue",
              routerLink: ["/enrollment-auditor/audit-queue"],
              items: [],
            },
            {
              label: "Rebuttal/Review",
              routerLink: ["/enrollment-auditor/rebut-queue"],
              items: [],
            },
            {
              label: "Manual Sampling",
              routerLink: ["/manual-claim-selection"],
              items: [],
            },
            {
              label: "Manual Assignment",
              routerLink: ["/enrollment-manual-assignment"],
              items: [],
            }
          ],
        },
      ],
    },
  ],
};
export const configurationMenu = {
  Manager: [
    {
      header: "Claims Operations",
      icon: "claims-operations.png",
      links: [
        {
          label: "General",
          routerLink: null,
          items: [
            {
              label: "Route Reason Code",
              routerLink: ["/ConfigureRouteReasons"],
              items: [],
            },
            {
              label: "Target Settings",
              routerLink: ["/UserTargetSettings/TargetSettings"],
              items: [],
            },
            {
              label: "Claims Cut-Off Days and SLA Configuration",
              routerLink: ["/SlaConfiguration/SLAConfiguration"],
              items: [],
            },
            /* {
              label: "Manual Synchronization",
              routerLink: ["/UserConfig/manual-sync"],
              items: [],
            }, */
          ],
        },
        {
          label: "Audit",
          items: [
            {
              label: "Audit Checklist",
              routerLink: ["/auditor-checklist"],
            },
            {
              label: "Automated Audit Sampling",
              routerLink: ["/auto-sampling"],
            },
            {
              label: "Manual Audit Sampling",
              routerLink: ["/manual-sampling"],
            },
            {
              label: "Review Workflow",
              routerLink: ["/AuditReviewWorkflow/ReviewWorkflow"],
            },
            {
              label: "Rebuttal Workflow",
              routerLink: ["/audit-rebuttal-workflow"],
            },
            {
              label: "Procedure Code Upload",
              routerLink: ["/BulkUpload"],
              queryParams: { mode: "procedure-code" },
            },
            {
              label: "Diagnosis Code Upload",
              routerLink: ["/BulkUpload"],
              queryParams: { mode: "diagnosis-code" },
            },
          ],
        }
      ],
    },
    {
      header: "Enrollment Operations",
      icon: "enrollment.png",
      links: [
        {
          label: "General",
          routerLink: null,
          items: [
            {
              label: "Route Reason Code",
              routerLink: ["/ConfigureRouteReasons"],
              queryParams: { type: "enrollment" },
              items: [],
            },
            {
              label: "Target Settings",
              routerLink: ["/UserTargetSettings/TargetSettings"],
              items: [],
              queryParams: { type: "enrollment" },
            },
            {
              label: "Audit Checklist",
              routerLink: ["/checklist/enrollment-auditor-checklist"],
              items: [],
              queryParams: { type: "enrollment" },
            },
            {
              label: "Configure SLA",
              routerLink: ["/SlaConfiguration/SLA-Enrollment"],
              items: [],
            }
          ],
        },
        {
          label: "Audit",
          items: [
            {
              label: "Review Workflow",
              routerLink: ["/enrollment-audit-review-workflow"],
            },
            {
              label: "Rebuttal Workflow",
              routerLink: ["/enrollment-audit-rebuttal-workflow"],
            },
            {
              label: "Automated Audit Sampling",
              routerLink: ["/enrollment-auto-sampling"],
            },
            {
              label: "Manual Audit Sampling",
              routerLink: ["/enrollment-manual-sampling"],
            },
          ],
        },
      ],
    },
  ],
  "Claims Lead": [
    {
      header: "Claims Operation",
      icon: "claims-operations.png",
      links: [
        {
          label: "General",
          items: [
            {
              label: "Target Settings",
              routerLink: ["/UserTargetSettings/TargetSettings"],
            },
          ],
        },
        {
          label: "Audit",
          items: [
            {
              label: "Audit Checklist",
              routerLink: ["/auditor-checklist"],
            },
            {
              label: "Automated Audit Sampling",
              routerLink: ["/auto-sampling"],
            },
            {
              label: "Manual Audit Sampling",
              routerLink: ["/manual-sampling"],
            },
          ],
        },
      ],
    },
  ],
  "Enrollment Lead": [
    {
      header: "General",
      icon: "general.png",
      links: [
        {
          label: "",
          routerLink: "",
          items: [
            {
              label: "Template Configuration",
              routerLink: "/template-configuration",
              items: [],
            },
          ],
        },
      ],
    },
    {
      header: "Enrollment Audit",
      icon: "enrollment.png",
      links: [
        {
          label: "",
          routerLink: "",
          items: [
            {
              label: "Automated Audit Sampling",
              routerLink: ["/enrollment-auto-sampling"],
            },
            {
              label: "Manual Audit Sampling",
              routerLink: ["/enrollment-manual-sampling"],
            },
          ],
        },
      ],
    },
  ],
  "Claims Auditor": [
    {
      header: "Claims Operation",
      icon: "claims-operations.png",
      links: [
        {
          label: "Audit",
          items: [
            {
              label: "Manual Audit Sampling",
              routerLink: ["/manual-sampling"],
            },
          ],
        },
      ],
    },
  ],
  "Enrollment Auditor": [
    {
      header: "Enrollment Operation",
      icon: "claims-operations.png",
      links: [
        {
          label: "Audit",
          items: [
            {
              label: "Manual Audit Sampling",
              routerLink: ["/enrollment-manual-sampling"],
            },
          ],
        },
      ],
    },
  ],
};

export const specialistStatusType = {
  Assigned: "assigned",
  Completed: "completed",
  Pended: "pended",
  "Routed Out": "routed-out",
  "Audit Failed": "audit-failed",
};

export const NO_AUTH_URL = ["api/configuration/support/details"];

export const roueRoleDisabled = {
  Manager: ["Manager"],
  "Claims Examiner": ["Manager"],
  "Claims Lead": ["Claims Lead"],
  "Enrollment Lead": ["Enrollment Lead"],
  "Enrollment Specialist": ["Manager"],
};
