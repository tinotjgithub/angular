import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistComponent } from './checklist.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  {
    path: '',
    component: ChecklistComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ChecklistComponent],
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DialogModule
  ]
})
export class ChecklistModule { }
