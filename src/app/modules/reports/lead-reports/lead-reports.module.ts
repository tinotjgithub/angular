import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadReportComponent } from './lead-report/lead-report.component';
import { ReportsModule } from '../reports.module';
import { AuditSamplingDeletionReportModule } from '../../audit-sampling-deletion/audit-sampling-deletion.module';
import { AuditedClaimsReportModule } from '../../audited-claims-report/audited-claims-report.module';
import { ClaimReassignmentModule } from '../../claim-reassignment/claim-reassignment.module';
import { RouterModule, Routes } from '@angular/router';
import { ClaimCompletionReportModule } from '../claim-completion-report/claim-completion-report.module';

const route: Routes = [
  {
    path: '',
    component: LeadReportComponent,
    data: {
      breadcrumb: []
    }
  }
];


@NgModule({
  declarations: [LeadReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    ReportsModule,
    AuditedClaimsReportModule,
    ClaimReassignmentModule,
    AuditSamplingDeletionReportModule,
    ClaimCompletionReportModule
  ]
})
export class LeadReportsModule { }
