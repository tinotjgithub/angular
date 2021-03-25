import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualClaimSelectionComponent } from './manual-claim-selection.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  {
    path: '',
    component: ManualClaimSelectionComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ManualClaimSelectionComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ButtonModule,
    TooltipModule,
    MultiSelectModule,
    DropdownModule,
    RouterModule.forChild(routes),
    DialogModule
  ]
})
export class ManualClaimSelectionModule { }
