import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TodayQueueBacklogSummaryComponent } from './today-queue-backlog-summary/today-queue-backlog-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RebutReviewListComponent } from './rebut-review-list/rebut-review-list.component';
import { DialogModule } from 'primeng/dialog';
import { AuditDetailsPageComponent } from './audit-details-page/audit-details-page.component';
import { RebuttalListComponent } from './rebuttal-list/rebuttal-list.component';

const routes: Routes = [
  {
    path: 'queue-summary',
    component: TodayQueueBacklogSummaryComponent,
    data: {
      breadcrumb: [{ label: 'Claims Queue Summary'}]
    }
  },
  {
    path: 'queue-rebuttal',
    component: RebutReviewListComponent,
    data: {
      breadcrumb: [{ label: 'Rebuttal/Review Queue'}]
    }
  },
  {
    path: 'audit-details',
    component: AuditDetailsPageComponent,
    data: {
      breadcrumb: [{ label: 'Audit Queue Summary'}]
    }
  },
  {
    path: 'rebuttal-details',
    component: RebuttalListComponent,
    data: {
      breadcrumb: [{ label: 'Rebuttal Queue Summary'}]
    }
  },
];

@NgModule({
  declarations: [TodayQueueBacklogSummaryComponent, RebutReviewListComponent, AuditDetailsPageComponent, RebuttalListComponent],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    ComponentsModule,
    ButtonModule,
    DialogModule,
    RouterModule.forChild(routes)
  ]
})
export class AuditorModule { }
