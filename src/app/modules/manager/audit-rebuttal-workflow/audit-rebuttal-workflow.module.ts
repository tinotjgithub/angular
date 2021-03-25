import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuditRebuttalWorkflowComponent } from "./audit-rebuttal-workflow.component";
import { ClaimsAuditRebuttalWorkflowComponent } from "./claims-audit-rebuttal-workflow/claims-audit-rebuttal-workflow.component";
// tslint:disable-next-line: max-line-length
import { EnrollmentAuditRebuttalWorkflowComponent } from "./enrollment-audit-rebuttal-workflow/components/enrollment-audit-rebuttal-workflow/enrollment-audit-rebuttal-workflow.component";
import { CanDeactivateGuard } from "src/app/guards/route.guard/can-deactivate.gaurd";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";

const routes: Routes = [
  {
    path: "",
    component: AuditRebuttalWorkflowComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "/audit-rebuttal-workflow",
    component: AuditRebuttalWorkflowComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "/enrollment-audit-rebuttal-workflow",
    component: EnrollmentAuditRebuttalWorkflowComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  declarations: [
    AuditRebuttalWorkflowComponent,
    ClaimsAuditRebuttalWorkflowComponent,
    EnrollmentAuditRebuttalWorkflowComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ButtonModule
  ]
})
export class AuditRebuttalWorkflowModule {}
