import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyUsersComponent } from "./my-users/my-users.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { AuthGuard } from "src/app/guards/auth.guard/auth.guard";
import { MessageModule } from "primeng/message";
import { TooltipModule } from 'primeng/tooltip';

const routes: Routes = [
  {
    path: "MyUsers",
    component: MyUsersComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "My Users" }]
    }
  }
];

@NgModule({
  declarations: [MyUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    ReactiveFormsModule,
    TableModule,
    MultiSelectModule,
    ComponentsModule,
    CalendarModule,
    DropdownModule,
    MessageModule,
    RouterModule.forChild(routes)
  ],
  exports: [MyUsersComponent]
})
export class MangerReportsModule { }
