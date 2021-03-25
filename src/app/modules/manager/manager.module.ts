import { Routes, RouterModule } from "@angular/router";
import { SlaConfigurationComponent } from "./sla-configuration/sla-configuration/sla-configuration.component";
import { NgModule } from "@angular/core";
import { TargetSettingsModule } from "./target-settings/target-settings.module";
import { TooltipModule } from "primeng/tooltip";
import { GoogleChartsModule } from "angular-google-charts";
import { CardModule } from "primeng/card";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { AdminUserManagementModule } from "./../admin/user-management/admin-user-management.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { AuditedClaimsReportModule } from "./../../modules/audited-claims-report/audited-claims-report.module";
import {
  FormsModule,
  ReactiveFormsModule
  // FormControlName,
  // FormGroup,
  // FormBuilder,
  // Validators
} from "@angular/forms";
import { EditUserComponent } from "../admin/user-management/edit-user/edit-user.component";
import { ManagerScoreCardComponent } from "./manager-dash-board/manager-score-card/manager-score-card.component";
// tslint:disable-next-line: max-line-length
import { ManagerClaimsCountByStatusComponent } from "./manager-dash-board/claims-manager-dashboard/manager-claims-count-by-status-queue/manager-claims-count-by-status-queue.component";
import { CommonModule } from "@angular/common";
import { MultiSelectModule } from "primeng/multiselect";
import { ClaimsCountByAgeComponent } from "./manager-dash-board/claims-manager-dashboard/manager-claims-count-by-age-vol/manager-claims-count-by-age-vol.component";
// tslint:disable-next-line: max-line-length
import { ClaimsExaminerCountByLeadComponent } from "./manager-dash-board/claims-manager-dashboard/manager-claims-examiner-count-by-lead/manager-claims-examiner-count-by-lead.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { RadioButtonModule } from "primeng/radiobutton";
import { CheckboxModule } from "primeng/checkbox";
import { ManagerFinancialScoreComponent } from "./manager-dash-board/claims-manager-dashboard/manager-financial-score/manager-financial-score.component";
import { ManagerProceduralScoreComponent } from "./manager-dash-board/claims-manager-dashboard/manager-procedural-score/manager-procedural-score.component";
// tslint:disable-next-line: max-line-length
import { ManagerClaimsProcessedVsAuditedComponent } from "./manager-dash-board/claims-manager-dashboard/manager-claims-processed-vs-audited/manager-claims-processed-vs-audited.component";
import { ManagerTeamProductivityComponent } from "./manager-dash-board/claims-manager-dashboard/manager-team-productivity/manager-team-productivity.component";
import { ManagerAuditScoreComponent } from "./manager-dash-board/claims-manager-dashboard/manager-audit-score/manager-audit-score.component";
import { AuditReportDashboardModule } from "./../audit-report-dashboard/audit-report-dashboard.module";
// tslint:disable-next-line: max-line-length
import { LowPerformingExaminersComponent } from "./../manager/manager-dash-board/claims-manager-dashboard/low-performing-examiners/low-performing-examiners.component";
// tslint:disable-next-line: max-line-length
import { HighPerformingExaminersComponent } from "./../manager/manager-dash-board/claims-manager-dashboard/high-performing-examiners/high-performing-examiners.component";
// tslint:disable-next-line: max-line-length
import { LandingPageModule } from "./landing-page/landing-page.module";
import { AuditReviewWorkflowModule } from "./audit-review-workflow/audit-review-workflow.module";
import { ReportsModule } from "../reports/reports.module";
// tslint:disable-next-line: max-line-length
import { AuditRebuttalWorkflowModule } from "./audit-rebuttal-workflow/audit-rebuttal-workflow.module";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
import { ClaimsManagerDashboardComponent } from "./manager-dash-board/claims-manager-dashboard/claims-manager-dashboard.component";
import { EnrollmentManagerDashboardModule } from "./../manager/manager-dash-board/enrollment-manager-dashboard/enrollment-manager-dashboard.module";
import { EnrollmentAuditorChecklistComponent } from './enrollment-auditor-checklist/enrollment-auditor-checklist.component';
import { SlaEnrollmentComponent } from './sla-configuration/sla-enrollment/sla-enrollment.component';
import { SlaConfigEnrollmentComponent } from './sla-configuration/sla-config-enrollment/sla-config-enrollment.component';
const routes: Routes = [
  {
    path: "MyScoreCard",
    component: ManagerScoreCardComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "UserConfig/edit-user",
    component: EditUserComponent,
    data: {
      breadcrumb: [{ label: "Modify Users" }]
    }
  },
  {
    path: "SLAConfiguration",
    component: SlaConfigurationComponent,
    data: {
      breadcrumb: [
        { label: "Claims Cut-Off Days and SLA Configuration" }
      ]
    }
  },
  {
    path: 'enrollment-auditor-checklist',
    component: EnrollmentAuditorChecklistComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "SLAConfiguration-Enrollment",
    component: SlaEnrollmentComponent,
    data: {
      breadcrumb: [
        { label: "SLA Days Configuration" }
      ]
    }
  },
  {
    path: "SLA-Enrollment",
    component: SlaConfigEnrollmentComponent,
    data: {
      breadcrumb: [
        { label: "SLA Configuration" }
      ]
    }
  },
];

@NgModule({
  providers: [MessageService],
  declarations: [
    ManagerScoreCardComponent,
    ManagerClaimsCountByStatusComponent,
    ClaimsCountByAgeComponent,
    ManagerFinancialScoreComponent,
    ManagerProceduralScoreComponent,
    ClaimsExaminerCountByLeadComponent,
    ManagerTeamProductivityComponent,
    ManagerClaimsProcessedVsAuditedComponent,
    ManagerAuditScoreComponent,
    LowPerformingExaminersComponent,
    ClaimsManagerDashboardComponent,
    HighPerformingExaminersComponent,
    SlaConfigurationComponent,
    EnrollmentAuditorChecklistComponent,
    SlaEnrollmentComponent,
    SlaConfigEnrollmentComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    MessageModule,
    MessagesModule,
    EnrollmentManagerDashboardModule,
    CalendarModule,
    TableModule,
    AuditedClaimsReportModule,
    MessageModule,
    MessagesModule,
    DropdownModule,
    AuditReportDashboardModule,
    AuditReviewWorkflowModule,
    ProgressSpinnerModule,
    TargetSettingsModule,
    TooltipModule,
    GoogleChartsModule,
    ButtonModule,
    AdminUserManagementModule,
    LandingPageModule,
    CommonModule,
    RadioButtonModule,
    DialogModule,
    CardModule,
    MultiSelectModule,
    ComponentsModule,
    ReportsModule,
    AuditRebuttalWorkflowModule
  ],
  exports: [
    ManagerFinancialScoreComponent,
    ManagerProceduralScoreComponent,
    ManagerClaimsProcessedVsAuditedComponent,
    LowPerformingExaminersComponent,
    HighPerformingExaminersComponent
  ]
})
export class ManagerModule {}
