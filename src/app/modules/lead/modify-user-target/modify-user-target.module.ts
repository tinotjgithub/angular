import { Routes, RouterModule } from "@angular/router";
import { ModifyUserTargetComponent } from "./modify-user-target.component";
import { NgModule } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { EditUserComponent } from '../../admin/user-management/edit-user/edit-user.component';

const routes: Routes = [
  {
    path: "",
    component: ModifyUserTargetComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: 'UserConfig/edit-user',
    component: EditUserComponent,
    data: {
      breadcrumb: [{ label: "Modify Users" }]
    }
  }
];

@NgModule({
  declarations: [ModifyUserTargetComponent, EditUserComponent],
  imports: [RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CommonModule,
    CalendarModule,
    DialogModule]
})
export class ModifyUserTargetModule {}
