import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveUserSnapshotComponent } from "./active-user-snapshot/active-user-snapshot.component";
import { Routes, RouterModule } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";
import { AdminUserManagementModule } from "../user-management/admin-user-management.module";
import { DialogModule } from "primeng/dialog";
import { NotificationModule } from '../notification/notification.module';
import { TableModule } from 'primeng/table';

const routes: Routes = [
  {
    path: "",
    component: ActiveUserSnapshotComponent,
    data: {
      breadcrumb: [],
    },
  },
];

@NgModule({
  declarations: [ActiveUserSnapshotComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TooltipModule,
    AdminUserManagementModule,
    TableModule,
    DialogModule,
    NotificationModule
  ],
})
export class ActiveUserSnapshotModule {
  constructor() {}
}
