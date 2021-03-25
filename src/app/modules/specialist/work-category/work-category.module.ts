import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WorkCategoryComponent } from "./work-category/work-category.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ComponentsModule } from "src/app/shared/components/components.module";
// tslint:disable-next-line: max-line-length
import { SpecialistCompletedDetailPageComponent } from "./specialist-detail-pages/specialist-completed-detail-page/specialist-completed-detail-page.component";
// tslint:disable-next-line: max-line-length
import { SpecialistAssignedDetailPageComponent } from "./specialist-detail-pages/specialist-assigned-detail-page/specialist-assigned-detail-page.component";
// tslint:disable-next-line: max-line-length
import { SpecialistPendedDetailPageComponent } from "./specialist-detail-pages/specialist-pended-detail-page/specialist-pended-detail-page.component";
// tslint:disable-next-line: max-line-length
import { SpecialistRoutedOutDetailPageComponent } from "./specialist-detail-pages/specialist-routed-out-detail-page/specialist-routed-out-detail-page.component";
// tslint:disable-next-line: max-line-length
import { SpecialistAuditFailedDetailPageComponent } from "./specialist-detail-pages/specialist-audit-failed-detail-page/specialist-audit-failed-detail-page.component";
import { ConfirmationService } from "primeng/api";
import { CanDeactivateGuard } from 'src/app/guards/route.guard/can-deactivate.gaurd';
import { TooltipModule } from 'primeng/tooltip';
const routes: Routes = [
  {
    path: "",
    component: WorkCategoryComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "assigned-details",
    component: SpecialistAssignedDetailPageComponent,
    data: {
      breadcrumb: [{ label: "Assigned Details" }]
    }
  },
  {
    path: "completed-details",
    component: SpecialistCompletedDetailPageComponent,
    data: {
      breadcrumb: [{ label: "Completed Details" }]
    }
  },
  {
    path: "routed-out-details",
    component: SpecialistRoutedOutDetailPageComponent,
    data: {
      breadcrumb: [{ label: "Routed Out Details" }]
    }
  },
  {
    path: "pended-details",
    component: SpecialistPendedDetailPageComponent,
    data: {
      breadcrumb: [{ label: "Pended Details" }]
    }
  },
  {
    path: "audit-failed-details",
    component: SpecialistAuditFailedDetailPageComponent,
    data: {
      breadcrumb: [{ label: "Audit Failed Details" }]
    }
  }
];

@NgModule({
  declarations: [
    WorkCategoryComponent,
    SpecialistCompletedDetailPageComponent,
    SpecialistRoutedOutDetailPageComponent,
    SpecialistPendedDetailPageComponent,
    SpecialistAuditFailedDetailPageComponent,
    SpecialistAssignedDetailPageComponent
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
    TooltipModule
  ],
  providers: [ConfirmationService]
})
export class WorkCategoryModule {}
