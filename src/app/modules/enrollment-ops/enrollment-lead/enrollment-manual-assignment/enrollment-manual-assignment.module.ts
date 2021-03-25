import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmemtManualAssignmentComponent } from "./components/enrollmemt-manual-assignment/enrollmemt-manual-assignment.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { ConfirmationService, MessageService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";

const routes: Routes = [
  {
    path: "",
    component: EnrollmemtManualAssignmentComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [EnrollmemtManualAssignmentComponent],
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
    MultiSelectModule,
    CardModule,
    AutoCompleteModule,
    ComponentsModule,
    CalendarModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class EnrollmentManualAssignmentModule {}
