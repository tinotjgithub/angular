import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentManualSamplingComponent } from "./components/enrollment-manual-sampling/enrollment-manual-sampling.component";
import { Routes, RouterModule } from "@angular/router";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { FieldsetModule } from "primeng/fieldset";
import { AccordionModule } from "primeng/accordion";
import { CardModule } from "primeng/card";
import { ChipsModule } from "primeng/chips";
import { ReactiveFormsModule } from "@angular/forms";
import { PickListModule } from "primeng/picklist";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { RadioButtonModule } from "primeng/radiobutton";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { MultiSelectModule } from "primeng/multiselect";
import { NavigationGuard } from "src/app/guards/navigation.guard/navigation.guard";
import { AddToAuditQueueListComponent } from './components/add-to-audit-queue-list/add-to-audit-queue-list.component';


const routes: Routes = [
  {
    path: "",
    component: EnrollmentManualSamplingComponent,
    data: {
      breadcrumb: [{ label: "Manual Audit Sampling" }]
    }
  },
  {
    path: "enrollment-manual-sampling",
    component: EnrollmentManualSamplingComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "add-to-audit-queue-detail",
    canActivate: [NavigationGuard],
    component: AddToAuditQueueListComponent,
    data: {
      breadcrumb: [
        { label: "Manual Sampling", url: "enrollment-manual-sampling" },
        { label: "Audit Queue Detail" }
      ]
    }
  }
];
@NgModule({
  declarations: [
    EnrollmentManualSamplingComponent,
    AddToAuditQueueListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FieldsetModule,
    CommonModule,
    CheckboxModule,
    FormsModule,
    AccordionModule,
    CardModule,
    ChipsModule,
    PickListModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    TableModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ComponentsModule,
    MultiSelectModule
  ]
})
export class EnrollmentManualSamplingModule {}
