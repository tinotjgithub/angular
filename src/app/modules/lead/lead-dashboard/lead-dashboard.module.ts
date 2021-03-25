import { Routes, RouterModule } from "@angular/router";
import { LeadScoreCardComponent } from "./lead-score-card/lead-score-card.component";
import { LeadClaimsCountByAgeVolComponent } from "./lead-claims-count-by-age-vol/lead-claims-count-by-age-vol.component";
import { LeadClaimsCountByStatusQueueComponent } from "./lead-claims-count-by-status-queue/lead-claims-count-by-status-queue.component";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleChartsModule } from "angular-google-charts";
import { TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { ManagerModule } from "./../../manager/manager.module";
import { LandingPageModule } from "./../../manager/landing-page/landing-page.module";
import { AuditPassedVsFailedExaminerComponent } from "./audit-passed-vs-failed-examiner/audit-passed-vs-failed-examiner.component";
import { LeadTeamProductivityComponent } from "./lead-team-productivity/lead-team-productivity.component";
import { AuditReportDashboardModule } from "../../audit-report-dashboard/audit-report-dashboard.module";
// tslint:disable-next-line: max-line-length
import { EnrollmentLeadDashboardModule } from "./../../enrollment-ops/enrollment-lead/enrollment-lead-dashboard/enrollment-lead-dashboard.module";
import { ReportsModule } from "../../reports/reports.module";
import { ComponentsModule } from "src/app/shared/components/components.module";

import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";

const routes: Routes = [
  {
    path: "dashboard",
    component: LeadScoreCardComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    LeadClaimsCountByAgeVolComponent,
    LeadClaimsCountByStatusQueueComponent,
    LeadScoreCardComponent,
    LeadTeamProductivityComponent,
    AuditPassedVsFailedExaminerComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    TableModule,
    GoogleChartsModule,
    CommonModule,
    CalendarModule,
    DialogModule,
    EnrollmentLeadDashboardModule,
    LandingPageModule,
    ComponentsModule,
    TooltipModule,
    MultiSelectModule,
    ManagerModule,
    AuditReportDashboardModule,
    ReportsModule
  ]
})
export class LeadDashboardModule {}
