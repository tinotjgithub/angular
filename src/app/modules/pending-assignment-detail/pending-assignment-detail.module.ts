import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PendingAssignmentDetailComponent } from "./components/pending-assignment-detail/pending-assignment-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { FormsModule } from "@angular/forms";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

const routes: Routes = [
  {
    path: "",
    component: PendingAssignmentDetailComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "enrollment",
    component: PendingAssignmentDetailComponent,
    data: {
      breadcrumb: [],
      isEnrollment: true
    }
  }
];

@NgModule({
  declarations: [PendingAssignmentDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TooltipModule,
    DialogModule,
    TableModule,
    FormsModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class PendingAssignmentDetailModule {}
