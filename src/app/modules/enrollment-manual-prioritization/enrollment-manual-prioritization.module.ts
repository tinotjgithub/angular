import { ConfirmationService } from "primeng/api";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentManualPrioritizationComponent } from "./components/enrollment-manual-prioritization/enrollment-manual-prioritization.component";
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
import { MultiSelectModule } from "primeng/multiselect";

const routes: Routes = [
  {
    path: "",
    component: EnrollmentManualPrioritizationComponent,
    data: {
      breadcrumb: [],
    },
  },
  {
    path: "enrollment-manual-prioritization",
    component: EnrollmentManualPrioritizationComponent,
    data: {
      breadcrumb: [{ label: "Manual Prioritization" }],
    },
  },
];

@NgModule({
  declarations: [EnrollmentManualPrioritizationComponent],
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
    MultiSelectModule,
  ],
  providers: [ConfirmationService],
})
export class EnrollmentManualPrioritizationModule {}
