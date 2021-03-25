import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentAuditLandingPageComponent } from "./components/enrollment-audit-landing-page/enrollment-audit-landing-page.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";

const routes: Routes = [
  {
    path: "",
    component: EnrollmentAuditLandingPageComponent,
    data: {
      breadcrumb: [{ label: "Enrollment Audit" }]
    }
  }
];

@NgModule({
  declarations: [EnrollmentAuditLandingPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    CheckboxModule
  ]
})
export class EnrollmentAuditLandingPageModule {}
