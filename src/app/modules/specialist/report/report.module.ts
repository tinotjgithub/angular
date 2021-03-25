import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { MemberCountByStatusTransactionComponent } from './member-count-by-status-transaction/member-count-by-status-transaction.component';
import { AuditStatusComponent } from './audit-status/audit-status.component';
import { AuditRebuttalComponent } from './audit-rebuttal/audit-rebuttal.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportsModule } from '../../reports/reports.module';
import { CalendarModule } from 'primeng/calendar';

const route: Routes = [
  {
    path: '',
    component: ReportComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ReportComponent, MemberCountByStatusTransactionComponent, AuditStatusComponent, AuditRebuttalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    ReportsModule,
    CalendarModule
  ]
})
export class ReportModule { }
