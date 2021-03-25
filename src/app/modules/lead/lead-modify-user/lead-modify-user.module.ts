import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { LeadModifyUserComponent } from './lead-modify-user.component';
import { TooltipModule } from 'primeng/tooltip';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { PaginatorModule } from 'primeng/paginator';

const routes: Routes = [
  {
    path: "",
    component: LeadModifyUserComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [LeadModifyUserComponent],
  imports: [RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TooltipModule,
    CommonModule,
    CalendarModule,
    DialogModule,
    ComponentsModule,
    PaginatorModule
  ]
})
export class LeadModifyUserModule { }
