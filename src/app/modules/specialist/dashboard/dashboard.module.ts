import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScorecardComponent } from "./scorecard/scorecard.component";
import { InventoryByStatusComponent } from "./inventory-by-status/inventory-by-status.component";
import { RequestCountByTransactionComponent } from "./request-count-by-transaction/request-count-by-transaction.component";
import { ProductionCountByWorkCategoryComponent } from "./production-count-by-work-category/production-count-by-work-category";
import { ProductionCountByTransactionCategoryComponent } from "./production-count-by-transaction-category/production-count-by-transaction-category";
import { RebuttalStatusComponent } from "./rebuttal-status/rebuttal-status.component";
import { QualityScoreComponent } from "./quality-score/quality-score.component";
import { ProductivityByTransactionComponent } from "./productivity-by-transaction/productivity-by-transaction.component";
import { PendedRequestAgeComponent } from "./pended-request-age/pended-request-age.component";
import { OpenInventoryByCategoryComponent } from "./open-inventory-by-category/open-inventory-by-category";
import { AuditTransactionTrendComponent } from "./audit-transaction-trend/audit-transaction-trend.component";
import { SpecialistDashboardPopComponent } from "./specialist-dashboard-pop/specialist-dashboard-pop.component";
import { Routes, RouterModule, Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleChartsModule } from "angular-google-charts";
import { TableModule } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";

const routes: Routes = [
  {
    path: "view",
    component: ScorecardComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    ScorecardComponent,
    InventoryByStatusComponent,
    SpecialistDashboardPopComponent,
    AuditTransactionTrendComponent,
    RequestCountByTransactionComponent,
    ProductionCountByWorkCategoryComponent,
    ProductionCountByTransactionCategoryComponent,
    RebuttalStatusComponent,
    QualityScoreComponent,
    ProductivityByTransactionComponent,
    PendedRequestAgeComponent,
    OpenInventoryByCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GoogleChartsModule,
    DialogModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    MultiSelectModule,
    TooltipModule,
    DropdownModule,
    MessagesModule,
    MessageModule
  ],
  exports: [
    ProductionCountByTransactionCategoryComponent,
    PendedRequestAgeComponent
  ]
})
export class DashboardModule {}
