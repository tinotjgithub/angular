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
import { CommonModule } from "@angular/common";
import { AuditSamplingByCategoryComponent } from "./audit-sampling-by-category/audit-sampling-by-category.component";
import { AuditReportDashboardComponent } from "./audit-report-dashboard.component";
import { AuditSamplingByMethodComponent } from "./audit-sampling-by-method/audit-sampling-by-method.component";
import { AuditSamplingByAdjudicationComponent } from "./audit-sampling-by-adjudication/audit-sampling-by-adjudication.component";
import { AuditStatusComponent } from "./audit-status/audit-status.component";
import { AuditStatusByErrorTypeComponent } from "./audit-status-by-error-type/audit-status-by-error-type.component";
import { AuditStatusByAmountComponent } from "./audit-status-by-amount/audit-status-by-amount.component";
import { AuditSamplingByBilledAmountComponent } from "./audit-sampling-by-billed-amount/audit-sampling-by-billed-amount.component";
import { AuditBilledAmountByClaimTypeComponent } from "./audit-billed-amount-by-claim-type/audit-billed-amount-by-claim-type.component";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
const routes: Routes = [
  {
    path: "",
    component: AuditReportDashboardComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    AuditSamplingByCategoryComponent,
    AuditReportDashboardComponent,
    AuditStatusByAmountComponent,
    AuditSamplingByMethodComponent,
    AuditStatusByErrorTypeComponent,
    AuditSamplingByBilledAmountComponent,
    AuditBilledAmountByClaimTypeComponent,
    AuditSamplingByAdjudicationComponent,
    AuditStatusComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    TooltipModule,
    GoogleChartsModule,
    CommonModule,
    DialogModule,
    CardModule,
    MultiSelectModule,
    ComponentsModule
  ],
  exports: [
    AuditSamplingByCategoryComponent,
    AuditReportDashboardComponent,
    AuditStatusByAmountComponent,
    AuditSamplingByMethodComponent,
    AuditStatusByErrorTypeComponent,
    AuditSamplingByBilledAmountComponent,
    AuditBilledAmountByClaimTypeComponent,
    AuditSamplingByAdjudicationComponent,
    AuditStatusComponent
  ]
})
export class AuditReportDashboardModule {}
