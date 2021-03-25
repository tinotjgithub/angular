import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuditSamplingDeletionReportComponent } from "./audit-sampling-deletion-report/audit-sampling-deletion-report.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { AutoCompleteModule } from "primeng/autocomplete";
import { MultiSelectModule } from "primeng/multiselect";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ConfirmationService } from "primeng/api";
const routes: Routes = [
  {
    path: "report",
    component: AuditSamplingDeletionReportComponent,
    data: {
      breadcrumb: [
        { label: "Reports" },
        { label: "Audit Sampling Claim Deletion Report" }
      ],
      expectedChildRoles: ["Manager", "Claims Lead"]
    }
  }
];
@NgModule({
  declarations: [AuditSamplingDeletionReportComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CommonModule,
    CalendarModule,
    DialogModule,
    TooltipModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    CheckboxModule,
    AutoCompleteModule,
    MultiSelectModule,
    ComponentsModule
  ],
  providers: [ConfirmationService],
  exports: [AuditSamplingDeletionReportComponent]
})
export class AuditSamplingDeletionReportModule {}
