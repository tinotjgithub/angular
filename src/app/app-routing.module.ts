import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RouteGuard } from "./guards/route.guard/route.guard.service";
import { AuthGuard } from "./guards/auth.guard/auth.guard";
import { APP_CONFIG } from "./services/config/config.service";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => {
      return APP_CONFIG.LOGIN_OPTION === "saml"
        ? import("./modules/authentication/sso/sso.module").then(
            (m) => m.SsoModule
          )
        : import("./modules/authentication/authentication.module").then(
            (m) => m.AuthenticationModule
          );
    },
  },
  {
    path: "Login",
    loadChildren:
      "./modules/authentication/authentication.module#AuthenticationModule"
  },
  {
    path: "MyScorecard",
    loadChildren: "./modules/score-card/score-card.module#ScoreCardModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "My Score Card" }],
      expectedRoles: ["Administrator", "Claim Auditor", "Claims Examiner"]
    }
  },
  {
    path: "UserConfig",
    loadChildren:
      "./modules/admin/user-management/admin-user-management.module#AdminUserManagementModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [],
      expectedRoles: ["Administrator", "Manager", "Claims Lead"]
    }
  },
  {
    path: "Reprioritize",
    loadChildren:
      "./modules/lead/reprioritize/reprioritize.module#ReprioritizeModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Actions", url: "/actions" },
        { label: "Manual Prioritization" },
      ],
      expectedRoles: [
        "Administrator",
        "Claims Lead",
        "Update Checklist",
        "Manager"
      ]
    }
  },
  {
    path: "Reports",
    loadChildren: "./modules/reports/reports.module#ReportsModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Reports" }],
      expectedRoles: [
        "Administrator",
        "Claims Examiner",
        "Manager",
        "Claims Lead"
      ]
    }
  },
  {
    path: "AuditorReports",
    loadChildren:
      "./modules/auditor/auditor-reports/auditor-report.module#AuditorReportModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Reports" }],
      expectedRoles: ["Claims Auditor"]
    }
  },
  {
    path: "ClaimsExaminerQueue",
    loadChildren: "./modules/drawmode/drawmode.module#DrawmodeModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Claims Examiner Queue" }],
      expectedRoles: [
        "Administrator",
        "Claims Auditor",
        "Claims Examiner",
        "Approver"
      ]
    }
  },
  {
    path: "MyClaims",
    loadChildren: "./modules/myclaims/myclaims.module#MyclaimsModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Claims Examiner Queue", url: "ClaimsExaminerQueue" },
        { label: "My Claims" }
      ],
      expectedRoles: [
        "Administrator",
        "Claims Auditor",
        "Claims Examiner",
        "Approver"
      ]
    }
  },
  {
    path: "ConfigureRouteReasons",
    loadChildren:
      "./modules/admin/configure-routing/configure-routereasons/configure-routereasons.module#ConfigureRouteReasonsModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration" },
        { label: "Reason Codes" },
        { label: "Route" }
      ],
      expectedRoles: ["Administrator", "Manager"]
    }
  },
  {
    path: "UserTargetSettings",
    loadChildren: "./modules/manager/manager.module#ManagerModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      // breadcrumb: [{ label: "Actions" }],
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Target Settings" },
      ],
      expectedRoles: ["Claims Lead", "Manager"]
    }
  },
  {
    path: "SlaConfiguration",
    loadChildren: "./modules/manager/manager.module#ManagerModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      // breadcrumb: [{ label: "Actions" }],
      breadcrumb: [{ label: "Configuration", url: "/configuration-menu" }],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "checklist",
    loadChildren: "./modules/manager/manager.module#ManagerModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Enrollment Configuration", url: "/configuration-menu" },
        { label: "Audit Checklist" },
      ],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "AuditReviewWorkflow",
    loadChildren: "./modules/manager/manager.module#ManagerModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Review Workflow" },
      ],
      expectedRoles: ["Manager"]
    }
  },
  {
    path: "audit-rebuttal-workflow",
    loadChildren:
      "./modules/manager/audit-rebuttal-workflow/audit-rebuttal-workflow.module#AuditRebuttalWorkflowModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Rebuttal Workflow" },
      ],
      expectedRoles: ["Manager"]
    }
  },
  {
    path: "UsergroupManagement",
    loadChildren:
      "./modules/manager/usergroup-management/manage-usergroup/manage-usergroup.module#ManageUsergroupModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Manage User Groups" }],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "ManagerScoreCard",
    loadChildren: "./modules/manager/manager.module#ManagerModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Dashboard" }],
      expectedRoles: ["Manager"]
    }
  },
  {
    path: "enrollment-auditor-checklist",
    loadChildren: "./modules/manager/manager.module#ManagerModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Dashboard" }],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "ClaimRouting",
    loadChildren:
      "./modules/lead/claim-routing/claim-routing.module#ClaimRoutingModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Actions", url: "actions" },
        { label: "Route Claim", url: "ClaimRouting" },
      ],
      expectedRoles: ["Claims Lead"]
    }
  },
  {
    path: "ManagerReports",
    loadChildren:
      "./modules/manager/reports/manager-reports.module#MangerReportsModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Reports" }],
      expectedRoles: ["Manager"]
    }
  },
  {
    path: "ActiveUserSnapshot",
    loadChildren:
      "./modules/admin/active-user-snapshot/active-user-snapshot.module#ActiveUserSnapshotModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home" }],
      expectedRoles: ["Administrator", "Claims Auditor"]
    }
  },
  {
    path: "notification",
    loadChildren:
      "./modules/admin/notification/notification.module#NotificationModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/admin-configuration" },
        { label: "Notification" }
      ],
      expectedRoles: ["Administrator"]
    }
  },
  {
    path: "LeadModifyUser",
    loadChildren:
      "./modules/lead/lead-modify-user/lead-modify-user.module#LeadModifyUserModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Actions", url: "actions" },
        { label: "Modify User" },
      ],
      expectedRoles: ["Claims Lead"],
    },
  },
  {
    path: "LeadDashBoard",
    loadChildren:
      "./modules/lead/lead-dashboard/lead-dashboard.module#LeadDashboardModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Dashboard" }],
      expectedRoles: ["Claims Lead"]
    }
  },
  {
    path: "lead-home",
    loadChildren:
      "./modules/lead/landing-page/landing-page.module#LandingPageModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home" }],
      expectedRoles: ["Claims Lead"]
    }
  },
  {
    path: "manager-home",
    loadChildren:
      "./modules/manager/landing-page/landing-page.module#LandingPageModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home" }],
      expectedRoles: ["Manager"]
    }
  },
  {
    path: "ConfigureSupport",
    loadChildren:
      "./modules/admin/configure-support/configure-support.module#ConfigureSupportModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Configuration", url: "/admin-configuration" }],
      expectedRoles: ["Administrator"]
    }
  },
  {
    path: "ConfigureExaminerProductivity",
    loadChildren:
      "./modules/admin/configure-examiner-productivity/configure-examiner-productivity.module#ConfigureExaminerProductivityModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Configuration", url: "/admin-configuration" }],
      expectedRoles: ["Administrator"]
    }
  },
  {
    path: "ConfigureExaminerProductivity",
    loadChildren:
      "./modules/admin/configure-examiner-productivity/configure-examiner-productivity.module#ConfigureExaminerProductivityModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Configuration", url: "/admin-configuration" }],
      expectedRoles: ["Administrator"],
    },
  },
  {
    path: "BulkUpload",
    loadChildren:
      "./modules/admin/bulk-upload/bulk-upload.module#BulkUploadModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Configuration", url: "/bulk-upload" }],
      expectedRoles: ["Administrator", "Manager"],
    },
  },
  {
    path: "AuditorDashboard",
    loadChildren:
      "./modules/auditor/auditor-dashboard/auditor-dashboard.module#AuditorDashboardModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Dashboard" }],
      expectedRoles: ["Claims Auditor"]
    }
  },
  {
    path: "auditor",
    loadChildren: "./modules/auditor/auditor.module#AuditorModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home", url: "auditor-home" }],
      expectedRoles: ["Claims Auditor"]
    }
  },
  {
    path: "auditor-home",
    loadChildren:
      "./modules/auditor/landing-page/landing-page.module#LandingPageModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home" }],
      expectedRoles: ["Claims Auditor"]
    }
  },
  // {
  //   path: "Reprioritize",
  //   loadChildren:
  //     "./modules/lead/reprioritize/reprioritize.module#ReprioritizeModule",
  //   canActivate: [RouteGuard, AuthGuard],
  //   data: {
  //     breadcrumb: [{ label: "Home" }],
  //     expectedRoles: ["Claims Lead"]
  //   }
  // }
  {
    path: "ClaimReassignment",
    loadChildren:
      "./modules/claim-reassignment/claim-reassignment.module#ClaimReassignmentModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      expectedRoles: ["Claims Lead", "Manager"],
      breadcrumb: [],
    },
  },
  {
    path: "AuditSamplingDeletionReport",
    loadChildren:
      "./modules/audit-sampling-deletion/audit-sampling-deletion.module#AuditSamplingDeletionReportModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      // breadcrumb: [{ label: "Audit Sampling Claim Deletion Report" }],
      expectedRoles: ["Claims Lead", "Manager"]
    }
  },
  {
    path: "manual-sampling",
    loadChildren:
      "./modules/auditor/manual-sampling/manual-sampling.module#ManualSamplingModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Manual Audit Sampling", url: "manual-sampling" },
      ],
      expectedRoles: ["Claims Lead", "Manager", "Claims Auditor"],
    },
  },
  {
    path: "auto-sampling",
    loadChildren:
      "./modules/auditor/auto-sampling/auto-sampling.module#AutoSamplingModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Automated Audit Sampling" },
      ],
      expectedRoles: ["Manager", "Claims Lead"],
    },
  },
  {
    path: "auditor-checklist",
    loadChildren: () =>
      import("./modules/auditor/checklist/checklist.module").then(
        m => m.ChecklistModule
      ),
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "CheckList" },
      ],
      expectedRoles: ["Claims Lead", "Manager"]
    }
  },
  {
    path: "auditor-queue",
    loadChildren:
      "./modules/auditor/auditor-queue/auditor-queue.module#AuditorQueueModule",
    data: {
      breadcrumb: [{ label: "Actions" }],
      expectedRoles: ["Claims Auditor"]
    }
  },
  {
    path: "rebut-review",
    loadChildren:
      "./modules/lead/rebut-review/rebut-review.module#RebutReviewModule",
    data: {
      breadcrumb: [{ label: "Actions" }],
      expectedRoles: ["Claims Lead"]
    }
  },
  {
    path: "audit-failed",
    loadChildren:
      "./modules/claims-examiner/audit-failed/audit-failed.module#AuditFailedModule",
    data: {
      breadcrumb: [{ label: "Audit" }, { label: "Audit Failed Queue" }]
    }
  },
  {
    path: "modify-usergroup-target",
    loadChildren:
      "./modules/lead/modify-usergroup-target/modify-usergroup-target.module#ModifyUsergroupTargetModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Actions", url: "actions" },
        { label: "Modify Usergroup Target" },
      ],
      expectedRoles: ["Claims Lead"],
    },
  },
  {
    path: "rebut-review-manager",
    loadChildren:
      "./modules/manager/rebut-review/rebut-review.module#RebutReviewModule",
    data: {
      breadcrumb: [{ label: "Actions", url: "./actions" }],
      expectedRoles: ["Manager"]
    }
  },
  {
    path: "rebut-review-list",
    loadChildren:
      "./modules/rebut-review-list/rebut-review-list.module#RebutReviewListModule",
    data: {
      breadcrumb: [
        { label: "Claims Audit", url: "claims-audit" },
        { label: "Review/Rebuttal Queue" }
      ],
      expectedRoles: ["Claims Lead"]
    }
  },
  {
    path: "audit-routed-in-detail",
    loadChildren:
      "./modules/audit-claim-routing/audit-claim-routing.module#AuditClaimRoutingModule",
    data: {
      breadcrumb: [{ label: "Claims Audit", url: "/claims-audit" }],
      expectedRoles: ["Claims Lead", "Manager"],
    },
  },
  {
    path: "audit-route-out",
    loadChildren:
      "./modules/audit-claim-routing/audit-claim-routing.module#AuditClaimRoutingModule",
    data: {
      breadcrumb: [
        { label: "Action", url: "/actions" },
        { label: "Audit Routed In" },
      ],
      expectedRoles: ["Claims Lead", "Manager"]
    }
  },
  {
    path: "claims-audit",
    loadChildren:
      "./modules/claims-audit/claims-audit.module#ClaimsAuditModule",
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Claims Audit", url: "claims-audit" },
      ],
      expectedRoles: ["Claims Lead", "Manager"]
    }
  },
  {
    path: "routed-in-list",
    loadChildren:
      "./modules/audit-claim-routing/audit-claim-routing.module#AuditClaimRoutingModule",
    data: {
      breadcrumb: [
        { label: "Detail Page", url: "manager-home" },
        { label: "Routed In Queue" }
      ],
      expectedRoles: ["Manager"]
    }
  },
  {
    path: "manual-claim-selection",
    loadChildren: () =>
      import(
        "./modules/manual-claim-selection/manual-claim-selection.module"
      ).then(m => m.ManualClaimSelectionModule),
    data: {
      breadcrumb: [
        { label: "Action", url: "actions" },
        // { label: "Claims Audit", url: "claims-audit" },
        { label: "Manual Claim Assignment" }
      ],
      expectedRoles: ["Manager", "Claims Lead"]
    }
  },
  {
    path: "manual-claim-selection-auditor",
    loadChildren: () =>
      import(
        "./modules/manual-claim-selection/manual-claim-selection.module"
      ).then(m => m.ManualClaimSelectionModule),
    data: {
      breadcrumb: [{ label: "Action" }, { label: "Manual Claim Assignment" }],
      expectedRoles: ["Claims Auditor"]
    }
  },
  {
    path: "AuditReportDashboard",
    loadChildren:
      "./modules/audit-report-dashboard/audit-report-dashboard.module#AuditReportDashboardModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Audit Dashboard" }],
      expectedRoles: ["Claims Auditor", "Manager", "Claims Lead"]
    }
  },
  {
    path: "admin-configuration",
    loadChildren:
      "./modules/admin/configuration/configuration.module#ConfigurationModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Configuration", url: "/admin-configuration" }],
      expectedRoles: ["Administrator"]
    }
  },
  {
    path: "change-password",
    loadChildren:
      "./modules/authentication/reset-password/reset-password.module#ResetPasswordModule"
  },
  {
    path: "actions",
    loadChildren: "./modules/actions/actions.module#ActionsModule",
    data: {
      expectedRoles: ["Manager"],
      breadcrumb: [{ label: "Action", url: "/actions" }],
    },
  },
  {
    path: "manager-reports",
    loadChildren:
      "./modules/reports/manager-reports/manager-reports.module#ManagerReportsModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Reports" }],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "configuration-menu",
    loadChildren:
      "./modules/configuration/configuration.module#ConfigurationModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Configuration" }],
      expectedRoles: [
        "Manager",
        "Claims Lead",
        "Claims Auditor",
        "Enrollment Lead",
        "Enrollment Auditor",
      ],
    },
  },
  {
    path: "enrollment-auditor-dashboard",
    loadChildren:
      "./modules/enrollmet-auditor/enrollmet-auditor.module#EnrollmetAuditorModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Dashboard" }],
      expectedRoles: ["Enrollment Auditor"],
    },
  },
  {
    path: "lead-reports",
    loadChildren:
      "./modules/reports/lead-reports/lead-reports.module#LeadReportsModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Reports" }],
      expectedRoles: ["Claims Lead"],
    },
  },
  {
    path: "enrollment-audit-review-workflow",
    loadChildren:
      "./modules/manager/audit-review-workflow/audit-review-workflow.module#AuditReviewWorkflowModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Enrollment" },
        { label: "Review Workflow" },
      ],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "enrollment-audit-rebuttal-workflow",
    loadChildren:
      // tslint:disable-next-line: max-line-length
      "./modules/manager/audit-rebuttal-workflow/audit-rebuttal-workflow.module#AuditRebuttalWorkflowModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Enrollment" },
        { label: "Rebuttal Workflow" },
      ],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "enrollment-rebut-review",
    loadChildren:
      "./modules/enrollment-rebut-review/enrollment-rebut-review.module#EnrollmentRebutReviewModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Actions", url: "/actions" },
        { label: "Enrollment" },
      ],
      expectedRoles: ["Manager", "Enrollment Lead"],
    },
  },
  {
    path: "enrollment-manual-prioritization",
    loadChildren:
      "./modules/enrollment-manual-prioritization/enrollment-manual-prioritization.module#EnrollmentManualPrioritizationModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Actions", url: "/actions" },
        { label: "Manual Prioritization" },
      ],
      expectedRoles: ["Manager", "Enrollment Lead"],
    },
  },
  {
    path: "enrollment-auto-sampling",
    loadChildren:
      "./modules/enrollment-auto-sampling/enrollment-auto-sampling.module#EnrollmentAutoSamplingModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Enrollment" },
      ],
      expectedRoles: ["Manager", "Enrollment Lead"],
    },
  },
  {
    path: "specialist",
    loadChildren: "./modules/specialist/specialist.module#SpecialistModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home", target: "home" }],
      expectedRoles: ["Enrollment Specialist"],
    },
  },
  {
    path: "audit-failed-specialist",
    loadChildren:
      "./modules/specialist/audit-failed/audit-failed.module#AuditFailedModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Audit Failed Queue" }],
      expectedRoles: ["Enrollment Specialist"],
    },
  },
  {
    path: "specialist-scorecard",
    loadChildren:
      "./modules/specialist/dashboard/dashboard.module#DashboardModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Scorecard", url: "/specialist-scorecard" }],
      expectedRoles: ["Enrollment Specialist", "Enrollment Lead"],
    },
  },
  // {
  //   path: "specialist-scorecard",
  //   loadChildren: "./modules/specialist/dashboard/dashboard.module#DashboardModule",
  //   canActivate: [RouteGuard, AuthGuard],
  //   data: {
  //     breadcrumb: [{ label: "Scorecard", url: '/specialist-scorecard' }],
  //     expectedRoles: ["Enrollment Lead"],
  //   },
  // },
  {
    path: "enrollment-lead-dashBoard",
    loadChildren:
      "./modules/enrollment-ops/enrollment-lead/enrollment-lead-dashboard/enrollment-lead-dashboard.module#EnrollmentLeadDashboardModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Dashboard", url: "/enrollment-lead-dashBoard" }],
      expectedRoles: ["Enrollment Specialist", "Enrollment Lead"],
    },
  },
  {
    path: "enrollment-lead-landing-page",
    loadChildren:
      // tslint:disable-next-line: max-line-length
      "./modules/enrollment-ops/enrollment-lead/enrollment-lead-landing-page/enrollment-lead-landing-page.module#EnrollmentLeadLandingPageModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home", url: "/enrollment-lead-landing-page" }],
      expectedRoles: ["Enrollment Lead"],
    },
  },

  {
    path: "template-configuration",
    loadChildren:
      // tslint:disable-next-line: max-line-length
      "./modules/enrollment-ops/enrollment-lead/template-configuration/template-configuration.module#TemplateConfigurationModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Template Configuration", url: "/template-configuration" },
      ],
      expectedRoles: ["Enrollment Lead"],
    },
  },

  {
    path: "specialist-report",
    loadChildren: "./modules/specialist/report/report.module#ReportModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Reports", url: "/specialist-report" }],
      expectedRoles: ["Enrollment Specialist"],
    },
  },
  {
    path: "enrollment-manual-sampling",
    loadChildren:
      "./modules/enrollment-manual-sampling/enrollment-manual-sampling.module#EnrollmentManualSamplingModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Enrollment" },
      ],
      expectedRoles: ["Manager", "Enrollment Lead", "Enrollment Auditor"],
    },
  },
  {
    path: "enrollment-manual-assignment",
    loadChildren:
      // tslint:disable-next-line: max-line-length
      "./modules/enrollment-ops/enrollment-lead/enrollment-manual-assignment/enrollment-manual-assignment.module#EnrollmentManualAssignmentModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Configuration", url: "/configuration-menu" },
        { label: "Enrollment" },
      ],
      expectedRoles: ["Enrollment Lead", "Enrollment Auditor", "Manager"],
    },
  },
  {
    path: "fallout-recon-assignment",
    loadChildren:
      // tslint:disable-next-line: max-line-length
      "./modules/enrollment-ops/enrollment-lead/fallout-recon-assignment/fallout-recon-assignment.module#FalloutReconAssignmentModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Actions", url: "/actions" },
        { label: "Fallout/Recon Assignment" },
      ],
      expectedRoles: ["Enrollment Lead"],
    },
  },
  {
    path: "enrollment-audit",
    loadChildren:
      "./modules/enrollment-ops/enrollment-lead/enrollment-audit/enrollment-audit.module#EnrollmentAuditModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Home", url: "/enrollment-lead-landing-page" },
        { label: "Enrollment Audit" },
      ],
      expectedRoles: ["Enrollment Lead"],
    },
  },
  {
    path: "pending-assignment-detail",
    loadChildren:
      "./modules/pending-assignment-detail/pending-assignment-detail.module#PendingAssignmentDetailModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Pending Assignments" }],
      expectedRoles: ["Claims Lead", "Manager", "Enrollment Lead"],
    },
  },
  {
    path: "saml",
    loadChildren: "./modules/authentication/sso/sso.module#SsoModule",
  },
  {
    path: "client-queue",
    loadChildren:
      "./modules/lead/client-vendor/client-vendor.module#ClientVendorModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Client Vendor Queue" },
      ],
      expectedRoles: ["Claims Lead"],
    },
  },
  {
    path: "enrollment-auditor",
    loadChildren:
      "./modules/enrollmet-auditor/enrollmet-auditor.module#EnrollmetAuditorModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [],
      expectedRoles: ["Enrollment Auditor"],
    },
  },
  {
    path: "enrollment-lead-detail",
    loadChildren:
      "./modules/enrollment-ops/enrollment-lead/detail-page-lead/detail-page-lead.module#DetailPageLeadModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home", target: "home" }],
      expectedRoles: ["Enrollment Lead"],
    },
  },
  {
    path: "enable-audit-checklist",
    loadChildren:
      "./modules/admin/enable-audit-checklist/enable-audit-checklist.module#EnableAuditChecklistModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Configuration", target: "admin-configuration" }],
      expectedRoles: ["Administrator"],
    },
  },
  {
    path: "enrollment-audit-landing-page",
    loadChildren:
      "./modules/manager/enrollment-audit-landing-page/enrollment-audit-landing-page.module#EnrollmentAuditLandingPageModule",
    canActivate: [RouteGuard, AuthGuard],
    data: {
      breadcrumb: [{ label: "Home", target: "manager-home" }],
      expectedRoles: ["Manager"],
    },
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuard]
})
export class AppRoutingModule {}
