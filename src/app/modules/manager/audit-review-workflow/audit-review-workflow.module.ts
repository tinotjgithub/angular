import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// tslint:disable-next-line: max-line-length
import { CanDeactivateGuard } from "src/app/guards/route.guard/can-deactivate.gaurd";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { AuditReviewWorkflowComponent } from "./audit-review-workflow.component";
import { ClaimsAuditReviewWorkflowComponent } from "./claims-audit-review-workflow/claims-audit-review-workflow.component";
// tslint:disable-next-line: max-line-length
import { EnrollmentAuditReviewWorkflowComponent } from "./enrollment-audit-review-workflow/compoents/enrollment-audit-review-workflow/enrollment-audit-review-workflow.component";
const routes: Routes = [
  {
    path: "",
    component: AuditReviewWorkflowComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "ReviewWorkflow",
    component: AuditReviewWorkflowComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "/enrollment-audit-review-workflow",
    component: EnrollmentAuditReviewWorkflowComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  declarations: [
    AuditReviewWorkflowComponent,
    ClaimsAuditReviewWorkflowComponent,
    EnrollmentAuditReviewWorkflowComponent 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ButtonModule
  ]
})
export class AuditReviewWorkflowModule {}
