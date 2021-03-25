import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { CalendarModule } from 'primeng/calendar';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ListPageComponent } from './list-page/list-page.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  {
    path: 'list',
    component: ListPageComponent,
    data: {
      breadcrumb: [],
    }
  }
];

@NgModule({
  declarations: [NotificationComponent, ListPageComponent],
  imports: [
    CommonModule,
    CalendarModule,
    RouterModule.forChild(routes),
    FormsModule,
    TooltipModule,
    TableModule,
    DialogModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  exports: [NotificationComponent]
})
export class NotificationModule { }
