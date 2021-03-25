import { CheckboxModule } from "primeng/checkbox";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetailTableComponent } from "./detail-table/detail-table.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ConfirmationService } from "primeng/api";
import { GeneralQueueComponent } from "./general-queue/general-queue.component";
import { SpecialistComponent } from "./specialist/specialist.component";
import { MultiSelectModule } from "primeng/multiselect";
import { PendedComponent } from "./pended/pended.component";
import { AssignedComponent } from "./assigned/assigned.component";
import { AuditFailedComponent } from "./audit-failed/audit-failed.component";
import { CompletedComponent } from "./completed/completed.component";
import { RoutedInComponent } from "./routed-in/routed-in.component";
import { ReviewRebuttalComponent } from "./review-rebuttal/review-rebuttal.component";

const routes: Routes = [
  {
    path: "general",
    component: GeneralQueueComponent,
    data: {
      breadcrumb: [
        {
          label: "General Queue",
          routerLink: "/enrollment-lead-detail/general",
          onlyParam: true
        }
      ]
    }
  },
  {
    path: "specialist",
    component: SpecialistComponent,
    data: {
      breadcrumb: [{ label: "Enrollment Specialist" }]
    }
  },
  {
    path: "pended",
    component: PendedComponent,
    data: {
      breadcrumb: [{ label: "Pended Queue" }]
    }
  },
  {
    path: "assigned",
    component: AssignedComponent,
    data: {
      breadcrumb: [{ label: "Assigned Queue" }]
    }
  },
  {
    path: "completed",
    component: CompletedComponent,
    data: {
      breadcrumb: [{ label: "Completed" }]
    }
  },
  {
    path: "routed-in",
    component: RoutedInComponent,
    data: {
      breadcrumb: [{ label: "Routed In" }]
    }
  },
  {
    path: "audit-failed",
    component: AuditFailedComponent,
    data: {
      breadcrumb: [{ label: "Audit Failed" }]
    }
  },
  {
    path: "rebuttal-review",
    component: ReviewRebuttalComponent,
    data: {
      breadcrumb: [{ label: "Rebuttal/Review" }]
    }
  }
];

@NgModule({
  declarations: [
    DetailTableComponent,
    GeneralQueueComponent,
    AuditFailedComponent,
    SpecialistComponent,
    PendedComponent,
    AssignedComponent,
    CompletedComponent,
    RoutedInComponent,
    ReviewRebuttalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule,
    ComponentsModule,
    MultiSelectModule,
    CheckboxModule
  ],
  providers: [ConfirmationService],
  exports: [DetailTableComponent]
})
export class DetailPageLeadModule {}
