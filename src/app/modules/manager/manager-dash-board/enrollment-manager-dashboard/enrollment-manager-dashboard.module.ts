import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentManagerDashboardComponent } from "src/app/modules/manager/manager-dash-board/enrollment-manager-dashboard/enrollment-manager-dashboard.component";
import { RequestCountByQueueStatusComponent } from "./request-count-by-queue-status/request-count-by-queue-status.component";
import { RouterModule, Routes } from "@angular/router";
import { RequestCountByWorkCategoryComponent } from "./request-count-by-work-category/request-count-by-work-category.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { TooltipModule } from "primeng/tooltip";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { OpenInventoryNearingSlaDaysComponent } from "./open-inventory-nearing-sla-days/open-inventory-nearing-sla-days.component";
import { OpenInventoryByWorkCategoryComponent } from "./open-inventory-by-work-category/open-inventory-by-work-category.component";
import { OpenInventoryAgeWorkCategoryComponent } from "./open-inventory-age-work-category/open-inventory-age-work-category.component";
import { AuditSamplingByAuditMethodComponent } from "./audit-sampling-by-audit-method/audit-sampling-by-audit-method.component";
import { AuditSamplingByWorkCategoryComponent } from "./audit-sampling-by-work-category/audit-sampling-by-work-category.component";
import { AssignedVsAuditedComponent } from "./assigned-vs-audited/assigned-vs-audited.component";
import { RebuttalFailedVsAcceptedComponent } from "./rebuttal-failed-vs-accepted/rebuttal-failed-vs-accepted.component";
import { AuditStatusByLeadComponent } from "./audit-status-by-lead/audit-status-by-lead.component";
import { AuditStatusBySpecialistComponent } from "./audit-status-by-specialist/audit-status-by-specialist.component";
import { TransactionProcessedVsAuditedComponent } from "./transaction-processed-vs-audited/transaction-processed-vs-audited.component";
import { SpecialistProductivityByTransactionComponent } from "./specialist-productivity-by-transaction/specialist-productivity-by-transaction.component";
import { MyTeamProductivityByLeadComponent } from "./my-team-productivity-by-lead/my-team-productivity-by-lead.component";
import { OpenInventoryVolumeByAgeComponent } from "./open-inventory-volume-by-age/open-inventory-volume-by-age.component";
import { EnrollmentManagerDashboardPopUpComponent } from "./enrollment-manager-dashboard-pop-up/enrollment-manager-dashboard-pop-up.component";
import { MessageService } from "primeng/api";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";

const routes: Routes = [
  {
    path: "",
    component: RequestCountByQueueStatusComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    RequestCountByQueueStatusComponent,
    AuditSamplingByAuditMethodComponent,
    OpenInventoryAgeWorkCategoryComponent,
    OpenInventoryByWorkCategoryComponent,
    AuditSamplingByWorkCategoryComponent,
    EnrollmentManagerDashboardComponent,
    OpenInventoryNearingSlaDaysComponent,
    RequestCountByWorkCategoryComponent,
    AssignedVsAuditedComponent,
    MyTeamProductivityByLeadComponent,
    AuditStatusByLeadComponent,
    AuditStatusBySpecialistComponent,
    OpenInventoryVolumeByAgeComponent,
    RebuttalFailedVsAcceptedComponent,
    TransactionProcessedVsAuditedComponent,
    EnrollmentManagerDashboardPopUpComponent,
    SpecialistProductivityByTransactionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GoogleChartsModule,
    TableModule,
    FormsModule,
    TooltipModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CalendarModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    DropdownModule
  ],
  exports: [
    RequestCountByQueueStatusComponent,
    EnrollmentManagerDashboardComponent,
    EnrollmentManagerDashboardPopUpComponent
  ]
})
export class EnrollmentManagerDashboardModule {}
