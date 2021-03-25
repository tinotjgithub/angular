import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureTransactionCategoryComponent } from './configure-transaction-category.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

const routes: Routes = [
  {
    path: "",
    component: ConfigureTransactionCategoryComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ConfigureTransactionCategoryComponent],
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
  ],
  providers: [ConfirmationService]
})
export class ConfigureTransactionCategoryModule { }
