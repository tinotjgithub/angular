import { Routes, RouterModule } from "@angular/router";
import { TargetSettingsComponent } from "./target-settings.component";
import { ClaimsTargetSettingsComponent } from "./claims-target-settings/claims-target-settings.component";
import { EnrollmentTargetSettingsComponent } from "./enrollment-target-settings/enrollment-target-settings.component";
import { NgModule } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { GoogleChartsModule } from "angular-google-charts";
import { CardModule } from "primeng/card";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import {
  FormsModule,
  ReactiveFormsModule,
  FormControlName,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MultiSelectModule } from "primeng/multiselect";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { RadioButtonModule } from "primeng/radiobutton";
import { CheckboxModule } from "primeng/checkbox";

const routes: Routes = [
  {
    path: "TargetSettings",
    component: TargetSettingsComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "ClaimsTargetSettings",
    component: ClaimsTargetSettingsComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "EnrollmentTargetSettings",
    component: EnrollmentTargetSettingsComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [
    TargetSettingsComponent,
    EnrollmentTargetSettingsComponent,
    ClaimsTargetSettingsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    CalendarModule,
    TableModule,
    DropdownModule,
    ProgressSpinnerModule,
    TooltipModule,
    GoogleChartsModule,
    ButtonModule,
    CommonModule,
    RadioButtonModule,
    DialogModule,
    CardModule,
    MultiSelectModule,
    ComponentsModule
  ],
  exports: [
    TargetSettingsComponent,
    EnrollmentTargetSettingsComponent,
    ClaimsTargetSettingsComponent
  ]
})
export class TargetSettingsModule {}
