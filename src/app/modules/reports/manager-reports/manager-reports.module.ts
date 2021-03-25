import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerReportComponent } from './manager-report/manager-report.component';
import { Routes, RouterModule } from '@angular/router';
import { ReportsModule } from '../reports.module';
import { AuditedClaimsReportModule } from '../../audited-claims-report/audited-claims-report.module';
import { ClaimReassignmentModule } from '../../claim-reassignment/claim-reassignment.module';
import { AuditSamplingDeletionReportModule } from '../../audit-sampling-deletion/audit-sampling-deletion.module';
import { MangerReportsModule } from '../../manager/reports/manager-reports.module';
import { ClaimCompletionReportModule } from '../claim-completion-report/claim-completion-report.module';

const route: Routes = [
  {
    path: '',
    component: ManagerReportComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ManagerReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    ReportsModule,
    AuditedClaimsReportModule,
    ClaimReassignmentModule,
    AuditSamplingDeletionReportModule,
    MangerReportsModule,
    ClaimCompletionReportModule
  ]
})
export class ManagerReportsModule { }
