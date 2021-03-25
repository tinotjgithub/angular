import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfigureExaminerProductivityComponent } from "./configure-examiner-productivity/configure-examiner-productivity.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmationService } from "primeng/api";
import {CheckboxModule} from 'primeng/checkbox';

const routes: Routes = [
  {
    path: "",
    component: ConfigureExaminerProductivityComponent,
    data: {
      breadcrumb: [{ label: "Examiner Productivity Configuration" }],
      enrollment: false 
    }
  },
  {
    path: "specialist",
    component: ConfigureExaminerProductivityComponent,
    data: {
      breadcrumb: [{ label: "Specialist Productivity Configuration" }],
      enrollment: true 
    }
  }
];

@NgModule({
  declarations: [ConfigureExaminerProductivityComponent],
  imports: [
    CommonModule,
    CalendarModule,
    CheckboxModule,
    TooltipModule,
    RouterModule.forChild(routes),
    FormsModule,
    ConfirmDialogModule,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService]
})
export class ConfigureExaminerProductivityModule {}
