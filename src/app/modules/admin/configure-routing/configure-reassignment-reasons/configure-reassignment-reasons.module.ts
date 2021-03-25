import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureReassignmentReasonsComponent } from './configure-reassignment-reasons.component';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const routes: Routes = [
  {
    path: "",
    component: ConfigureReassignmentReasonsComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ConfigureReassignmentReasonsComponent],
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule
  ]
})
export class ConfigureReassignmentReasonsModule { }
