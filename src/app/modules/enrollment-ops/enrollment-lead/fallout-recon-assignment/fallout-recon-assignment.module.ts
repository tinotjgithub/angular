import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FalloutReconAssignmentComponent } from "./components/fallout-recon-assignment/fallout-recon-assignment.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmationService } from 'primeng/api';

const routes: Routes = [
  {
    path: "",
    component: FalloutReconAssignmentComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [FalloutReconAssignmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    CardModule,
    AutoCompleteModule,
    ComponentsModule,
    CalendarModule,
    MultiSelectModule,
    CheckboxModule
  ],
  providers: [ConfirmationService]
})
export class FalloutReconAssignmentModule {}
