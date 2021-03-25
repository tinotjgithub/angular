import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditDetailsComponent } from './audit-details/audit-details.component';
import { RouterModule, Routes } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { QueuePageComponent } from './queue-page/queue-page.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  {
    path: '',
    component: AuditDetailsComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: 'queue-summary',
    component: QueuePageComponent,
    data: {
      breadcrumb: [{label: 'Queue Summary'}]
    }
  }
];

@NgModule({
  declarations: [AuditDetailsComponent, QueuePageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleChartsModule,
    CalendarModule,
    DialogModule,
    TableModule,
    RouterModule.forChild(routes),
    ConfirmDialogModule,
    CheckboxModule,
    ComponentsModule,
    DropdownModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class ClaimsAuditModule { }
