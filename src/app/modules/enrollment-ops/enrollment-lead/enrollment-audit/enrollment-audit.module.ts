import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentAuditComponent } from "./components/enrollment-audit/enrollment-audit.component";
import { RequestTypeComponent } from "./components/request-type/request-type.component";
import { TransactionStrategyComponent } from "./components/transaction-strategy/transaction-strategy.component";
import { RouterModule, Routes } from "@angular/router";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { CheckboxModule } from "primeng/checkbox";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { DropdownModule } from "primeng/dropdown";

const routes: Routes = [
  {
    path: "",
    component: EnrollmentAuditComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "/enrollment-audit",
    component: EnrollmentAuditComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [
    EnrollmentAuditComponent,
    RequestTypeComponent,
    TransactionStrategyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleChartsModule,
    CalendarModule,
    DialogModule,
    TableModule,
    RouterModule.forChild(routes),
    ConfirmDialogModule,
    CheckboxModule,
    ComponentsModule,
    DropdownModule
  ]
})
export class EnrollmentAuditModule {}
