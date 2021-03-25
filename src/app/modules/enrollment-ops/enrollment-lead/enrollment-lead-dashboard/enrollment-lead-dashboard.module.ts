import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleChartsModule } from "angular-google-charts";
import { TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { TooltipModule } from "primeng/tooltip";
import { EnrollmentAuditSummaryByAuditorComponent } from "./enrollment-audit-summary-by-auditor/enrollment-audit-summary-by-auditor.component";
import { EnrollmentLeadDashboardComponent } from "./enrollment-lead-dashboard/enrollment-lead-dashboard.component";
import { ProductionCountByStatusComponent } from "./production-count-by-status/production-count-by-status.component";
import { ProductionCountSpecialistComponent } from "./production-count-specialist/production-count-specialist.component";
import { SpecialistHourlyProductivityComponent } from "./specialist-hourly-productivity/specialist-hourly-productivity.component";
import { EnrollmentTransactionTrendComponent } from "./enrollment-transaction-trend/enrollment-transaction-trend.component";
import { EnrollmentRequestTrendComponent } from "./enrollment-request-trend/enrollment-request-trend.component";
import { AuditCountByWorkCategoryComponent } from "./audit-count-by-work-category/audit-count-by-work-category.component";
import { AuditByRequestTypeComponent } from "./audit-by-request-type/audit-by-request-type.component";
import { LeadRebuttalStatusComponent } from "./lead-rebuttal-status/lead-rebuttal-status.component";
import { AuditorWorkingTimeComponent } from "./auditor-working-time/auditor-working-time.component";
import { SpecialistWorkingTimeTrendComponent } from "./specialist-working-time-trend/specialist-working-time-trend.component";
import { EnrollmentLeadDashboardPopupComponent } from "./enrollment-lead-dashboard-popup/enrollment-lead-dashboard-popup.component";
import { DashboardModule } from "./../../../specialist/dashboard/dashboard.module";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
const routes: Routes = [
  {
    path: "",
    component: EnrollmentLeadDashboardComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    EnrollmentTransactionTrendComponent,
    EnrollmentLeadDashboardComponent,
    ProductionCountByStatusComponent,
    SpecialistHourlyProductivityComponent,
    EnrollmentRequestTrendComponent,
    AuditorWorkingTimeComponent,
    EnrollmentLeadDashboardPopupComponent,
    ProductionCountSpecialistComponent,
    AuditCountByWorkCategoryComponent,
    AuditByRequestTypeComponent,
    SpecialistWorkingTimeTrendComponent,
    EnrollmentAuditSummaryByAuditorComponent,
    LeadRebuttalStatusComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TableModule,
    MessagesModule,
    MessageModule,
    GoogleChartsModule,
    CommonModule,
    CalendarModule,
    DialogModule,
    TooltipModule,
    DashboardModule,
    DropdownModule,
    MultiSelectModule
  ]
})
export class EnrollmentLeadDashboardModule {}
