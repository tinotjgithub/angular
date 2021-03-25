import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { DrawModeComponent } from './draw-mode.component';
import { TooltipModule } from 'primeng/tooltip';
import { GoogleChartsModule } from 'angular-google-charts';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
const routes: Routes = [
  {
    path: '',
    component: DrawModeComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [DrawModeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    TooltipModule,
    GoogleChartsModule,
    CardModule,
    ButtonModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class DrawmodeModule { }
