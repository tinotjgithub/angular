import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendbackReasonComponent } from './sendback-reason/sendback-reason.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';

const routes: Routes = [
  {
    path: "",
    component: SendbackReasonComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [SendbackReasonComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule,
    CheckboxModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    CardModule,
    MessageModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class ConfigureSendbackReasonsModule { }
