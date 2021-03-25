import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { MessageService } from "primeng/api";
import { AddUserComponent } from "./add-user/add-user.component";
import { CalendarModule } from "primeng/calendar";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { DialogModule } from "primeng/dialog";
import { ModifyUserPopupComponent } from "./modify-user-popup/modify-user-popup.component";
import { ManualSynchronizationComponent } from "./manual-synchronization/manual-synchronization.component";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MultiSelectModule } from 'primeng/multiselect';
import {PaginatorModule} from 'primeng/paginator';

const routes: Routes = [
  /* {
    path: '',
    component: UserManagementComponent,
    data: {
      breadcrumb: []
    }
  } */
  // {
  //   path: "",
  //   redirectTo: "add-user"
  // },
  {
    path: "edit-user",
    component: EditUserComponent,
    data: {
      breadcrumb: [{label: 'Manage Users'}]
    }
  },
  {
    path: "modify-user-popup",
    component: ModifyUserPopupComponent,
    data: {
      breadcrumb: [{ label: "Modify User Popup" }]
    }
  },
  {
    path: "manual-sync",
    component: ManualSynchronizationComponent,
    data: {
      breadcrumb: [{ label: "Configuration", url: '/configuration-menu' }, { label: "Manual Synchronization" }]
    }
  }
];

@NgModule({
  declarations: [
    AddUserComponent,
    EditUserComponent,
    ModifyUserPopupComponent,
    ManualSynchronizationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TooltipModule,
    CalendarModule,
    ProgressSpinnerModule,
    DialogModule,
    ButtonModule,
    ComponentsModule,
    MultiSelectModule,
    PaginatorModule
  ],
  providers: [MessageService],
  exports: [AddUserComponent]
})
export class AdminUserManagementModule { }
