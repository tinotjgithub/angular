import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentAutoSamplingComponent } from "./components/enrollment-auto-sampling/enrollment-auto-sampling.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { PickListModule } from 'primeng/picklist';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  {
    path: "",
    component: EnrollmentAutoSamplingComponent,
    data: { breadcrumb: [{ label: "Automated Audit Sampling" }] }
  },
  {
    path: "enrollmet-auto-sampling",
    component: EnrollmentAutoSamplingComponent,
    data: { breadcrumb: [{ label: "Automated Audit Sampling" }] }
  }
];

@NgModule({
  declarations: [EnrollmentAutoSamplingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    ComponentsModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    MultiSelectModule,
    ConfirmDialogModule,
    CalendarModule,
    RouterModule.forChild(routes)
  ]
})
export class EnrollmentAutoSamplingModule {}
