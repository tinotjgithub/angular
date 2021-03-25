import { ButtonModule } from "primeng/button";
import { PickListModule } from "primeng/picklist";
import { TabViewModule } from "primeng/tabview";
import { StepsModule } from "primeng/steps";
import { AccordionModule } from "primeng/accordion";
import { MultiSelectModule } from "primeng/multiselect";
import { GoogleChartsModule } from "angular-google-charts";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CalendarModule } from "primeng/calendar";
import { AuditorAuditSamplingByAuditMethodComponent } from "./auditor-audit-sampling-by-audit-method/auditor-audit-sampling-by-audit-method.component";
import { MessageModule } from "primeng/message";
import { AuditorAuditSamplingWorkCategoryComponent } from "./auditor-audit-sampling-work-category/auditor-audit-sampling-work-category.component";
import { EnrollmentAuditorDashboardService } from "./enrollment-audit-dashboard.service";
import { AuditedCountByWorkCategoryComponent } from "./audited-count-by-work-category/audited-count-by-work-category.component";
import { EnrollmentAuditorDashboardPopUpComponent } from "./enrollment-auditor-dashboard-pop-up/enrollment-auditor-dashboard-pop-up.component";
import { AuditSummaryByAuditStatusComponent } from "./audit-summary-by-audit-status/audit-summary-by-audit-status.component";
import { RebuttalStatusComponent } from "./rebuttal-status/rebuttal-status.component";
import { ProcessedVsAuditedComponent } from "./processed-vs-audited/processed-vs-audited.component";
import { MyHourlyProductivityComponent } from "./my-hourly-productivity/my-hourly-productivity.component";
import { AuditTrendDashboardComponent } from "./audit-trend-dashboard/audit-trend-dashboard.component";
import { AuditorAuditStatusBySpecialistComponent } from "./auditor-audit-status-by-specialist/auditor-audit-status-by-specialist.component";
import { AuditSamplingByAuditStatusComponent } from "./audit-sampling-by-audit-status/audit-sampling-by-audit-status.component";
import { AuditSamplingByBenifitPlanComponent } from "./audit-sampling-by-benifit-plan/audit-sampling-by-benifit-plan.component";
const routes: Routes = [];

@NgModule({
  declarations: [
    AuditSummaryByAuditStatusComponent,
    MyHourlyProductivityComponent,
    RebuttalStatusComponent,
    AuditTrendDashboardComponent,
    EnrollmentAuditorDashboardPopUpComponent,
    AuditedCountByWorkCategoryComponent,
    AuditorAuditSamplingWorkCategoryComponent,
    AuditorAuditStatusBySpecialistComponent,
    AuditorAuditSamplingByAuditMethodComponent,
    AuditSamplingByAuditStatusComponent,
    AuditSamplingByBenifitPlanComponent,
    ProcessedVsAuditedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule,
    ComponentsModule,
    CalendarModule,
    GoogleChartsModule,
    MessageModule,
    AccordionModule,
    StepsModule,
    ButtonModule,
    PickListModule,
    MultiSelectModule,
    TabViewModule
  ],
  providers: [ConfirmationService, EnrollmentAuditorDashboardService],
  exports: [
    AuditSummaryByAuditStatusComponent,
    AuditedCountByWorkCategoryComponent,
    RebuttalStatusComponent,
    EnrollmentAuditorDashboardPopUpComponent,
    AuditorAuditStatusBySpecialistComponent,
    AuditTrendDashboardComponent,
    AuditSamplingByBenifitPlanComponent,
    AuditSamplingByAuditStatusComponent,
    AuditorAuditSamplingByAuditMethodComponent,
    MyHourlyProductivityComponent,
    ProcessedVsAuditedComponent,
    AuditorAuditSamplingWorkCategoryComponent
  ]
})
export class EnrollmetAuditorDashboardModule {}
