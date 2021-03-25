import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimReassignmentComponent } from "./components/claim-reassignment/claim-reassignment.component";
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
import { ClaimReassignmentReportComponent } from "./components/claim-reassignment-report/claim-reassignment-report.component";
const routes: Routes = [
  {
    path: "reassignment",
    component: ClaimReassignmentComponent,
    data: {
      breadcrumb: [
        {label: "Action", url: "/actions"},
        {label: "Claim Reassignment"}
      ]
    }
  }
];
@NgModule({
  declarations: [ClaimReassignmentComponent, ClaimReassignmentReportComponent],
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
    ComponentsModule,
  ],
  providers: [ConfirmationService],
  exports: [ClaimReassignmentReportComponent]
})
export class ClaimReassignmentModule {}
