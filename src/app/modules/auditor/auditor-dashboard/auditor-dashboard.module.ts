import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { GoogleChartsModule } from "angular-google-charts";
import { CardModule } from "primeng/card";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { AuditorDashboardComponent } from "./audit-dashboard/audit-dashboard.component";
import { ClaimsAuditSummaryComponent } from "./claims-audit-summary/claims-audit-summary.component";
import { ClaimsAuditedQueueComponent } from "./claims-audited-queue/claims-audited-queue.component";
import { ClaimsAuditedTypeStatusComponent } from "./claims-audited-type-status/claims-audited-type-status.component";
import { ClaimsAuditProductivityComponent } from "./claims-audit-productivity/claims-audit-productivity.component";
import { ManagerModule } from "./../../manager/manager.module";
import { AuditReportDashboardModule } from "../../audit-report-dashboard/audit-report-dashboard.module";
import { LandingPageModule } from "./../landing-page/landing-page.module";
import { AuditedClaimsDetailsComponent } from "./audited-claims-details/audited-claims-details.component";
import { ReportsModule } from "../../reports/reports.module";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";

const routes: Routes = [
  {
    path: "dashboard",
    component: AuditorDashboardComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    AuditorDashboardComponent,
    ClaimsAuditSummaryComponent,
    ClaimsAuditedQueueComponent,
    AuditedClaimsDetailsComponent,
    ClaimsAuditedTypeStatusComponent,
    ClaimsAuditProductivityComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    MessagesModule,
    MessageModule,
    DropdownModule,
    TooltipModule,
    GoogleChartsModule,
    LandingPageModule,
    CommonModule,
    DialogModule,
    CardModule,
    MultiSelectModule,
    ComponentsModule,
    TableModule,
    ManagerModule,
    AuditReportDashboardModule,
    ReportsModule
  ]
})
export class AuditorDashboardModule {}
