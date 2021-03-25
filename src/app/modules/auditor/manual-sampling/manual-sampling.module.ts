import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ManualSamplingComponent } from "./components/manual-sampling/manual-sampling.component";
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
import { AddToAuditQueueListComponent } from "./components/add-to-audit-queue-list/add-to-audit-queue-list.component";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NavigationGuard } from 'src/app/guards/navigation.guard/navigation.guard';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
const routes: Routes = [
  {
    path: "",
    component: ManualSamplingComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "manual-sampling",
    component: ManualSamplingComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "add-to-audit-queue-detail",
    canActivate: [NavigationGuard],
    component: AddToAuditQueueListComponent,
    data: {
      breadcrumb: [{ label: "Audit Queue Detail" }]
    }
  }
];

@NgModule({
  declarations: [ManualSamplingComponent, AddToAuditQueueListComponent],
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
    MultiSelectModule,
    AutoCompleteModule
  ]
})
export class ManualSamplingModule {}
