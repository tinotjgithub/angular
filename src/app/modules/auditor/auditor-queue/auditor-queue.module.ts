import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditorQueueComponent } from './auditor-queue.component';
import { Routes, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { CanDeactivateGuard } from 'src/app/guards/route.guard/can-deactivate.gaurd';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RebuttalQueueComponent } from './rebuttal-queue/rebuttal-queue.component';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import {StepsModule} from 'primeng/steps';

const routes: Routes = [
  {
    path: '',
    component: AuditorQueueComponent,
    data: {
      breadcrumb: [{ label: "Auditor Queue" }]
    },
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'rebuttal',
    component: RebuttalQueueComponent,
    data: {
      breadcrumb: [{ label: "Review/Rebuttal Queue" }]
    },
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  declarations: [AuditorQueueComponent, RebuttalQueueComponent],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    ComponentsModule,
    DialogModule,
    ButtonModule,
    PickListModule,
    ConfirmDialogModule,
    TabViewModule,
    RouterModule.forChild(routes),
    AccordionModule,
    StepsModule
  ],
  providers: [ConfirmationService]
})
export class AuditorQueueModule { }
